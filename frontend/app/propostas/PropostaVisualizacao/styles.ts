import styled, { keyframes, createGlobalStyle } from "styled-components";

export const PrintStyles = createGlobalStyle`
  @media print {
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    html, body {
      print-color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
    }
  }
`;

export const PageWrapper = styled.div`
  font-family:
    "Montserrat",
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  min-height: 100vh;
  background:
    radial-gradient(
      circle at top left,
      rgba(251, 113, 133, 0.45),
      transparent 60%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(249, 115, 22, 0.4),
      transparent 60%
    ),
    linear-gradient(180deg, #fdf2ff 0%, #fff7ed 40%, #fef3c7 100%);
  color: #2d2d4e;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }

  @media print {
    background: none;
    padding: 0;
    min-height: 0;
    overflow: visible;
  }
`;

const waveUndulate1 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-32px); }
`;

const waveUndulate2 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-22px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const WavesBackground = styled.div`
  position: fixed;
  inset: 0;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  svg path:first-child {
    animation: ${waveUndulate1} 8s ease-in-out infinite;
    transform-box: fill-box;
    transform-origin: bottom center;
  }

  svg path:last-child {
    animation: ${waveUndulate2} 11s ease-in-out infinite;
    transform-box: fill-box;
    transform-origin: bottom center;
  }

  @media print {
    display: none !important;
  }
`;

export const ProposalShell = styled.div`
  width: 100%;
  max-width: 960px;
  background: rgba(39, 39, 51, 0.85);
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(121, 136, 157, 0.3);
  overflow: hidden;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    border-radius: 12px;
  }

  @media print {
    max-width: 100%;
    box-shadow: none;
    border-radius: 0;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
`;

export const ProposalHeader = styled.header`
  padding: 2rem 2rem 0;

  @media (max-width: 768px) {
    padding: 1.25rem 1rem 0;
  }
`;
export const ProposalTag = styled.div`
  display: inline-block;
  border-radius: 999px;
  font-size: 1.25em;
  padding: 0.1rem 2.5rem;
  font-weight: 500;
  color: #2d2d4e;
  border: 1px solid #2d2d4e;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.1rem 1.5rem;
  }
`;
export const ProposalTitle = styled.h1`
  margin: 0 0 0.4rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d2d4e;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const ProposalMeta = styled.div`
  margin: 0;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    font-size: 0.75rem;
  }
`;

export const ContactFieldRow = styled.div`
  display: flex;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 999px;
  padding: 2rem;
  gap: 3rem;
  text-align: center;

  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 18px;
    padding: 1rem 0.75rem;
    gap: 0.75rem;
  }
`;

export const ContactLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2d2d4e;
  margin-bottom: 0.15rem;
  background-color: #5c6d84;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
`;

export const VideoHero = styled.div`
  position: relative;
  width: 100%;
  padding-top: 40%;
  background: #000;
  overflow: hidden;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);

  @media (max-width: 768px) {
    padding-top: 48.5%;
  }

  @media print {
    display: none !important;
  }
`;

export const VideoFrame = styled.iframe`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 200%;
  min-height: 200%;
  width: auto;
  height: auto;
  border: 0;
`;

export const Presentation = styled.div<{ $revealed: boolean }>`
  background: rgba(29, 29, 31, 0.85);
  display: flex;
  flex-direction: column;

  gap: 1.25rem;
  overflow: hidden;

  > div:first-child {
    z-index: 1;
  }

  img {
    width: 100%;

    object-fit: cover;
    border-radius: 0;
    transition: transform 1s ease;
  }

  @media (min-width: 900px) {
    position: relative;
    display: block;
    padding: 0;
    min-height: 320px;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: translateX(${({ $revealed }) => ($revealed ? "50%" : "0")});
    }

    > div:first-child {
      position: relative;
      width: 50%;
      min-height: 320px;
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      justify-content: center;

      opacity: ${({ $revealed }) => ($revealed ? 1 : 0)};
      transform: translateX(${({ $revealed }) => ($revealed ? "0" : "-16px")});
      transition:
        opacity 0.5s ease 1s,
        transform 0.5s ease 1s;
    }
  }

  @media print {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    display: block;
    > div:first-child {
      opacity: 1;
      transform: none;
      width: 100%;
    }
    img {
      display: none;
    }
  }
`;

export const PresentationTitleContainer = styled.div`
  padding-right: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem 0;
  }
