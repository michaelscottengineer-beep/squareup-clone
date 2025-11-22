import useEditorTemplateState from "@/stores/use-editor-template-state";
import EditOverlay from "./EditOverlay";

interface StatisticSectionProps {
  isEditing?: boolean;
}

const StatisticSection = ({ isEditing }: StatisticSectionProps) => {
  const statisticSectionData = useEditorTemplateState(
    (state) => state.partEditorData.sections["statisticSection"]
  );

  return (
    <section
      className="py-12 relative"
      style={{
        ...statisticSectionData.general.style,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statisticSectionData.stat.data?.items.map(
            (
              stat: { count: number | string; label: string },
              index: number
            ) => (
              <div key={index} className="text-center">
                <div
                  className="text-4xl font-bold mb-2"
                  style={{
                    color: statisticSectionData.stat.style?.statisticCountColor,
                  }}
                >
                  {stat.count}+
                </div>
                <div className="" style={{color: statisticSectionData.stat.style?.color}}>{stat.label}</div>
              </div>
            )
          )}
        </div>
      </div>
      {isEditing && <EditOverlay partEditorKey={"statisticSection"} />}
    </section>
  );
};

export default StatisticSection;
