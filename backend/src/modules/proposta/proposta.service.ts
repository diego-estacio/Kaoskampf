import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Proposta, StatusProposta } from "../../entities/proposta.entity";
import {
  PropostaItem,
  TipoDesconto,
  PricingTier,
} from "../../entities/proposta-item.entity";
import { CatalogoItem } from "../../entities/catalogo-item.entity";
import { Contato, StatusContato } from "../../entities/contato.entity";
import { Timeline, TipoAtividade } from "../../entities/timeline.entity";
import { Marca } from "../../entities/marca.entity";
import { Usuario } from "../../entities/usuario.entity";
import { PlannerWebhookService } from "../planner/planner-webhook.service";

export interface PropostaItemInput {
  itemCatalogoId?: string | null;
  nome?: string;
  descricao?: string;
  inclui?: string;
  naoInclui?: string;
  quantidade: number;
  precoUnitario?: number;
  tipoDesconto?: TipoDesconto | null;
  valorDesconto?: number | null;
  pricingTier?: "G" | "M" | "P" | null;
}

export interface CriarPropostaDto {
  contatoId: string;
  marcaId?: number | null;
  titulo: string;
  introducao?: string;
  moeda?: "BRL" | "USD" | "EUR";
  tipoDescontoGlobal?: TipoDesconto | null;
  valorDescontoGlobal?: number | null;
  itens: PropostaItemInput[];
}

export interface AtualizarPropostaDto {
  titulo?: string;
  introducao?: string;
  status?: StatusProposta;
  moeda?: "BRL" | "USD" | "EUR";
  tipoDescontoGlobal?: TipoDesconto | null;
  valorDescontoGlobal?: number | null;
  itens?: PropostaItemInput[];
}

@Injectable()
export class PropostaService {
  constructor(
    @InjectRepository(Proposta)
    private propostaRepository: Repository<Proposta>,
    @InjectRepository(PropostaItem)
    private itemRepository: Repository<PropostaItem>,
    @InjectRepository(CatalogoItem)
    private catalogoRepository: Repository<CatalogoItem>,
    @InjectRepository(Contato)
    private contatoRepository: Repository<Contato>,
    @InjectRepository(Timeline)
    private timelineRepository: Repository<Timeline>,
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private plannerWebhook: PlannerWebhookService,
  ) {}

  private calcularTotaisItem(input: PropostaItemInput, basePreco: number) {
    const quantidade = input.quantidade ?? 1;
    const precoUnitario = input.precoUnitario ?? basePreco;
    let precoTotal = quantidade * precoUnitario;
    let valorDesconto: number | null = null;

    if (input.tipoDesconto && input.valorDesconto != null) {
      if (input.tipoDesconto === TipoDesconto.VALOR) {
        precoTotal = precoTotal - input.valorDesconto;
        valorDesconto = input.valorDesconto;
      } else if (input.tipoDesconto === TipoDesconto.PERCENTUAL) {
        const descontoValor = (precoTotal * input.valorDesconto) / 100;
        precoTotal = precoTotal - descontoValor;
        valorDesconto = input.valorDesconto;
      }
    }

    if (precoTotal < 0) {
      precoTotal = 0;
    }

    return {
      quantidade,
      precoUnitario,
      precoTotal,
      tipoDesconto: input.tipoDesconto ?? null,
      valorDesconto,
    };
  }

  async listarPorContato(contatoId: string): Promise<Proposta[]> {
    return this.propostaRepository.find({
      where: { contatoId },
      relations: ["empresa", "contato"],
      order: { criadoEm: "DESC" },
    });
  }

  async listarTodos(filtros?: {
    contatoId?: string;
    empresaId?: string;
  }): Promise<Proposta[]> {
    const where: any = {};

    if (filtros?.contatoId) {
      where.contatoId = filtros.contatoId;
    }

    if (filtros?.empresaId) {
      where.empresaId = filtros.empresaId;
    }

    return this.propostaRepository.find({
      where,
      relations: ["empresa", "contato"],
      order: { criadoEm: "DESC" },
    });
  }

  async buscarPorId(id: string): Promise<Proposta> {
    const proposta = await this.propostaRepository.findOne({
      where: { id },
      relations: ["empresa", "contato", "itens", "marca", "usuarioCriador"],
    });
    if (!proposta) {
      throw new NotFoundException("Proposta não encontrada");
    }
    return proposta;
  }

