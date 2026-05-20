import styled from "styled-components";
import Link from "next/link";

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const Card = styled.div`
  background: #1a1a2e;
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.6);
  border: 1px solid #2d2d4e;
  max-width: 1200px;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
`;

export const LeftSection = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #12121f;
`;

export const RightSection = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Logo = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #8b5cf6;
  margin-bottom: 1rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #a0aec0;
  margin-bottom: 2rem;
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 1.5rem;
`;

export const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #a0aec0;
  margin-bottom: 2rem;
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #a0aec0;

  &:before {
    content: "✓";
    background: #7c3aed;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-weight: bold;
    font-size: 0.875rem;
  }
`;

export const CompanyInfo = styled.div`
  background: #2d1b6b;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border-left: 4px solid #8b5cf6;
`;

export const CompanyName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #c4b5fd;
  margin-bottom: 0.5rem;
`;

export const CompanyDescription = styled.p`
  color: #a78bfa;
  font-size: 0.95rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
`;

export const PrimaryButton = styled(Link)`
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.5);
  }
`;

export const SecondaryButton = styled(Link)`
  border: 2px solid #8b5cf6;
  color: #8b5cf6;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;
  background: transparent;

  &:hover {
    background: #8b5cf6;
    color: white;
    transform: translateY(-2px);
  }
`;

export const StatusBadge = styled.div`
  display: inline-block;
  background: #7c3aed;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;
