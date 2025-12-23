import { SidebarSection } from "@/components/chat/ui/SidebarSection";
import { EditableTextArea } from "@/components/ui/inputs/EditableTextArea";

export default function MissionSection({
  isOpen,
  onToggle,
  formData,
  onChange,
}) {
  const preview =
    formData.mission?.trim() || formData.vision?.trim() || "Add mission";

  return (
    <SidebarSection
      title="Mission & Vision"
      isOpen={isOpen}
      onToggle={onToggle}
      preview={preview}
      onEdit={() => {}}
    >
      <EditableTextArea
        label="Mission"
        value={formData.mission}
        isEditing={true}
        onChange={(val) => onChange("mission", val)}
      />
      <div className="pt-3 border-t border-gray-200">
        <EditableTextArea
          label="Vision"
          value={formData.vision}
          isEditing={true}
          onChange={(val) => onChange("vision", val)}
        />
      </div>
    </SidebarSection>
  );
}
