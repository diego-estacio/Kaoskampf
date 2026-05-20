"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("kaoskampf_token");
    if (token) {
      router.replace("/atividades");
    } else {
      router.replace("/login");
    }
  }, [router]);

  // Tela mínima enquanto verifica token
  return (
    <div
      style={{
        height: "100vh",
        background: "#0a0a14",
      }}
    />
  );
}
