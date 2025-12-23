import { SidebarSection } from "@/components/chat/ui/SidebarSection";
import EditableColorPalette from "@/components/ui/inputs/EditableColorPalette";

export default function ColorsSection({
  isOpen,
  onToggle,
  formData,
  onChange,
}) {
  return (
    <SidebarSection
      title="Colors"
      isOpen={isOpen}
      onToggle={onToggle}
      previewType="colors"
      previewData={formData.colors}
      onEdit={() => {}}
    >
      <EditableColorPalette
        colors={formData.colors}
        isEditing={true}
        onChange={(val) => onChange("colors", val)}
      />
    </SidebarSection>
  );
}
