import { Suspense } from "react";
import PropostasClient from "./PropostasClient";

export default function PropostasPage() {
  return (
    <Suspense fallback={<div>Carregando propostas...</div>}>
      <PropostasClient />
    </Suspense>
  );
}
