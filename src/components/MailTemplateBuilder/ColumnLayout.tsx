import TextElement from "./Element/TextElement";
import ButtonElement from "./Element/ButtonElement";
import EditorHoverWrapper from "./EditorHoverWrapper";
import ImageElement from "./Element/ImageElement";
import ElementComponent from "./Element/ElementComponent";
import useMailTemplateEditorContext from "@/hooks/useMailTemplateEditorContext";

const ColumnWrapper = ({ layout, index }: { layout: any; index: number }) => {
  const rows = layout?.children?.[index];

  return (
    <td width={`${100 / layout.numOfCol}%`} style={{}}>
      <EditorHoverWrapper layout={layout} index={index} variant="column">
        {rows?.length ? (
          <RowLayout layout={layout} index={index} />
        ) : (
          `col id: ${layout.id} - index: ${index}`
        )}
      </EditorHoverWrapper>
    </td>
  );
};

const ColumnLayout = ({ layout }: { layout: any }) => {
  const { emailTemplate } = useMailTemplateEditorContext();

  return (
    <table
      style={{
        width: "100%",
        height: "100%",
        minHeight: "40px",
      }}
    >
      <tbody>
        <tr>
          {Array.from({ length: layout.numOfCol }).map((_, index) => {
            return <ColumnWrapper layout={layout} index={index} />;
          })}
        </tr>
      </tbody>
    </table>
  );
};

const RowLayout = ({ layout, index }: { layout: any; index: number }) => {
  const rowIds = layout?.children?.[index];
  const { emailTemplate } = useMailTemplateEditorContext();

  return (
    <table
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <tbody>
        {rowIds?.map((id: any, index: number) => {
          const row = emailTemplate.rows.byId[id];
          if (!row) console.log(id)
          return (
            <tr>
              <td
                width={"100%"}
                style={{
                  padding: "0 15px",
                }}
              >
                <EditorHoverWrapper
                  layout={row}
                  index={index}
                  variant="row"
                  className="bg-white"
                >
                  <ElementComponent element={row} />
                </EditorHoverWrapper>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// column table (1) - 1 col có 0 -> nhiều row
// row table 1 row co 1 element
// element table
export default ColumnLayout;
