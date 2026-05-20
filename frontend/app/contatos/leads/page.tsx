"use client";

import { Suspense } from "react";
import { ContatosPageBase } from "../page";

export default function LeadsPage() {
  return (
    <Suspense fallback={<div>Carregando contatos...</div>}>
      <ContatosPageBase tipoContatoFilter="lead" />
    </Suspense>
  );
}
