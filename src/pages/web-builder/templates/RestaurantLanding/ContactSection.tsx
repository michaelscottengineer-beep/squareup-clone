import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone } from "lucide-react";
import React from "react";
import EditOverlay from "./EditOverlay";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import { Icon } from "@iconify/react";

interface ContactSectionProps {
  isEditing?: boolean;
}

const ContactSection = ({ isEditing }: ContactSectionProps) => {
  const contactSectionData = useEditorTemplateState(
    (state) => state.partEditorData.sections["contactSection"]
  );

  return (
    <section
      className="py-16 relative"
      style={{ ...contactSectionData.general.style }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="mb-4" style={{ ...contactSectionData.title.style }}>
            {contactSectionData?.title.text}
          </h2>
          <p style={{ ...contactSectionData.description.style }}>
            {contactSectionData?.description.text}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {contactSectionData.contactBlock.data?.items.map(
            (
              item: {
                title: string;
                description: string;
                iconName: string;
              },
              i: number
            ) => {
              return (
                <Card
                  key={i + 1}
                  className=""
                  style={{ ...contactSectionData.contactBlock.style }}
                >
                  <CardHeader>
                    <Icon
                      icon={item.iconName}
                      className="w-8 h-8 mb-2"
                      style={{
                        color: contactSectionData.contactBlock.style?.iconColor ?? "inherit",
                      }}
                    />
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={''} style={{color: 'inherit'}}>{item.description}</p>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      </div>
      {isEditing && <EditOverlay partEditorKey={"contactSection"} />}
    </section>
  );
};

export default ContactSection;
