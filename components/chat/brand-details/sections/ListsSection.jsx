import { SidebarSection } from "@/components/chat/ui/SidebarSection";
import { EditableList } from "@/components/ui/inputs/EditableList";

export default function ListsSection({
  title,
  items,
  fieldKey,
  isOpen,
  onToggle,
  onChange,
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const preview =
    safeItems.length > 0
      ? `${safeItems.length} items: ${safeItems.slice(0, 2).join(", ")}...`
      : `Add ${title.toLowerCase()}`;

  return (
    <SidebarSection
      title={title}
      isOpen={isOpen}
      onToggle={onToggle}
      preview={preview}
      onEdit={() => {}}
    >
      <EditableList
        items={safeItems}
        isEditing={true}
        onChange={(val) => onChange(fieldKey, val)}
      />
    </SidebarSection>
  );
}
