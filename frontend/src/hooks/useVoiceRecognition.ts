"use client";

import { useState, useRef, useCallback } from "react";

interface UseVoiceRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseVoiceRecognitionReturn {
  isRecording: boolean;
  isSupported: boolean;
  toggleRecording: () => void;
  stopRecording: () => void;
}

export function useVoiceRecognition(
  options: UseVoiceRecognitionOptions = {},
): UseVoiceRecognitionReturn {
  const {
    lang = "pt-BR",
    continuous = true,
    onResult,
    onError,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const SpeechRecognitionAPI =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
      : null;

  const isSupported = !!SpeechRecognitionAPI;

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
      return;
    }

    if (!SpeechRecognitionAPI) {
      onError?.(
        "Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge.",
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = lang;
      recognition.continuous = continuous;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        recognitionRef.current = null;
        if (event.error === "not-allowed") {
          onError?.("Permissão de microfone negada.");
        } else if (event.error !== "aborted") {
          onError?.("Erro no reconhecimento de voz. Tente novamente.");
        }
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        const trimmed = transcript.trim();
        if (trimmed && onResult) {
          onResult(trimmed);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
      onError?.("Falha ao iniciar reconhecimento de voz.");
    }
  }, [isRecording, SpeechRecognitionAPI, lang, continuous, onResult, onError, stopRecording]);

  return { isRecording, isSupported, toggleRecording, stopRecording };
}