  async criar(dto: CriarPropostaDto, usuarioId: string): Promise<Proposta> {
    const contato = await this.contatoRepository.findOne({
      where: { id: dto.contatoId },
      relations: ["empresa"],
    });
    if (!contato || !contato.empresa) {
      throw new BadRequestException("Contato ou empresa não encontrados");
    }

    // Gerar número sequencial da proposta
    const count = await this.propostaRepository.count();
    const numero = String(count + 1).padStart(4, "0");

    // Primeiro criamos e salvamos a proposta "pai" sem itens,
    // para garantir que o ID exista antes de inserir os itens
    const proposta = this.propostaRepository.create({
      numero,
      titulo: dto.titulo,
      introducao: dto.introducao ?? null,
      moeda: dto.moeda ?? "BRL",
      status: StatusProposta.RASCUNHO,
      empresaId: contato.empresaId,
      contatoId: contato.id,
      usuarioCriadorId: usuarioId,
      marcaId: dto.marcaId ?? null,
      tipoDescontoGlobal: dto.tipoDescontoGlobal ?? null,
      valorDescontoGlobal: dto.valorDescontoGlobal ?? null,
      valorTotal: 0,
    });

    const propostaSalva = await this.propostaRepository.save(proposta);

    const itens: PropostaItem[] = [];
    let valorTotal = 0;

    for (let index = 0; index < dto.itens.length; index++) {
      const input = dto.itens[index];
      let baseNome = input.nome ?? "";
      let baseDescricao = input.descricao ?? null;
      let baseInclui = input.inclui ?? null;
      let baseNaoInclui = input.naoInclui ?? null;
      let basePreco = input.precoUnitario ?? 0;
      let itemCatalogoId: string | null = null;
      let pricingTier: PricingTier | null = null;

      if (input.itemCatalogoId) {
        const catalogo = await this.catalogoRepository.findOne({
          where: { id: input.itemCatalogoId },
        });
        if (catalogo) {
          itemCatalogoId = catalogo.id;
          if (!baseNome) {
            baseNome = `${catalogo.tipo} - ${catalogo.especificacoes}`;
          }
          if (!baseDescricao) {
            baseDescricao = catalogo.descricao ?? null;
          }
          if (!baseInclui) {
            baseInclui = catalogo.inclui ?? null;
          }
          if (!baseNaoInclui) {
            baseNaoInclui = catalogo.naoInclui ?? null;
          }
          if (!input.precoUnitario) {
            const tier = input.pricingTier ?? "G";
            if (tier === "M" && catalogo.precoM != null) {
              basePreco = Number(catalogo.precoM);
            } else if (tier === "P" && catalogo.precoP != null) {
              basePreco = Number(catalogo.precoP);
            } else {
              basePreco = Number(catalogo.precoG);
            }
          }
          if (input.pricingTier) {
            pricingTier = PricingTier[input.pricingTier] ?? null;
          }
        }
      }

      const calculado = this.calcularTotaisItem(input, basePreco);

      const item = this.itemRepository.create({
        proposta: propostaSalva,
        propostaId: propostaSalva.id,
        itemCatalogoId,
        nome: baseNome,
        descricao: baseDescricao,
        inclui: baseInclui,
        naoInclui: baseNaoInclui,
        quantidade: calculado.quantidade,
        precoUnitario: calculado.precoUnitario,
        tipoDesconto: calculado.tipoDesconto,
        valorDesconto: calculado.valorDesconto,
        precoTotal: calculado.precoTotal,
        ordem: index,
        pricingTier,
      });

      valorTotal += calculado.precoTotal;
      itens.push(item);
    }

    if (itens.length > 0) {
      await this.itemRepository.save(itens);
    }

    // Aplicar desconto global se houver
    let valorFinal = valorTotal;
    if (dto.tipoDescontoGlobal && dto.valorDescontoGlobal != null) {
      if (dto.tipoDescontoGlobal === TipoDesconto.VALOR) {
        valorFinal = valorTotal - dto.valorDescontoGlobal;
      } else if (dto.tipoDescontoGlobal === TipoDesconto.PERCENTUAL) {
        valorFinal = valorTotal - (valorTotal * dto.valorDescontoGlobal) / 100;
      }
      if (valorFinal < 0) {
        valorFinal = 0;
      }
    }

    propostaSalva.valorTotal = valorFinal;
    propostaSalva.itens = itens;
    await this.propostaRepository.save(propostaSalva);

    // Ao criar uma proposta, o contato avança automaticamente para o status PROPOSTA
    if (contato.status !== StatusContato.PROPOSTA) {
      contato.status = StatusContato.PROPOSTA;
      await this.contatoRepository.save(contato);
    }

    // Registrar na timeline do contato que uma proposta foi criada
    const atividade = `Proposta criada: ${propostaSalva.titulo}`;
    const descricao = `Proposta nº ${propostaSalva.numero} criada no valor total de ${propostaSalva.valorTotal}`;

    const timeline = this.timelineRepository.create({
      usuarioId,
      contatoId: contato.id,
      atividade,
      tipo: TipoAtividade.PROPOSTA,
      descricao,
    });
    await this.timelineRepository.save(timeline);

    // 🔗 Notificar o Planner: proposta criada
    this.buscarEmailUsuario(usuarioId).then((email) => {
      if (email) {
        this.plannerWebhook.notificarPlanner(
          email,
          'deal.created',
          propostaSalva.valorTotal,
          `Proposta #${propostaSalva.numero} criada: ${propostaSalva.titulo}`,
        ).catch(() => {});
      }
    }); // fire-and-forget

    return propostaSalva;
  }

