"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { MdAdd, MdEdit, MdClose, MdSave, MdAutoAwesome } from "react-icons/md";
import { MdCalculate } from "react-icons/md";
import { CategoriaNota } from "../../services/api/notaService";
import { useNotaStore } from "../../stores/notaStore";
import { toast } from "react-hot-toast";

/* ─── FAB container ─── */
const FabContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
`;

/* ─── Main "+" button ─── */
const MainFab = styled.button<{ $expanded: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  border: 1px solid #fefefe;

  box-shadow:
    0 4px 15px rgba(102, 126, 234, 0.4),
    0 1px 2px rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 3;
  transition: box-shadow 0.2s;

  svg {
    font-size: 1.6rem;
    transition: transform 0.3s ease;
    transform: ${({ $expanded }) =>
      $expanded ? "rotate(45deg)" : "rotate(0)"};
  }

  &:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.55);
  }
`;

/* ─── Sub-action row (button + label) ─── */
const SubAction = styled.div<{ $show: boolean; $index: number }>`
  position: absolute;
  right: 4px;
  bottom: 4px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: 0.6rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: ${({ $show, $index }) =>
    $show ? `translateY(-${($index + 1) * 62}px)` : "translateY(0)"};
  pointer-events: ${({ $show }) => ($show ? "auto" : "none")};
`;

const SubFab = styled.button<{ $bg: string }>`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  color: white;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  flex-shrink: 0;
  transition:
    transform 0.2s,
    filter 0.2s;

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    filter: brightness(1.1);
    transform: scale(1.08);
  }
`;

const SubLabel = styled.span`
  background: rgba(15, 23, 42, 0.85);
  color: white;
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
`;

/* ─── Backdrop (click outside to close) ─── */
const Backdrop = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? "block" : "none")};
  position: fixed;
  inset: 0;
  z-index: -1;
`;

/* ─── Notes modal ─── */
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
`;

