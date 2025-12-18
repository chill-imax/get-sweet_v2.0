import { SidebarSection } from "@/components/chat/ui/SidebarSection";
import { EditableField } from "@/components/chat/ui/EditableField";
import { EditableList } from "@/components/chat/ui/EditableList";

export default function GoalsSection({ isOpen, onToggle, formData, onChange }) {
  const goalsArr = Array.isArray(formData.supportingGoals)
    ? formData.supportingGoals
    : [];

  const preview =
    goalsArr.length > 0
      ? `${formData.primaryGoal || ""} • ${goalsArr.slice(0, 2).join(", ")}`
      : formData.primaryGoal || "Add goals";

  return (
    <SidebarSection
      title="Goals"
      isOpen={isOpen}
      onToggle={onToggle}
      preview={preview}
      onEdit={() => {}}
    >
      <EditableField
        label="Primary goal"
        value={formData.primaryGoal}
        isEditing={true}
        forceLabel
        onChange={(val) => onChange("primaryGoal", val)}
        placeholder="Main objective"
      />

      <div className="pt-3 border-t border-gray-200">
        <EditableList
          items={formData.supportingGoals || []}
          isEditing={true}
          onChange={(val) => onChange("supportingGoals", val)}
        />
        <p className="mt-2 text-[11px] text-gray-400">Add supporting goals.</p>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <EditableField
          label="Success metric"
          value={formData.successMetric}
          isEditing={true}
          forceLabel
          onChange={(val) => onChange("successMetric", val)}
          placeholder="e.g., +30% leads/month"
        />
      </div>

      <div className="pt-3 border-t border-gray-200">
        <EditableField
          label="Timeframe"
          value={formData.timeframe}
          isEditing={true}
          forceLabel
          onChange={(val) => onChange("timeframe", val)}
          placeholder="e.g., Q1, This month"
        />
      </div>
    </SidebarSection>
  );
}
