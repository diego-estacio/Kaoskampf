"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import * as S from "./styles";

export interface ComboBoxOption {
  value: string;
  label: string;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function ComboBox({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  style,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const selected = options.find((o) => o.value === value);
    if (selected) {
      setInputValue(selected.label);
    } else if (!value) {
      setInputValue("");
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    const term = inputValue.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(term));
  }, [options, inputValue]);

  const handleSelect = (option: ComboBoxOption) => {
    onChange(option.value);
    setOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setInputValue(text);
    if (!text) {
      onChange("");
    }
    setOpen(true);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  return (
    <S.ComboBoxContainer ref={containerRef} style={style}>
      <S.ComboBoxInput
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
      />
      <S.ComboBoxArrow onClick={toggleOpen}>
        <ChevronDown size={14} />
      </S.ComboBoxArrow>
      {open && !disabled && filteredOptions.length > 0 && (
        <S.ComboBoxList>
          {filteredOptions.map((option) => (
            <S.ComboBoxOption
              key={option.value}
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelect(option);
              }}
              $isSelected={option.value === value}
            >
              {option.label}
            </S.ComboBoxOption>
          ))}
        </S.ComboBoxList>
      )}
    </S.ComboBoxContainer>
  );
}
