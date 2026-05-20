import styled from "styled-components";

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 2rem 0;
`;

export const KanbanBoard = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
`;

export const KanbanColumn = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 270px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const ColumnTitle = styled.h3`
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
`;

export const ColumnCount = styled.span`
  background: #1a1a2e;
  color: #718096;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const ProjectCard = styled.div`
  background: #12121f;
  border: 1px solid #2d2d4e;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ProjectTitle = styled.h4`
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

export const ProjectClient = styled.p`
  color: #3b82f6;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const ProjectDeadline = styled.p`
  color: #718096;
  margin: 0;
  font-size: 0.75rem;
`;

export const AddButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #2d2d4e;
  background: transparent;
  border-radius: 8px;
  color: #718096;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #12121f;
  }
`;

export const ProjectContent = styled.div`
  padding: 2rem;
`;
