import styled from "styled-components";
import { formatUtils } from "../../utils";

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 2.5rem;
  margin-right: 2rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
`;

const UserRole = styled.p`
  color: #718096;
  margin: 0;
  font-size: 1.125rem;
`;

interface ProfileHeaderProps {
  usuario: {
    nome: string;
    funcao: string;
  };
}

export default function ProfileHeaderComponent({
  usuario,
}: ProfileHeaderProps) {
  return (
    <ProfileHeader>
      <UserAvatar>{formatUtils.getInitials(usuario.nome)}</UserAvatar>
      <UserInfo>
        <UserName>{usuario.nome}</UserName>
        <UserRole>{usuario.funcao}</UserRole>
      </UserInfo>
    </ProfileHeader>
  );
}
