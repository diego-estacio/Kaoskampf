"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { MdDelete, MdClose, MdSave } from "react-icons/md";
import { Nota, CategoriaNota } from "../../src/services/api/notaService";
import { useNotaStore } from "../../src/stores/notaStore";
import { toast } from "react-hot-toast";

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.875rem;
    color: #e2e8f0;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #718096;
  }
`;

const KanbanBoard = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  align-items: flex-start;
  padding-bottom: 1rem;

  /* Estilizar scrollbar para o board */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #1a1a2e;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #2d2d4e;
    border-radius: 4px;
  }
`;

const KanbanColumn = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  background-color: #12121f;
  border-radius: 12px;
  padding: 1rem;
  min-height: 500px;
  border: 1px solid #2d2d4e;
`;

const KanbanColumnHeader = styled.div<{ $category: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid;
  
  ${({ $category }) => {
    switch ($category) {
      case CategoriaNota.CADASTRO: return "border-color: #3b82f6;"; // Blue
      case CategoriaNota.REUNIAO: return "border-color: #eab308;"; // Yellow
      case CategoriaNota.PROPOSTA: return "border-color: #22c55e;"; // Green
      case CategoriaNota.ATENDIMENTO: return "border-color: #a855f7;"; // Purple
      default: return "border-color: #718096;";
    }
  }}

  h2 {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    color: #a0aec0;
    margin: 0;
  }
  
  span {
    background: #1a1a2e;
    color: #718096;
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-weight: 600;
    border: 1px solid #2d2d4e;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NoteCard = styled.div`
  background: #1a1a2e;
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #2d2d4e;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08);
    border-color: #2d2d4e;
  }
`;

const NoteTitle = styled.h4`
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  word-break: break-word;
`;

const NoteFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #1e1e3a;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #718096;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fef2f2;
  }
`;

// --- Drawer / Slide-over Styles ---
const DrawerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const DrawerContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 100%;
  max-width: 450px;
  background-color: #1a1a2e;
  z-index: 1001;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "100%")});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #2d2d4e;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #e2e8f0;
  }
`;

const DrawerBody = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #a0aec0;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #2d2d4e;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #e2e8f0;
    background-color: #12121f;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      background-color: #1a1a2e;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  textarea {
    min-height: 250px;
    resize: vertical;
    line-height: 1.6;
  }
`;

