import styled from "styled-components";

export const ProfileSection = styled.div`
  background: #1a1a2e;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 1.5rem 0;
`;

export const NotificationSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #12121f;
  border-radius: 8px;
`;

export const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const NotificationLabel = styled.span`
  color: #cbd5e0;
  font-size: 0.875rem;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
`;

export const BottomContainer = styled.div`
  display: flex;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
