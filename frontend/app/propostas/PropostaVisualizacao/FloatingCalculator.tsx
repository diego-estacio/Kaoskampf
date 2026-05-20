"use client";

import { useState, useCallback } from "react";
import * as S from "./styles";

const BUTTONS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

function formatDisplay(value: string): string {
  if (!value || value === "Erro") return value;
  const [int, dec] = value.split(".");
  const formatted = Number(int).toLocaleString("pt-BR");
  return dec !== undefined ? `${formatted},${dec}` : formatted;
}

export default function FloatingCalculator() {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waitNext, setWaitNext] = useState(false);

  const handleDigit = useCallback(
    (d: string) => {
      if (d === "." && display.includes(".")) return;
      if (waitNext) {
        setDisplay(d === "." ? "0." : d);
        setWaitNext(false);
      } else {
        setDisplay((cur) =>
          cur === "0" && d !== "." ? d : cur.length >= 12 ? cur : cur + d,
        );
      }
    },
    [display, waitNext],
  );

  const handleOp = useCallback(
    (newOp: string) => {
      if (prev !== null && op && !waitNext) {
        const result = calculate(prev, display, op);
        setPrev(result);
        setDisplay(result);
      } else {
        setPrev(display);
      }
      setOp(newOp);
      setWaitNext(true);
    },
    [prev, display, op, waitNext],
  );

  const handleEquals = useCallback(() => {
    if (!op || prev === null) return;
    const result = calculate(prev, display, op);
    setDisplay(result);
    setPrev(null);
    setOp(null);
    setWaitNext(true);
  }, [prev, display, op]);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setWaitNext(false);
  }, []);

  const handleToggleSign = useCallback(() => {
    setDisplay((cur) =>
      cur.startsWith("-") ? cur.slice(1) : cur === "0" ? "0" : `-${cur}`,
    );
  }, []);

  const handlePercent = useCallback(() => {
    setDisplay((cur) => String(parseFloat(cur) / 100));
  }, []);

  const handleButton = useCallback(
    (btn: string) => {
      if (btn === "C") return handleClear();
      if (btn === "±") return handleToggleSign();
      if (btn === "%") return handlePercent();
      if (btn === "=") return handleEquals();
      if (["÷", "×", "−", "+"].includes(btn)) return handleOp(btn);
      handleDigit(btn);
    },
    [
      handleClear,
      handleToggleSign,
      handlePercent,
      handleEquals,
      handleOp,
      handleDigit,
    ],
  );

  return (
    <>
      <S.CalcToggleBtn
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Calculadora"
        $open={open}
      >
        <CalcIcon />
      </S.CalcToggleBtn>

      <S.CalcPanel $open={open}>
        {/* Display */}
        <S.CalcDisplay>
          {op && prev !== null && (
            <S.CalcSubDisplay>
              {formatDisplay(prev)} {op}
            </S.CalcSubDisplay>
          )}
          <S.CalcMainDisplay>{formatDisplay(display)}</S.CalcMainDisplay>
        </S.CalcDisplay>

        {/* Buttons */}
        <S.CalcGrid>
          {BUTTONS.map((row, r) =>
            row.map((btn) => {
              const isOp = ["÷", "×", "−", "+"].includes(btn);
              const isEq = btn === "=";
              const isFunc = ["C", "±", "%"].includes(btn);
              const isZero = btn === "0";
              return (
                <S.CalcBtn
                  key={`${r}-${btn}`}
                  type="button"
                  $variant={isEq ? "eq" : isOp ? "op" : isFunc ? "fn" : "num"}
                  $wide={isZero}
                  onClick={() => handleButton(btn)}
                >
                  {btn}
                </S.CalcBtn>
              );
            }),
          )}
        </S.CalcGrid>
      </S.CalcPanel>
    </>
  );
}

function calculate(a: string, b: string, op: string): string {
  const n1 = parseFloat(a);
  const n2 = parseFloat(b);
  let result: number;
  if (op === "÷") result = n2 !== 0 ? n1 / n2 : NaN;
  else if (op === "×") result = n1 * n2;
  else if (op === "−") result = n1 - n2;
  else result = n1 + n2;
  if (!isFinite(result)) return "Erro";
  // evita ponto flutuante sujo
  return String(parseFloat(result.toPrecision(10)));
}

function CalcIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="12" x2="10" y2="12" />
      <line x1="14" y1="12" x2="16" y2="12" />
      <line x1="8" y1="17" x2="10" y2="17" />
      <line x1="14" y1="17" x2="16" y2="17" />
    </svg>
  );
}