const DrawerFooter = styled.div`
  padding: 1.5rem;
  border: 1px solid #2d2d4e;
  display: flex;
  gap: 1rem;
  background-color: #12121f;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ $primary }) => $primary ? `
    background-color: #3b82f6;
    color: white;
    border: none;
    
    &:hover:not(:disabled) { background-color: #8b5cf6; }
  ` : `
    background-color: #1a1a2e;
    color: #a0aec0;
    border: 1px solid #2d2d4e;
    
    &:hover:not(:disabled) { background-color: #1e1e3a; }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  display: flex;
  padding: 0.4rem;
  border-radius: 6px;

  &:hover {
    background-color: #1e1e3a;
    color: #e2e8f0;
  }
`;

const COLUNAS = [
  { id: CategoriaNota.CADASTRO, title: "Cadastro" },
  { id: CategoriaNota.REUNIAO, title: "Reunião" },
  { id: CategoriaNota.PROPOSTA, title: "Proposta" },
  { id: CategoriaNota.ATENDIMENTO, title: "Atendimento" },
];

export default function NotasPage() {
  const { notas, isLoading, buscarNotas, editarNota, deletarNota } = useNotaStore();
  
  // Drawer Edit State
  const [editingNota, setEditingNota] = useState<Nota | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editTexto, setEditTexto] = useState("");
  const [editCategoria, setEditCategoria] = useState<number>(CategoriaNota.CADASTRO);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    buscarNotas();
  }, [buscarNotas]);

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Tem certeza que deseja excluir esta nota?")) return;
    
    try {
      await deletarNota(id);
      if (editingNota?.id === id) {
        setEditingNota(null);
      }
      toast.success("Nota excluída.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir a nota.");
    }
  };

  const openDrawer = (nota: Nota) => {
    setEditingNota(nota);
    setEditTitulo(nota.titulo || "Sem Titulo");
    setEditTexto(nota.texto);
    setEditCategoria(nota.categoria);
  };

  const closeDrawer = () => {
    setEditingNota(null);
  };

  const handleSaveEdit = async () => {
    if (!editingNota) return;
    if (!editTitulo.trim() || !editTexto.trim()) {
      toast.error("Título e Anotação são obrigatórios.");
      return;
    }
    
    try {
      setSavingEdit(true);
      await editarNota(
        editingNota.id, 
        editTitulo, 
        editTexto, 
        editCategoria
      );
      toast.success("Nota salva com sucesso!");
      closeDrawer();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar a nota.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (editingNota) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editingNota]);


  return (
    <PageContainer>
      <Header>
        <h1>Quadro de Notas</h1>
        <p>Anotações categorizadas para fácil visualização.</p>
      </Header>

      {isLoading && notas.length === 0 ? (
        <p>Carregando quadro...</p>
      ) : (
        <KanbanBoard>
          {COLUNAS.map(coluna => {
            const notasNestaColuna = notas.filter(n => n.categoria === coluna.id);
            
            return (
              <KanbanColumn key={coluna.id}>
                <KanbanColumnHeader $category={coluna.id}>
                  <h2>{coluna.title}</h2>
                  <span>{notasNestaColuna.length}</span>
                </KanbanColumnHeader>
                
                <CardsContainer>
                  {notasNestaColuna.length === 0 ? (
                    <div style={{ padding: "1rem", textAlign: "center", color: "#718096", fontSize: "0.85rem" }}>
                      Nenhuma anotação nesta coluna.
                    </div>
                  ) : null}

                  {notasNestaColuna.map(nota => (
                    <NoteCard key={nota.id} onClick={() => openDrawer(nota)}>
                      <NoteTitle>{nota.titulo || "Sem Título"}</NoteTitle>
                      
                      <NoteFooter>
                        <span>
                          {new Date(nota.criadaEm).toLocaleDateString("pt-BR", {
                            day: "2-digit", month: "2-digit"
                          })}
                        </span>
                        <DeleteButton 
                          onClick={(e) => handleDelete(nota.id, e)} 
                          title="Excluir"
                        >
                          <MdDelete size={18} />
                        </DeleteButton>
                      </NoteFooter>
                    </NoteCard>
                  ))}
                </CardsContainer>
              </KanbanColumn>
            );
          })}
        </KanbanBoard>
      )}

      {/* Slide-over Drawer for Edit Mode */}
      <DrawerOverlay $isOpen={!!editingNota} onClick={closeDrawer} />
      <DrawerContainer $isOpen={!!editingNota}>
        {editingNota && (
          <>
            <DrawerHeader>
              <h3>Detalhes da Nota</h3>
              <IconButton onClick={closeDrawer} title="Fechar">
                <MdClose size={22} />
              </IconButton>
            </DrawerHeader>

            <DrawerBody>
              <InputGroup>
                <label>Título da Nota</label>
                <input 
                  type="text" 
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  disabled={savingEdit}
                />
              </InputGroup>

              <InputGroup>
                <label>Mover para</label>
                <select 
                  value={editCategoria} 
                  onChange={e => setEditCategoria(Number(e.target.value))}
                  disabled={savingEdit}
                >
                  <option value={CategoriaNota.CADASTRO}>Cadastro</option>
                  <option value={CategoriaNota.REUNIAO}>Reunião</option>
                  <option value={CategoriaNota.PROPOSTA}>Proposta</option>
                  <option value={CategoriaNota.ATENDIMENTO}>Atendimento</option>
                </select>
              </InputGroup>

              <InputGroup>
                <label>Anotação</label>
                <textarea 
                  value={editTexto} 
                  onChange={e => setEditTexto(e.target.value)} 
                  disabled={savingEdit}
                />
              </InputGroup>
            </DrawerBody>

            <DrawerFooter>
              <ActionButton onClick={closeDrawer} disabled={savingEdit}>
                Cancelar
              </ActionButton>
              <ActionButton $primary onClick={handleSaveEdit} disabled={savingEdit}>
                <MdSave size={20} />
                {savingEdit ? "Salvando..." : "Salvar"}
              </ActionButton>
            </DrawerFooter>
          </>
        )}
      </DrawerContainer>
    </PageContainer>
  );
}
