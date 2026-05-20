import styled from "styled-components";

export const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  padding: 2rem;
`;

export const RegisterCard = styled.div`
  background: #1a1a2e;
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.6);
  border: 1px solid #2d2d4e;
  padding: 3rem;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
`;

export const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }

  p {
    color: #a0aec0;
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
`;

export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

export const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;

    ${(props) => {
      if (props.$completed) {
        return `
          background: #10b981;
          color: white;
        `;
      } else if (props.$active) {
        return `
          background: #8b5cf6;
          color: white;
        `;
      } else {
        return `
          background: #2d2d4e;
          color: #a0aec0;
        `;
      }
    }}
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${(props) => (props.$active ? "#8b5cf6" : "#9ca3af")};
  }
`;

export const PasswordRequirements = styled.div`
  background: #12121f;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #2d2d4e;
  font-size: 0.75rem;
  color: #718096;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #cbd5e0;
  }

  ul {
    margin: 0;
    padding-left: 1rem;

    li {
      margin-bottom: 0.25rem;
    }
  }
`;
