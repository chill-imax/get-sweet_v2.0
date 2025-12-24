import { SidebarSection } from "@/components/chat/ui/SidebarSection";
import { EditableField } from "@/components/ui/inputs/EditableField";
import { EditableList } from "@/components/ui/inputs/EditableList";

export default function GoalsSection({ isOpen, onToggle, formData, onChange }) {
  // 1. Aseguramos que sea un array sólido
  const goalsArr = Array.isArray(formData.supportingGoals)
    ? formData.supportingGoals
    : [];

  // Preview inteligente
  const preview =
    formData.primaryGoal ||
    (goalsArr.length > 0
      ? `${goalsArr.length} goals defined`
      : "Define business goals");

  return (
    <SidebarSection
      title="Goals & Metrics"
      isOpen={isOpen}
      onToggle={onToggle}
      preview={preview}
      onEdit={() => {}}
    >
      {/* 1. OBJETIVO PRINCIPAL */}
      <EditableField
        label="Primary Goal"
        value={formData.primaryGoal || ""}
        isEditing={true}
        forceLabel
        onChange={(val) => onChange("primaryGoal", val)}
        placeholder="e.g. Generate emergency service calls..."
      />

      {/* 2. OBJETIVOS SECUNDARIOS (SUPPORTING) */}
      <div className="pt-4 border-t border-gray-100 mt-4">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
          Supporting Goals
        </label>

        {/* 🔥 CORRECCIÓN CLAVE: Agregamos la prop 'key'.
           Esto obliga al componente a actualizarse cuando la longitud del array cambia 
           (ej. cuando pasa de vacío [] a tener datos de la BD).
        */}
        <EditableList
          key={goalsArr.length}
          items={goalsArr}
          isEditing={true}
          onChange={(newArray) => onChange("supportingGoals", newArray)}
          placeholder="Add a supporting goal..."
        />
      </div>

      {/* 3. MÉTRICAS Y TIEMPO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-4">
        <EditableField
          label="Success Metric"
          value={formData.successMetric || ""}
          isEditing={true}
          forceLabel
          onChange={(val) => onChange("successMetric", val)}
          placeholder="e.g., +25% calls"
        />
        <EditableField
          label="Timeframe"
          value={formData.timeframe || ""}
          isEditing={true}
          forceLabel
          onChange={(val) => onChange("timeframe", val)}
          placeholder="e.g., 6 months"
        />
      </div>
    </SidebarSection>
  );
}
