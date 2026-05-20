"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: #1a1a2e;
  border: 1px solid #2d2d4e;
  font-size: 14px;
  color: #6b7280;
`;

const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #8b5cf6;
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  color: #9ca3af;
`;

const BreadcrumbCurrent = styled.span`
  color: #111827;
  font-weight: 500;
`;

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const router = useRouter();

  return (
    <BreadcrumbContainer>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index}>
            {!isLast && item.href ? (
              <>
                <BreadcrumbLink onClick={() => router.push(item.href!)}>
                  {item.label}
                </BreadcrumbLink>
                <BreadcrumbSeparator> &gt; </BreadcrumbSeparator>
              </>
            ) : (
              <BreadcrumbCurrent>{item.label}</BreadcrumbCurrent>
            )}
          </span>
        );
      })}
    </BreadcrumbContainer>
  );
}
