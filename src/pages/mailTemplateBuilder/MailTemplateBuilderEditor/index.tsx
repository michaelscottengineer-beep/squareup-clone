import ColumnLayout from "@/components/MailTemplateBuilder/ColumnLayout";
import EditorLayout from "@/components/MailTemplateBuilder/EditorLayout";
import { AppRouterContext } from "@/contexts/appRouterContext";
import {
  MailTemplateEditorContext,
  MailTemplateEditorProvider,
} from "@/contexts/mailTemplateEditorContext";
import { db } from "@/firebase";
import type { TSystemMailTemplate } from "@/types/mailTemplate";
import { get, ref } from "firebase/database";
import React, { Component } from "react";

class MailTemplateBuilderEditor extends Component {
  static contextType = AppRouterContext;

  constructor(props: any) {
    super(props);
  }

  render() {
    const { params } = this.context as any;
    const { mailTemplateId } = params;
    return <MailTemplateLayout mailTemplateId={mailTemplateId as any} />;
  }
}

class MailTemplateLayout extends Component {
  static contextType = MailTemplateEditorContext;

  state = {
    isLoading: true,
    mailTemplateId: this.props.mailTemplateId, // Lấy từ props
    emailTemplate: [],
  };

  constructor(props: any) {
    super(props);
    console.log(props.mailTemplateId);

    this.state = { ...this.state, mailTemplateId: props.mailTemplateId };
  }

  async getTemplate(mailTemplateId: any) {
    try {
      const doc = await get(ref(db, "allEmailTemplates/" + mailTemplateId));
      const ret = doc.val() as TSystemMailTemplate;

      this.setState({
        emailTemplate: ret ? ret.data.tree : null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching template:", error);
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.getTemplate(this.state.mailTemplateId);
  }

  render() {
    const { emailTemplate } = this.state;
    if (emailTemplate === null) {
      return <div className="w-screen h-screen justify-center flex items-center text-2xl font-medium">Not Found</div>
    }
    return emailTemplate.length === 0 && this.state.isLoading ? (
      <div className="m-auto">Loading....</div>
    ) : (
      <MailTemplateEditorProvider initEmailTemplate={emailTemplate}>
        <div>
          <EditorLayout>
            <MailTemplateEditor />
          </EditorLayout>
        </div>
      </MailTemplateEditorProvider>
    );
  }
}

class MailTemplateEditor extends Component {
  static contextType = MailTemplateEditorContext;

  render() {
    const { emailTemplate } = this.context as any;
    console.log("ee", emailTemplate);
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
                    <td valign="top" style={{ padding: "20px" }}>
                      {emailTemplate.map((el: any) => {
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
export default MailTemplateBuilderEditor;
