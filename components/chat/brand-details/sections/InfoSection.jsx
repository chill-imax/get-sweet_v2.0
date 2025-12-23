import { ChevronDown } from "lucide-react";
import { SidebarSection } from "@/components/chat/ui/SidebarSection";
import { EditableField } from "@/components/ui/inputs/EditableField";
import { INDUSTRIES } from "@/components/utils/industries";
import { EditableSelect } from "../../../ui/inputs/EditableSelect";

export default function InfoSection({ isOpen, onToggle, formData, onChange }) {
  const preview = [formData.brandName, formData.aka, formData.industry]
    .filter(Boolean)
    .join(" • ");

  return (
    <SidebarSection
      title="Info"
      isOpen={isOpen}
      onToggle={onToggle}
      preview={preview}
      onEdit={() => {}}
    >
      <EditableField
        label="Brand Name"
        value={formData.brandName}
        isEditing={true}
        forceLabel
        onChange={(val) => onChange("brandName", val)}
        placeholder="Your official business name"
      />

      {/* ---  INDUSTRY DROPDOWN --- */}
      <EditableSelect
        label="Industry"
        value={formData.industry}
        options={INDUSTRIES}
        isEditing={true}
        onChange={(val) => onChange("industry", val)}
        placeholder="Select your industry"
      />

      <EditableField
        label="Target Audience"
        value={formData.targetAudience}
        isEditing={true}
        forceLabel
        onChange={(val) => onChange("targetAudience", val)}
        placeholder="Who is this for?"
      />
      <EditableField
        label="Website"
        value={formData.website}
        isEditing={true}
        forceLabel
        onChange={(val) => onChange("website", val)}
        placeholder="https://example.com"
      />
    </SidebarSection>
  );
}