`;

export const PresentationTitle = styled.div`
  font-size: 2.5rem;
  color: #2d2d4e;
  margin-bottom: 0.4rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const PresentationSubtitle = styled.div`
  font-size: 0.95rem;
  color: #718096;
`;

export const PresentationText = styled.div`
  font-size: 0.9rem;
  color: #2d2d4e;
  line-height: 1.4;
  margin-top: 0.75rem;
`;

export const Content = styled.div`
  padding: 1.5rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;
export const PriceFieldRow = styled(FieldRow)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Field = styled.div`
  flex: 1 1 180px;
  min-width: 0;
  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const TotalField = styled(Field)`
  flex: none;

  display: flex;
  gap: 1rem;
  align-items: end;
  justify-content: flex-end;
  padding: 1rem 1rem 1rem 2rem;
  border-radius: 12px;
  border: 2px solid rgba(148, 163, 184, 0.5);

  background: rgba(36, 37, 38, 0.85);

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    padding: 1rem;
  }
`;

export const TotalHighlight = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  background-color: #697179;
  padding: 0.25rem 1rem;
  border-radius: 999px;
`;

export const DiscountedPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(251, 113, 133, 0.1);
`;

export const OriginalPrice = styled.span`
  font-size: 0.9rem;
  color: #9ca3af;
  text-decoration: line-through;
  font-weight: 500;
  opacity: 0.8;
`;

export const FinalPrice = styled.span`
  font-size: 1.35rem;
  font-weight: 700;
  color: #fb7185;
  text-shadow: 0 0 20px rgba(251, 113, 133, 0.5);
`;

export const DiscountBadge = styled.div`
  font-size: 0.75rem;
  background: linear-gradient(135deg, #fb7185 0%, #f97316 100%);
  color: white;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(251, 113, 133, 0.4);
  animation: ${pulse} 2s ease-in-out infinite;

  @media print {
    animation: none;
  }
`;

export const Label = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin-bottom: 0.2rem;
  border-radius: 999px;
  display: inline-block;
`;

export const TextBlock = styled.div`
  font-size: 0.9rem;
  color: #2d2d4e;
`;

export const SectionTitle = styled.h2`
  margin: 0.5rem 0 0.15rem;
  line-height: 1;
  font-size: 4rem;
  font-weight: 700;
  color: #9399a3;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const SectionSubtitle = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #9ca3af;
`;

export const ItemsList = styled.div`
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ItemCard = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  border-left: 4px solid #9399a3;
  background: rgba(36, 37, 38, 0.85);
  padding: 0.75rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
`;

export const ItemHeader = styled.div`
  display: flex;

  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  @media print {
    flex-direction: row;
    align-items: center;
  }
`;

export const ItemField = styled.div`
  min-width: 0;

  @media (max-width: 768px) {
    width: 100% !important;
    max-width: 100% !important;
    flex: 1 !important;
  }
`;

export const ItemLabel = styled(Label)`
  margin-bottom: 0.1rem;
`;

export const ItemValue = styled.div`
  font-size: 0.85rem;
  &.item-name {
    font-weight: 500;
    font-size: 1rem;
  }
`;

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.35rem;
    text-align: center;
  }
`;
export const PriceColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ItemMetaCell = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 130px;
`;

export const ItemActions = styled.div`
  margin-top: 0.35rem;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ToggleButton = styled.button`
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: #4b4f54;
  color: #2d2d4e;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.4rem;
    font-size: 0.7rem;
  }

  @media print {
    display: none !important;
  }
`;

export const DetailsRow = styled(FieldRow)`
  margin-top: 0.5rem;
  padding-top: 0.25rem;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid rgba(148, 163, 184, 0.4);
  margin: 1.25rem 0 1rem;
`;

const pdfButtonBase = `
  margin-top: 1.25rem;
  align-self: flex-start;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.55rem 1.4rem;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    filter 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.6);
    filter: brightness(1.02);
  }

  @media print {
    display: none !important;
  }
`;

export const GeneratePdfButton = styled.button`
  ${pdfButtonBase}
  border: 1px solid rgba(148, 163, 184, 0.9);
  background-color: #a1a1ba;
  color: #e2e8f0;
`;

export const PrintPdfButton = styled.button`
  ${pdfButtonBase}
  border: 1px solid rgba(99, 102, 241, 0.7);
  background-color: transparent;
  color: #a5b4fc;
`;

