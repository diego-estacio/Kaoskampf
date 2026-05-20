import { LayoutGrid, Rows3 } from "lucide-react";
import { ViewToggleContainer, ViewButton } from "./ViewToggle.styles";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export default function ViewToggle({
  viewMode,
  onViewChange,
}: ViewToggleProps) {
  return (
    <ViewToggleContainer>
      <ViewButton
        $active={viewMode === "grid"}
        onClick={() => onViewChange("grid")}
        title="Visualização em Grid"
      >
        <LayoutGrid size={18} />
      </ViewButton>
      <ViewButton
        $active={viewMode === "list"}
        onClick={() => onViewChange("list")}
        title="Visualização em Lista"
      >
        <Rows3 size={18} />
      </ViewButton>
    </ViewToggleContainer>
  );
}
