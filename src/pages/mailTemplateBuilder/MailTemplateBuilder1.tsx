import ColumnLayout from "@/components/MailTemplateBuilder/ColumnLayout";
import EditorLayout from "@/components/MailTemplateBuilder/EditorLayout";
import {
  MailTemplateEditorContext,
  MailTemplateEditorProvider,
} from "@/contexts/mailTemplateEditorContext";
import { builderElements, columnLayouts } from "@/data/mailTemplateEditor";
import mailTemplateBuilder from "@/lib/mailTemplateBuilder";
import React, { Component } from "react";

const initEmailTemplate2 = {
  columns: {
    byId: {
      col1: {
        ...mailTemplateBuilder.createColumn("1"),
        id: "col1",
        children: {
          [0]: ["row1"],
        },
      },
      col2: {
        ...mailTemplateBuilder.createColumn("1"),
        id: "col2",
        children: {
          [0]: ["row2"],
        },
      },
      col3: {
        ...mailTemplateBuilder.createColumn("1"),
        id: "col3",
        children: {
          [0]: ["row3", "row9"],
        },
      },
      col4: {
        ...mailTemplateBuilder.createColumn("2"),
        id: "col4",
        children: {
          [0]: ["row4"],
          [1]: ["row10", "row13"],
        },
      },
      col5: {
        ...mailTemplateBuilder.createColumn("2"),
        id: "col5",
        children: {
          [0]: ["row11", "row14", "row15"],
          [1]: ["row12"],
        },
      },
      col6: {
        ...mailTemplateBuilder.createColumn("1"),
        id: "col6",
        children: {
          [0]: ["row5", "row6", "row7"],
        },
      },
    },
    allIds: Array.from({ length: 6 }).map((_, i) => `col${i + 1}`),
  },
  rows: {
    byId: {
      row1: { ...mailTemplateBuilder.createElement("Image"), id: "row1" },
      row2: {
        ...mailTemplateBuilder.createElement("Image", {
          props: {
            src: "https://img.mailinblue.com/2670624/images/rnb/original/5ea02ca0a4a6484df378a298.png",
          },
        }),
        id: "row2",
      },
      row3: {
        ...mailTemplateBuilder.createElement("Text", {
          props: { text: "Dear Customer," },
        }),
        id: "row3",
      },
      row4: {
        ...mailTemplateBuilder.createElement("Image", {
          props: {
            src: "https://img.mailinblue.com/2670624/images/rnb/original/5ea02c9f334f7f491b466f0d.jpg",
          },
        }),
        id: "row4",
      },

      row5: {
        ...mailTemplateBuilder.createElement("Text", {
          props: { text: "ENTER HEADLINE HERE" },
        }),
        id: "row5",
      },
      row6: {
        ...mailTemplateBuilder.createElement("Text", {
          props: {
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,",
          },
        }),
        id: "row6",
      },

      row7: {
        ...mailTemplateBuilder.createElement("Button", {
          props: {
            text: "CLICK HERE",
          },
        }),
        id: "row7",
      },
      row8: { ...mailTemplateBuilder.createElement("Text"), id: "row8" },

      row9: {
        ...mailTemplateBuilder.createElement("Text", {
          props: {
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
          },
        }),
        id: "row9",
      },

      row10: {
        ...mailTemplateBuilder.createElement("Text", {
          props: { text: "ENTER HEADLINE HERE" },
        }),
        id: "row10",
      },

      row11: {
        ...mailTemplateBuilder.createElement("Text", {
          props: { text: "ENTER HEADLINE HERE" },
        }),
        id: "row11",
      },
      row12: {
        ...mailTemplateBuilder.createElement("Image", {
          props: {
            src: "https://img.mailinblue.com/2670624/images/rnb/original/5ea02c9fa4a6484efd7f533e.png",
          },
        }),
        id: "row12",
      },
      row13: {
        ...mailTemplateBuilder.createElement("Text", {
          props: {
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et",
          },
        }),
        id: "row13",
      },
      row14: {
        ...mailTemplateBuilder.createElement("Text", {
          props: {
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et",
          },
        }),
        id: "row14",
      },
      row15: {
        ...mailTemplateBuilder.createElement("Text", {
          props: {
            text: "515,00 €",
          },
        }),
        id: "row15",
      },
    },
    allIds: Array.from({ length: 12 }).map((_, i) => `row${i + 1}`),
  },
};

// const initEmailTemplate = [
//   {
//     ...mailTemplateBuilder.createColumn("1"),
//     children: {
//       [0]: mailTemplateBuilder.createElement("Image"),
//     },
//   },
//   {
//     ...mailTemplateBuilder.createColumn("1"),
//     children: {
//       [0]: mailTemplateBuilder.createElement("Image"),
//     },
//   },
//   {
//     ...mailTemplateBuilder.createColumn("1"),
//     children: {
//       [0]: mailTemplateBuilder.createElement("Text"),
//     },
//   },
//   {
//     ...mailTemplateBuilder.createColumn("1"),
//     children: {
//       [0]: mailTemplateBuilder.createElement("Text"),
//     },
//   },
//   {
//     ...mailTemplateBuilder.createColumn("2"),
//     children: {
//       [0]: mailTemplateBuilder.createElement("Text"),
//       [1]: mailTemplateBuilder.createElement("Button"),
//     },
//   },
//   {
//     ...mailTemplateBuilder.createColumn("2"),
//     children: {
//       [0]: mailTemplateBuilder.createElement("Text"),
//     },
//   },
// ];

class MailTemplateBuilder1 extends Component {
  render() {
    return (
      <MailTemplateEditorProvider initEmailTemplate={initEmailTemplate2}>
        <div>
          <EditorLayout>
            <EditorElements />
          </EditorLayout>
        </div>
      </MailTemplateEditorProvider>
    );
  }
}

class EditorElements extends Component {
  static contextType = MailTemplateEditorContext;
  state = {
    emailTemplate: {},
  };
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    // Context đã sẵn sàng ở đây

    console.log(this.context);
  }

  render() {
    const { emailTemplate } = this.context as any;
    console.log("mail template", emailTemplate);
    return (
      <table
        id="main-template-editor"
        className="bg-white shadow-lg rounded-md "
      >
        <tbody>
          <tr>
            <td valign="top">
              <table width={600} align="center">
                <tbody>
                  <tr>
                    <td valign="top" style={{ padding: "15px" }}>
                      {emailTemplate.columns.allIds.map((id: any) => {
                        const el = emailTemplate.columns.byId[id];

                        if (el.type === "column")
                          return <ColumnLayout key={el.id} layout={el} />;

                        return null;
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
export default MailTemplateBuilder1;