export const Footer = styled.footer`
  margin-top: 2rem;
  padding: 3.5rem 2rem 4rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background-color: rgb(12, 12, 12);

  @media (max-width: 768px) {
    padding: 2rem 1rem 2.5rem;
  }

  @media print {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
`;

export const FooterTitle = styled.h2`
  margin: 0.5rem 0 0.15rem;
  line-height: 1;
  font-size: 4rem;
  font-weight: 700;
  color: #9399a3;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const FooterNote = styled.p`
  margin: 0;
  font-size: 1.5rem;
  color: #2d2d4e;
  font-weight: 600;
  text-align: center;
  span {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const ErrorBanner = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.06);
  font-size: 0.78rem;
  color: #fde68a;
`;

const slowPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.97); }
`;

export const FooterLogo = styled.img`
  width: auto;
  height: 120px;
  max-width: 320px;
  object-fit: contain;
  animation: ${slowPulse} 4s ease-in-out infinite;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    height: 72px;
    max-width: 200px;
  }
`;

// ─── Floating Calculator ──────────────────────────────────────────────────────

const slideInRight = keyframes`
  from { transform: translateX(120%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

const slideOutRight = keyframes`
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(120%); opacity: 0; }
`;

export const CalcToggleBtn = styled.button<{ $open: boolean }>`
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  z-index: 200;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(163, 163, 204, 0.25);
  background: rgba(36, 37, 50, 0.92);
  backdrop-filter: blur(12px);
  color: ${({ $open }) => ($open ? "#fb7185" : "#a5b4fc")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.55);
  transition:
    color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
    color: ${({ $open }) => ($open ? "#fda4af" : "#c7d2fe")};
  }

  @media print {
    display: none !important;
  }
`;

export const CalcPanel = styled.div<{ $open: boolean }>`
  position: fixed;
  bottom: 5.5rem;
  right: 1.75rem;
  z-index: 199;
  width: 280px;
  border-radius: 20px;
  border: 1px solid rgba(163, 163, 204, 0.18);
  background: rgba(22, 22, 34, 0.96);
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
  overflow: hidden;

  animation: ${({ $open }) => ($open ? slideInRight : slideOutRight)} 0.28s
    cubic-bezier(0.4, 0, 0.2, 1) both;
  pointer-events: ${({ $open }) => ($open ? "all" : "none")};

  @media print {
    display: none !important;
  }
`;

export const CalcDisplay = styled.div`
  padding: 1rem 1.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  text-align: right;
  min-height: 78px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2px;
`;

export const CalcSubDisplay = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  letter-spacing: 0.03em;
  height: 1.1rem;
`;

export const CalcMainDisplay = styled.span`
  font-size: 2rem;
  font-weight: 300;
  color: #f0f0f8;
  letter-spacing: -0.02em;
  word-break: break-all;
  line-height: 1.1;
`;

export const CalcGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.05);
  padding: 1px;
`;

const variantMap = {
  eq: {
    bg: "rgba(165, 180, 252, 0.18)",
    hover: "rgba(165, 180, 252, 0.3)",
    color: "#a5b4fc",
    border: "rgba(165,180,252,0.25)",
  },
  op: {
    bg: "rgba(251, 113, 133, 0.12)",
    hover: "rgba(251, 113, 133, 0.22)",
    color: "#fb7185",
    border: "rgba(251,113,133,0.2)",
  },
  fn: {
    bg: "rgba(255, 255, 255, 0.07)",
    hover: "rgba(255, 255, 255, 0.12)",
    color: "#9ca3af",
    border: "transparent",
  },
  num: {
    bg: "rgba(255, 255, 255, 0.04)",
    hover: "rgba(255, 255, 255, 0.09)",
    color: "#2d2d4e",
    border: "transparent",
  },
};

export const CalcBtn = styled.button<{
  $variant: "eq" | "op" | "fn" | "num";
  $wide?: boolean;
}>`
  ${({ $variant, $wide }) => {
    const v = variantMap[$variant];
    return `
      grid-column: ${$wide ? "span 2" : "span 1"};
      background: ${v.bg};
      color: ${v.color};
      border: 1px solid ${v.border};
      border-radius: 10px;
      font-size: 1.05rem;
      font-weight: 500;
      font-family: inherit;
      padding: 0.8rem 0;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s;
      margin: 3px;

      &:hover  { background: ${v.hover}; }
      &:active { transform: scale(0.93); }
    `;
  }}
`;
