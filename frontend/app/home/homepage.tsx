"use client";

import { useEffect, useState } from "react";
import * as S from "./homepage.styles";

export default function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("kaoskampf_token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <S.Container>
      <S.Card>
        <S.LeftSection>
          <S.Title>KaosKampf - Sistema de Gerenciamento</S.Title>
          <S.Description>
            O <strong>KaosKampf</strong> é um sistema pessoal de gerenciamento
            de clientes, projetos e leads.
          </S.Description>

          <S.CompanyInfo>
            <S.CompanyName>KaosKampf</S.CompanyName>
            <S.CompanyDescription>
              Seu sistema pessoal de gestão
            </S.CompanyDescription>
          </S.CompanyInfo>

          <S.FeatureList>
            <S.FeatureItem>
              Gerenciamento completo de contatos e leads
            </S.FeatureItem>
            <S.FeatureItem>Timeline de atividades em tempo real</S.FeatureItem>
            <S.FeatureItem>Pipeline Kanban para projetos</S.FeatureItem>
            <S.FeatureItem>Sistema de notificações inteligentes</S.FeatureItem>
            <S.FeatureItem>Controle de funil de vendas</S.FeatureItem>
            <S.FeatureItem>
              Relatórios e acompanhamento de performance
            </S.FeatureItem>
          </S.FeatureList>

          <S.Description>
            <strong>Funcionalidades principais:</strong>
            <br />• <strong>Contatos/Leads:</strong> Lista organizada por
            proximidade de contato
            <br />• <strong>Projetos:</strong> Kanban visual para acompanhar o
            pipeline
            <br />• <strong>Timeline:</strong> Histórico completo de atividades
            da equipe
            <br />• <strong>Notificações:</strong> Alertas personalizados para
            cada usuário
          </S.Description>
        </S.LeftSection>

        <S.RightSection>
          <S.Logo>KaosKampf</S.Logo>
          <S.Subtitle>Seu sistema pessoal de gestão</S.Subtitle>

          <S.StatusBadge>✨ Sistema Ativo</S.StatusBadge>

          <S.ButtonGroup>
            {isLoggedIn ? (
              <S.PrimaryButton href="/painel">
                Acessar Dashboard
              </S.PrimaryButton>
            ) : (
              <>
                <S.PrimaryButton href="/login">Fazer Login</S.PrimaryButton>
                <S.SecondaryButton href="/cadastro">
                  Criar Conta
                </S.SecondaryButton>
              </>
            )}
          </S.ButtonGroup>

          <S.Description
            style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#a0aec0" }}
          >
            <strong>Para usar o sistema:</strong>
            <br />
            Acesse com suas credenciais ou crie uma nova conta.
          </S.Description>
        </S.RightSection>
      </S.Card>
    </S.Container>
  );
}
