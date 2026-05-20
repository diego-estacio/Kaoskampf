"use client";

import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid #2d2d4e;
  border-top: 4px solid #8b5cf6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Text = styled.p`
  color: #718096;
  font-size: 1rem;
`;

interface LoadingProps {
  text?: string;
}

export function Loading({ text = "Carregando..." }: LoadingProps) {
  return (
    <Container>
      <Spinner />
      <Text>{text}</Text>
    </Container>
  );
}