  async atualizar(id: string, dto: AtualizarPropostaDto): Promise<Proposta> {
    const proposta = await this.propostaRepository.findOne({
      where: { id },
      relations: ["itens"],
    });
    if (!proposta) {
      throw new NotFoundException("Proposta não encontrada");
    }

    if (dto.titulo !== undefined) proposta.titulo = dto.titulo;
    if (dto.introducao !== undefined) proposta.introducao = dto.introducao;
    if (dto.moeda !== undefined) proposta.moeda = dto.moeda;
    if (dto.status !== undefined) proposta.status = dto.status;
    if (dto.tipoDescontoGlobal !== undefined)
      proposta.tipoDescontoGlobal = dto.tipoDescontoGlobal;
    if (dto.valorDescontoGlobal !== undefined)
      proposta.valorDescontoGlobal = dto.valorDescontoGlobal;

    if (dto.itens) {
      // Estratégia simples: remover itens atuais e recriar
      await this.itemRepository.delete({ propostaId: proposta.id });

      let valorTotal = 0;
      const novosItens: PropostaItem[] = [];

      for (let index = 0; index < dto.itens.length; index++) {
        const input = dto.itens[index];
        let baseNome = input.nome ?? "";
        let baseDescricao = input.descricao ?? null;
        let baseInclui = input.inclui ?? null;
        let baseNaoInclui = input.naoInclui ?? null;
        let basePreco = input.precoUnitario ?? 0;
        let itemCatalogoId: string | null = null;
        let pricingTier: PricingTier | null = null;

        if (input.itemCatalogoId) {
          const catalogo = await this.catalogoRepository.findOne({
            where: { id: input.itemCatalogoId },
          });
          if (catalogo) {
            itemCatalogoId = catalogo.id;
            if (!baseNome) {
              baseNome = `${catalogo.tipo} - ${catalogo.especificacoes}`;
            }
            if (!baseDescricao) {
              baseDescricao = catalogo.descricao ?? null;
            }
            if (!baseInclui) {
              baseInclui = catalogo.inclui ?? null;
            }
            if (!baseNaoInclui) {
              baseNaoInclui = catalogo.naoInclui ?? null;
            }
            if (!input.precoUnitario) {
              const tier = input.pricingTier ?? "G";
              if (tier === "M" && catalogo.precoM != null) {
                basePreco = Number(catalogo.precoM);
              } else if (tier === "P" && catalogo.precoP != null) {
                basePreco = Number(catalogo.precoP);
              } else {
                basePreco = Number(catalogo.precoG);
              }
            }
            if (input.pricingTier) {
              pricingTier = PricingTier[input.pricingTier] ?? null;
            }
          }
        }

        const calculado = this.calcularTotaisItem(input, basePreco);

        const item = this.itemRepository.create({
          proposta,
          itemCatalogoId,
          nome: baseNome,
          descricao: baseDescricao,
          inclui: baseInclui,
          naoInclui: baseNaoInclui,
          quantidade: calculado.quantidade,
          precoUnitario: calculado.precoUnitario,
          tipoDesconto: calculado.tipoDesconto,
          valorDesconto: calculado.valorDesconto,
          precoTotal: calculado.precoTotal,
          ordem: index,
          pricingTier,
        });

        valorTotal += calculado.precoTotal;
        novosItens.push(item);
      }

      // Aplicar desconto global se houver
      let valorFinal = valorTotal;
      if (proposta.tipoDescontoGlobal && proposta.valorDescontoGlobal != null) {
        if (proposta.tipoDescontoGlobal === TipoDesconto.VALOR) {
          valorFinal = valorTotal - proposta.valorDescontoGlobal;
        } else if (proposta.tipoDescontoGlobal === TipoDesconto.PERCENTUAL) {
          valorFinal =
            valorTotal - (valorTotal * proposta.valorDescontoGlobal) / 100;
        }
        if (valorFinal < 0) {
          valorFinal = 0;
        }
      }

      proposta.valorTotal = valorFinal;
      proposta.itens = novosItens;
    }

    return this.propostaRepository.save(proposta);
  }