const ModalContainer = styled.div<{ $show: boolean }>`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  background: #1a1a2e;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  display: ${(props) => (props.$show ? "flex" : "none")};
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #2d2d4e;
  transform-origin: bottom right;
  animation: ${(props) => (props.$show ? popIn : "none")} 0.2s ease-out;
  z-index: 4;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #e2e8f0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  &:hover {
    background-color: #1e1e3a;
    color: #e2e8f0;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #a0aec0;
  }

  select,
  textarea,
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #2d2d4e;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #e2e8f0;
    background-color: #12121f;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #8b5cf6;
      background-color: #1a1a2e;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  textarea {
    resize: none;
    min-height: 100px;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover:not(:disabled) {
    background-color: #5a67d8;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

/* ─── Component ─── */
export default function NotasFAB() {
  const { criarNota } = useNotaStore();
  const router = useRouter();
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(false);
  const [showNotaModal, setShowNotaModal] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  // ─── Calculator state (persists across open/close) ───
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcPrev, setCalcPrev] = useState<string | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcWaitNext, setCalcWaitNext] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<CategoriaNota>(
    CategoriaNota.CADASTRO,
  );
  const [isSaving, setIsSaving] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
        setShowNotaModal(false);
      }
    };
    if (expanded || showNotaModal) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded, showNotaModal]);

  const handleNotaClick = () => {
    setExpanded(false);
    setShowNotaModal(false);
    setShowCalc(false);
    setShowNotaModal(true);
  };

  const handleCalcClick = () => {
    setExpanded(false);
    setShowNotaModal(false);
    setShowCalc((v) => !v);
  };

  const calcHandle = (btn: string) => {
    if (btn === "C") {
      setCalcDisplay("0");
      setCalcPrev(null);
      setCalcOp(null);
      setCalcWaitNext(false);
      return;
    }
    if (btn === "±") {
      setCalcDisplay((c) =>
        c.startsWith("-") ? c.slice(1) : c === "0" ? "0" : `-${c}`,
      );
      return;
    }
    if (btn === "%") {
      setCalcDisplay((c) => String(parseFloat(c) / 100));
      return;
    }
    if (btn === "=") {
      if (!calcOp || calcPrev === null) return;
      const r = calcCompute(calcPrev, calcDisplay, calcOp);
      setCalcDisplay(r);
      setCalcPrev(null);
      setCalcOp(null);
      setCalcWaitNext(true);
      return;
    }
    if (["÷", "×", "−", "+"].includes(btn)) {
      if (calcPrev !== null && calcOp && !calcWaitNext) {
        const r = calcCompute(calcPrev, calcDisplay, calcOp);
        setCalcPrev(r);
        setCalcDisplay(r);
      } else {
        setCalcPrev(calcDisplay);
      }
      setCalcOp(btn);
      setCalcWaitNext(true);
      return;
    }
    // digit or dot
    if (btn === "." && calcDisplay.includes(".")) return;
    if (calcWaitNext) {
      setCalcDisplay(btn === "." ? "0." : btn);
      setCalcWaitNext(false);
    } else {
      setCalcDisplay((c) =>
        c === "0" && btn !== "." ? btn : c.length >= 12 ? c : c + btn,
      );
    }
  };

  function calcCompute(a: string, b: string, op: string): string {
    const n1 = parseFloat(a),
      n2 = parseFloat(b);
    let r: number;
    if (op === "÷") r = n2 !== 0 ? n1 / n2 : NaN;
    else if (op === "×") r = n1 * n2;
    else if (op === "−") r = n1 - n2;
    else r = n1 + n2;
    return !isFinite(r) ? "Erro" : String(parseFloat(r.toPrecision(10)));
  }

  function calcFmt(v: string) {
    if (!v || v === "Erro") return v;
    const [i, d] = v.split(".");
    const fmt = Number(i).toLocaleString("pt-BR");
    return d !== undefined ? `${fmt},${d}` : fmt;
  }

  const handleIaClick = () => {
    setExpanded(false);
    setShowCalc(false);
    // If already on the propostas page with the form open, just dispatch the event
    if (pathname === "/propostas") {
      window.dispatchEvent(new Event("open-ia-assistant"));
    } else {
      // Navigate to propostas with ia flag
      router.push("/propostas?nova=1&ia=1");
    }
  };

  const handleSave = async () => {
    if (!titulo.trim()) {
      toast.error("O título da nota não pode estar vazio.");
      return;
    }
    if (!texto.trim()) {
      toast.error("O texto da nota não pode estar vazio.");
      return;
    }

    try {
      setIsSaving(true);
      await criarNota(titulo, texto, categoria);
      toast.success("Nota salva com sucesso!");
      setTitulo("");
      setTexto("");
      setCategoria(CategoriaNota.CADASTRO);
      setShowNotaModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar nota.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FabContainer ref={containerRef}>
      {/* Backdrop to close on outside click */}
      <Backdrop $show={expanded} onClick={() => setExpanded(false)} />

      {/* Calculator mini-panel */}
      <ModalContainer
        $show={showCalc}
        style={{
          width: 268,
          padding: "0",
          overflow: "hidden",
          background: "rgba(22,22,34,0.97)",
          border: "1px solid rgba(163,163,204,0.18)",
        }}
      >
        {/* display */}
        <div
          style={{
            padding: "0.75rem 1rem 0.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            textAlign: "right",
          }}
        >
          {calcOp && calcPrev !== null && (
            <div
              style={{ fontSize: "0.72rem", color: "#6b7280", marginBottom: 2 }}
            >
              {calcFmt(calcPrev)} {calcOp}
            </div>
          )}
          <div
            style={{
              fontSize: "1.85rem",
              fontWeight: 300,
              color: "#f0f0f8",
              letterSpacing: "-0.02em",
              wordBreak: "break-all",
              lineHeight: 1.1,
            }}
          >
            {calcFmt(calcDisplay)}
          </div>
        </div>
        {/* buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 1,
            background: "rgba(255,255,255,0.05)",
            padding: 1,
          }}
        >
          {(
            [
              ["C", "±", "%", "÷"],
              ["7", "8", "9", "×"],
              ["4", "5", "6", "−"],
              ["1", "2", "3", "+"],
              ["0", ".", "="],
            ] as string[][]
          ).map((row, r) =>
            row.map((btn) => {
              const isOp = ["÷", "×", "−", "+"].includes(btn);
              const isEq = btn === "=";
              const isFn = ["C", "±", "%"].includes(btn);
              const isZero = btn === "0";
              const bg = isEq
                ? "rgba(165,180,252,0.18)"
                : isOp
                  ? "rgba(251,113,133,0.12)"
                  : isFn
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(255,255,255,0.04)";
              const hov = isEq
                ? "rgba(165,180,252,0.3)"
                : isOp
                  ? "rgba(251,113,133,0.22)"
                  : isFn
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.09)";
              const col = isEq
                ? "#a5b4fc"
                : isOp
                  ? "#fb7185"
                  : isFn
                    ? "#9ca3af"
                    : "#2d2d4e";
              return (
                <button
                  key={`${r}-${btn}`}
                  type="button"
                  onClick={() => calcHandle(btn)}
                  style={{
                    gridColumn: isZero ? "span 2" : "span 1",
                    background: bg,
                    color: col,
                    border: "1px solid transparent",
                    borderRadius: 8,
                    fontSize: "1rem",
                    fontWeight: 500,
                    fontFamily: "inherit",
                    padding: "0.7rem 0",
                    margin: 3,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      hov;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      bg;
                  }}
                >
                  {btn}
                </button>
              );
            }),
          )}
        </div>
      </ModalContainer>

      {/* Notes modal */}
      <ModalContainer $show={showNotaModal}>
        <Header>
          <h3>Nova Nota Rápida</h3>
          <CloseButton onClick={() => setShowNotaModal(false)}>
            <MdClose size={20} />
          </CloseButton>
        </Header>

        <InputGroup>
          <label>Título</label>
          <input
            type="text"
            placeholder="Ex: Tarefas da semana"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <label>Categoria</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(Number(e.target.value))}
          >
            <option value={CategoriaNota.CADASTRO}>Cadastro</option>
            <option value={CategoriaNota.REUNIAO}>Reunião</option>
            <option value={CategoriaNota.PROPOSTA}>Proposta</option>
            <option value={CategoriaNota.ATENDIMENTO}>Atendimento</option>
          </select>
        </InputGroup>

        <InputGroup>
          <label>Anotação</label>
          <textarea
            placeholder="Digite sua nota aqui..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </InputGroup>

        <SaveButton
          onClick={handleSave}
          disabled={isSaving || !texto.trim() || !titulo.trim()}
        >
          <MdSave size={18} />
          {isSaving ? "Salvando..." : "Salvar Nota"}
        </SaveButton>
      </ModalContainer>

      {/* Sub-actions (slide up) */}
      <SubAction $show={expanded} $index={2}>
        <SubFab
          $bg="linear-gradient(135deg, #8b5cf6, #6366f1)"
          onClick={handleIaClick}
          title="HubIA"
        >
          <MdAutoAwesome />
        </SubFab>
        <SubLabel>HubIA</SubLabel>
      </SubAction>

      <SubAction $show={expanded} $index={1}>
        <SubFab $bg="#8b5cf6" onClick={handleNotaClick} title="Nova nota">
          <MdEdit />
        </SubFab>
        <SubLabel>Nova nota</SubLabel>
      </SubAction>

      <SubAction $show={expanded} $index={0}>
        <SubFab
          $bg="linear-gradient(135deg, #0ea5e9, #0284c7)"
          onClick={handleCalcClick}
          title="Calculadora"
        >
          <MdCalculate />
        </SubFab>
        <SubLabel>Calculadora</SubLabel>
      </SubAction>

      {/* Main FAB */}
      <MainFab
        $expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        title="Ações rápidas"
      >
        <MdAdd />
      </MainFab>
    </FabContainer>
  );
}
