"use client";

import { useState } from "react";
import { COMPANY_ICONS } from "../../../utils/companyIcons";
import styled from "styled-components";
import { X } from "lucide-react";

interface IconSelectorModalProps {
  isOpen: boolean;
  currentIcon?: string;
  onClose: () => void;
  onSelect: (iconId: string) => void;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background: #1a1a2e;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e2e8f0;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #718096;
  transition: all 0.2s;

  &:hover {
    background: #1a1a2e;
    color: #e2e8f0;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#8b5cf6" : "#1e1e3a")};
  color: ${(props) => (props.$active ? "white" : "#a0aec0")};

  &:hover {
    background: ${(props) => (props.$active ? "#5568d3" : "#e2e8f0")};
  }
`;

const IconsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
  overflow-y: auto;
  max-height: 400px;
  padding: 0.5rem;
`;

const IconButton = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #2d2d4e")};
  background: ${(props) => (props.$selected ? "#ede9fe" : "white")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #8b5cf6;
    background: #f5f3ff;
    transform: scale(1.05);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${(props) => (props.$selected ? "#8b5cf6" : "#a0aec0")};
  }
`;

const IconName = styled.span`
  font-size: 0.625rem;
  color: #718096;
  text-align: center;
  line-height: 1.2;
`;

const categories = [
  { id: "todos", label: "Todos" },
  { id: "negocios", label: "Negócios" },
  { id: "criativo", label: "Criativo" },
  { id: "cultura", label: "Cultura" },
  { id: "marketing", label: "Marketing" },
  { id: "diversos", label: "Diversos" },
];

export function IconSelectorModal({
  isOpen,
  currentIcon,
  onClose,
  onSelect,
}: IconSelectorModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(
    currentIcon,
  );

  const filteredIcons =
    selectedCategory === "todos"
      ? COMPANY_ICONS
      : COMPANY_ICONS.filter((icon) => icon.category === selectedCategory);

  const handleSelectIcon = (iconId: string) => {
    setSelectedIcon(iconId);
    onSelect(iconId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Selecionar Ícone</Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <CategoryTabs>
          {categories.map((cat) => (
            <CategoryTab
              key={cat.id}
              $active={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </CategoryTab>
          ))}
        </CategoryTabs>

        <IconsGrid>
          {filteredIcons.map((icon) => {
            const IconComponent = icon.component;
            return (
              <IconButton
                key={icon.id}
                $selected={selectedIcon === icon.id}
                onClick={() => handleSelectIcon(icon.id)}
                title={icon.name}
              >
                <IconComponent />
                <IconName>{icon.name}</IconName>
              </IconButton>
            );
          })}
        </IconsGrid>
      </ModalContainer>
    </Overlay>
  );
}
