"use client";

import { useEffect, useState } from "react";
import { UserCheck, UserX } from "lucide-react";
import {
  PageContainer,
  MainContent,
  PageHeader,
  HeaderContent,
  PageTitle,
  PageSubtitle,
} from "../../../src/components/common/Layout.styles";
import { apiService } from "../../../src/services/api";
import { Usuario, UsuarioRole } from "../../../src/types";
import { useAuthStore } from "../../../src/stores/authStore";
import * as S from "./styles";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UsuarioRole | "" | null>(
    null,
  );
  const [savingRole, setSavingRole] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentUser = useAuthStore((state) => state.usuario);
  const isMaster = currentUser?.role?.toUpperCase() === "MASTER";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.buscarUsuarios();
        setUsuarios(data);
        if (data.length > 0) {
          setSelectedUserId(data[0].id);
          setSelectedRole((data[0].role as UsuarioRole) || "MEMBER");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isMaster) {
      load();
    } else {
      setLoading(false);
    }
  }, [isMaster]);

  const selectedUser = usuarios.find((u) => u.id === selectedUserId) || null;

  const handleChangeRole = async (newRole: UsuarioRole) => {
    if (!selectedUser || !newRole) return;

    // Nunca tentar alterar role de usuários MASTER
    if (selectedUser.role?.toUpperCase() === "MASTER") {
      setErrorMessage("Usuários MASTER não podem ter o role alterado.");
      setSelectedRole(selectedUser.role as UsuarioRole);
      return;
    }

    // Se não mudou, não chama API
    if ((selectedUser.role as UsuarioRole) === newRole) {
      setSelectedRole(newRole);
      return;
    }

    setSelectedRole(newRole);
    setSavingRole(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated = await apiService.atualizarRoleUsuario(
        selectedUser.id,
        newRole,
      );

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === updated.id
            ? {
                ...u,
                role: updated.role,
              }
            : u,
        ),
      );

      setSuccessMessage("Role atualizada com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar role do usuário:", error);
      setErrorMessage("Erro ao atualizar role. Tente novamente.");
    } finally {
      setSavingRole(false);
    }
  };
 
  const handleToggleAutorizacao = async (novoStatus: boolean) => {
    if (!selectedUser) return;
 
    const acao = novoStatus ? "autorizar" : "revogar o acesso do";
    if (!confirm(`Tem certeza que deseja ${acao} usuário?`)) return;
 
    setSavingRole(true); // Reusando estado de loading
    try {
      const updated = await apiService.autorizarUsuario(
        selectedUser.id,
        novoStatus,
      );
 
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === updated.id
            ? {
                ...u,
                autorizado: updated.autorizado,
              }
            : u,
        ),
      );
 
      setSuccessMessage(
        `Usuário ${novoStatus ? "autorizado" : "desautorizado"} com sucesso.`,
      );
    } catch (error) {
      console.error(`Erro ao ${acao} usuário:`, error);
      setErrorMessage(`Erro ao ${acao} usuário.`);
    } finally {
      setSavingRole(false);
    }
  };

  if (!isMaster) {
    return (
      <PageContainer>
        <MainContent>
          <PageHeader>
            <HeaderContent>
              <div>
                <PageTitle>Gestão de Usuários</PageTitle>
                <PageSubtitle>
                  Apenas usuários MASTER podem gerenciar permissões.
                </PageSubtitle>
              </div>
            </HeaderContent>
          </PageHeader>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MainContent>
        <PageHeader>
          <HeaderContent>
            <div>
              <PageTitle>Gestão de Usuários</PageTitle>
              <PageSubtitle>
                Selecione um usuário para visualizar detalhes e definir o nível
                de acesso.
              </PageSubtitle>
            </div>
          </HeaderContent>
        </PageHeader>

        {loading ? (
          <S.InfoText>Carregando usuários...</S.InfoText>
        ) : (
          <S.Layout>
            <S.UsersList>
              {usuarios.map((usuario) => (
                <S.UserRow
                  key={usuario.id}
                  $selected={usuario.id === selectedUserId}
                  $unauthorized={usuario.autorizado === false}
                  onClick={() => {
                    setSelectedUserId(usuario.id);
                    setSelectedRole((usuario.role as UsuarioRole) || "MEMBER");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <S.UserName>{usuario.nome}</S.UserName>
                    {usuario.autorizado === false && (
                      <S.Pill $unauthorized>Pendente</S.Pill>
                    )}
                  </div>
                  <S.UserMeta>
                    {usuario.login} · {usuario.email}
                  </S.UserMeta>
                  <S.UserMeta>
                    Cargo: {usuario.funcao || "(não informado)"}
                  </S.UserMeta>
                  <S.UserMeta>
                    Role atual: <S.Pill>{usuario.role || "MEMBER"}</S.Pill>
                  </S.UserMeta>
                </S.UserRow>
              ))}
            </S.UsersList>

            <S.DetailsCard>
              {selectedUser ? (
                <>
                  <S.FieldLabel>Usuário selecionado</S.FieldLabel>
                  <S.FieldValue>
                    <strong>{selectedUser.nome}</strong> ({selectedUser.login})
                    <br />
                    {selectedUser.email}
                  </S.FieldValue>

                  <S.FieldLabel>Cargo</S.FieldLabel>
                  <S.FieldValue>
                    {selectedUser.funcao || "(não informado)"}
                  </S.FieldValue>

                  <S.FieldLabel>Role de acesso</S.FieldLabel>
                  <S.RoleSelect
                    value={selectedRole || ""}
                    disabled={
                      savingRole ||
                      !selectedUser ||
                      selectedUser.role?.toUpperCase() === "MASTER"
                    }
                    onChange={(e) =>
                      handleChangeRole(e.target.value as UsuarioRole)
                    }
                  >
                    <option value="">Selecione um role</option>
                    <option value="MASTER">MASTER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MEMBER">MEMBER</option>
                  </S.RoleSelect>
 
                  <div style={{ marginTop: "1.5rem" }}>
                    <S.FieldLabel>Controle de Acesso</S.FieldLabel>
                    {selectedUser.id !== currentUser?.id ? (
                      selectedUser.autorizado === false ? (
                        <S.AuthorizeButton
                          onClick={() => handleToggleAutorizacao(true)}
                          disabled={savingRole}
                        >
                          <UserCheck size={18} /> Autorizar Usuário
                        </S.AuthorizeButton>
                      ) : (
                        <S.RevokeButton
                          onClick={() => handleToggleAutorizacao(false)}
                          disabled={savingRole}
                        >
                          <UserX size={18} /> Revogar Acesso
                        </S.RevokeButton>
                      )
                    ) : (
                      <S.InfoText>
                        Sua própria autorização não pode ser alterada.
                      </S.InfoText>
                    )}
                  </div>
 
                  {errorMessage && (
                    <S.InfoText style={{ color: "#ef4444", marginTop: "1rem" }}>
                      {errorMessage}
                    </S.InfoText>
                  )}
                  {successMessage && (
                    <S.InfoText style={{ color: "#16a34a", marginTop: "1rem" }}>
                      {successMessage}
                    </S.InfoText>
                  )}
                </>
              ) : (
                <S.InfoText>
                  Selecione um usuário na lista para visualizar detalhes.
                </S.InfoText>
              )}
            </S.DetailsCard>
          </S.Layout>
        )}
      </MainContent>
    </PageContainer>
  );
}
