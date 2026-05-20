import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { Usuario } from "../../entities/usuario.entity";

@Controller("api")
export class PlannerController {
  private supabasePlanner;

  constructor() {
    const supabaseUrl =
      process.env.SUPABASE_URL_DO_PLANNER || "https://seu-projeto.supabase.co";
    const supabaseServiceKey =
      process.env.SERVICE_ROLE_KEY_DO_PLANNER ||
      "sua-chave-secreta-service-role-aqui";
      
    this.supabasePlanner = createClient(supabaseUrl, supabaseServiceKey);
  }

  @Get("ir-para-planner")
  @UseGuards(JwtAuthGuard)
  async irParaPlanner(@Req() req: Request, @Res() res: Response) {
    try {
      const vendedor = req.user as Usuario;

      // Se a função não existir, mandar um default (ex: 'Vendedor')
      const segmento = vendedor.funcao || "Vendedor";
      
      const urlBase = process.env.URL_DO_PLANNER || "http://localhost:5173"; // Ou a URL de produção do planner
      const urlDeRetorno = `${urlBase}/?source=hubee&name=${encodeURIComponent(
        vendedor.nome
      )}&segment=${encodeURIComponent(segmento)}`;

      const { data, error } = await this.supabasePlanner.auth.admin.generateLink({
        type: "magiclink",
        email: vendedor.email,
        options: {
          redirectTo: urlDeRetorno,
        },
      });

      if (error) {
        throw error;
      }

      // Retorna a URL para o frontend redirecionar o usuário
      return res.json({ url: data.properties.action_link });
    } catch (error) {
      console.error("Erro ao gerar link do Planner:", error);
      res.status(500).json({
        erro: "Erro ao gerar link do Planner",
        detalhe: error.message || error,
      });
    }
  }
}
