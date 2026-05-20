"use client";

import { Suspense } from "react";
import { ContatosPageBase } from "../page";

export default function ClientesPage() {
  return (
    <Suspense fallback={<div>Carregando contatos...</div>}>
      <ContatosPageBase tipoContatoFilter="cliente" />
    </Suspense>
  );
}
