"use client";

import { useState } from "react";
import ProfileHeaderComponent from "../../src/components/profile/ProfileHeader";
import ProfileForm from "../../src/components/profile/ProfileForm";
import PasswordForm from "../../src/components/profile/PasswordForm";
import {
  PageContainer,
  MainContent,
} from "../../src/components/common/Layout.styles";
import * as S from "./styles";
import { authUtils } from "../../src/utils";

export default function PerfilPage() {
  const usuario = authUtils.getUser();

  const [formData, setFormData] = useState({
    nome: usuario?.nome || "",
    login: usuario?.login || "",
    email: usuario?.email || "",
    funcao: usuario?.funcao || "",
  });

  const [senhaData, setSenhaData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [notificationData, setNotificationData] = useState({
    notificacoesEmail: true,
    notificacoesDesktop: true,
    resumoDiario: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSenhaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSalvarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvar perfil:", formData);
    alert("Perfil atualizado com sucesso!");
  };

  const handleAlterarSenha = (e: React.FormEvent) => {
    e.preventDefault();

    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (senhaData.novaSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres!");
      return;
    }

    console.log("Alterar senha");
    alert("Senha alterada com sucesso!");
    setSenhaData({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
  };

  const handleCancelarSenha = () => {
    setSenhaData({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
  };

  if (!usuario) {
    return (
      <PageContainer>
        <MainContent>
          <div>Usuário não encontrado</div>
        </MainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MainContent>
        <S.ProfileSection>
          <ProfileHeaderComponent usuario={usuario} />
        </S.ProfileSection>

        <S.ProfileSection>
          <S.SectionTitle>Informações Pessoais</S.SectionTitle>
          <ProfileForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSalvarPerfil}
          />
        </S.ProfileSection>
        <S.BottomContainer>
          <S.ProfileSection>
            <S.SectionTitle>Configurações de Notificação</S.SectionTitle>
            <S.NotificationSettings>
              <S.NotificationItem>
                <S.NotificationLabel>
                  Notificações por email
                </S.NotificationLabel>
                <S.CheckboxWrapper>
                  <S.Checkbox
                    name="notificacoesEmail"
                    type="checkbox"
                    checked={notificationData.notificacoesEmail}
                    onChange={handleNotificationChange}
                  />
                </S.CheckboxWrapper>
              </S.NotificationItem>

              <S.NotificationItem>
                <S.NotificationLabel>Notificações desktop</S.NotificationLabel>
                <S.CheckboxWrapper>
                  <S.Checkbox
                    name="notificacoesDesktop"
                    type="checkbox"
                    checked={notificationData.notificacoesDesktop}
                    onChange={handleNotificationChange}
                  />
                </S.CheckboxWrapper>
              </S.NotificationItem>

              <S.NotificationItem>
                <S.NotificationLabel>
                  Resumo diário por email
                </S.NotificationLabel>
                <S.CheckboxWrapper>
                  <S.Checkbox
                    name="resumoDiario"
                    type="checkbox"
                    checked={notificationData.resumoDiario}
                    onChange={handleNotificationChange}
                  />
                </S.CheckboxWrapper>
              </S.NotificationItem>

              <S.NotificationItem>
                <S.NotificationLabel>
                  Resumo diário por email
                </S.NotificationLabel>
                <S.CheckboxWrapper>
                  <S.Checkbox
                    name="resumoDiario"
                    type="checkbox"
                    checked={notificationData.resumoDiario}
                    onChange={handleNotificationChange}
                  />
                </S.CheckboxWrapper>
              </S.NotificationItem>
            </S.NotificationSettings>
          </S.ProfileSection>

          <S.ProfileSection>
            <S.SectionTitle>Alterar Senha</S.SectionTitle>
            <PasswordForm
              senhaData={senhaData}
              onSenhaChange={handleSenhaChange}
              onSubmit={handleAlterarSenha}
              onCancel={handleCancelarSenha}
            />
          </S.ProfileSection>
        </S.BottomContainer>
      </MainContent>
    </PageContainer>
  );
}