  async atualizarStatus(id: string, status: StatusProposta): Promise<Proposta> {
    const proposta = await this.propostaRepository.findOne({ where: { id } });
    if (!proposta) {
      throw new NotFoundException("Proposta não encontrada");
    }
    proposta.status = status;
    const propostaSalva = await this.propostaRepository.save(proposta);

    // 🔗 Notificar o Planner: proposta APROVADA = deal.won (conversão!)
    if (status === StatusProposta.APROVADA) {
      this.buscarEmailUsuario(proposta.usuarioCriadorId).then((email) => {
        if (email) {
          this.plannerWebhook.notificarPlanner(
            email,
            'deal.won',
            Number(proposta.valorTotal),
            `Proposta #${proposta.numero} aprovada: ${proposta.titulo}`,
          ).catch(() => {});
        }
      }); // fire-and-forget
    }

    return propostaSalva;
  }

  async duplicar(id: string, usuarioId: string): Promise<Proposta> {
    const propostaOriginal = await this.propostaRepository.findOne({
      where: { id },
      relations: ["itens"],
    });

    if (!propostaOriginal) {
      throw new NotFoundException("Proposta não encontrada");
    }

    // Gerar novo número sequencial
    const count = await this.propostaRepository.count();
    const numero = String(count + 1).padStart(4, "0");

    // Criar nova proposta baseada na original
    const novaProposta = this.propostaRepository.create({
      numero,
      titulo: `${propostaOriginal.titulo} (Cópia)`,
      introducao: propostaOriginal.introducao,
      moeda: propostaOriginal.moeda,
      status: StatusProposta.RASCUNHO,
      empresaId: propostaOriginal.empresaId,
      contatoId: propostaOriginal.contatoId,
      usuarioCriadorId: usuarioId,
      marcaId: propostaOriginal.marcaId,
      valorTotal: propostaOriginal.valorTotal,
    });

    const propostaSalva = await this.propostaRepository.save(novaProposta);

    // Duplicar itens
    if (propostaOriginal.itens && propostaOriginal.itens.length > 0) {
      const novosItens: PropostaItem[] = [];

      for (const itemOriginal of propostaOriginal.itens) {
        const novoItem = this.itemRepository.create({
          proposta: propostaSalva,
          propostaId: propostaSalva.id,
          itemCatalogoId: itemOriginal.itemCatalogoId,
          nome: itemOriginal.nome,
          descricao: itemOriginal.descricao,
          inclui: itemOriginal.inclui,
          naoInclui: itemOriginal.naoInclui,
          quantidade: itemOriginal.quantidade,
          precoUnitario: itemOriginal.precoUnitario,
          tipoDesconto: itemOriginal.tipoDesconto,
          valorDesconto: itemOriginal.valorDesconto,
          precoTotal: itemOriginal.precoTotal,
          ordem: itemOriginal.ordem,
          pricingTier: itemOriginal.pricingTier,
        });
        novosItens.push(novoItem);
      }

      await this.itemRepository.save(novosItens);
      propostaSalva.itens = novosItens;
    }

    return propostaSalva;
  }

  /**
   * Busca o email de um usuário pelo ID.
   * Utilizado para identificar o vendedor ao notificar o Planner.
   */
  private async buscarEmailUsuario(usuarioId: string): Promise<string | null> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: usuarioId },
        select: ["email"],
      });
      return usuario?.email || null;
    } catch {
      return null;
    }
  }
}
