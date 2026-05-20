import { Suspense } from "react";
import PropostaVisualizacao from "../../PropostaVisualizacao";

export default function VisualizarPropostaPage() {
  return (
    <Suspense fallback={<div>Carregando proposta...</div>}>
      <PropostaVisualizacao />
    </Suspense>
  );
}
