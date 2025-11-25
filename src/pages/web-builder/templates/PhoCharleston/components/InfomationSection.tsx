import React from "react";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import SettingOverlay from "@/components/templates/SettingOverlay";
import InformationSettingContent from "../components/settings/InformationSettingContent";
import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router";

const InformationSection = () => {
  const sectionData = usePhoCharlestonEditor(
    (state) => state.sections.informationSection
  );
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);

  const { elements } = sectionData;

  return (
    <div className="relative">
      <div
        className="information-section py-16 px-8"
        style={{
          ...elements.general.style,
        }}
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Location Column */}
          <div className="location">
            <h3
              className="mb-4"
              style={{
                ...elements.locationTitle.style,
              }}
            >
              {elements.locationTitle.text}
            </h3>
            <div
              className="whitespace-pre-line"
              style={{
                ...elements.locationAddress.style,
              }}
            >
              {elements.locationAddress.text}
            </div>
          </div>

          {/* Hours Column */}
          <div className="hours">
            <h3
              className="mb-4"
              style={{
                ...elements.hoursTitle.style,
              }}
            >
              {elements.hoursTitle.text}
            </h3>
            <div
              className="whitespace-pre-line mb-4"
              style={{
                ...elements.hoursFriSat.style,
              }}
            >
              {elements.hoursFriSat.text}
            </div>
            {/* <div
              className="whitespace-pre-line"
              style={{
                ...elements.hoursWeekdays.style,
              }}
            >
              {elements.hoursWeekdays.text}
            </div> */}
          </div>

          {/* Social Media Column */}
          <div className="social">
            <h3
              className="mb-4"
              style={{
                ...elements.socialTitle.style,
              }}
            >
              {elements.socialTitle.text}
            </h3>
            <div className="flex gap-4 text-2xl">
              {elements.socialLinks.data?.items.map(
                (item: any, index: number) => (
                  <Link
                    key={index}
                    to={item.url}
                    aria-label={item.label}
                    className="hover:opacity-70 transition-opacity"
                    style={{ color: elements.general.style?.color }}
                  >
                    {item.icon === "facebook" && <Facebook />}
                    {item.icon === "instagram" && <Instagram />}
                    {item.icon === "yelp" && (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                      </svg>
                    )}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Contact Column */}
          <div className="contact">
            <h3
              className="mb-4"
              style={{
                ...elements.contactTitle.style,
              }}
            >
              {elements.contactTitle.text}
            </h3>
            <div
              className="mb-2"
              style={{
                ...elements.contactPhone.style,
              }}
            >
              {elements.contactPhone.text}
            </div>
            <div
              style={{
                ...elements.contactEmail.style,
              }}
            >
              {elements.contactEmail.text}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <SettingOverlay settingContent={<InformationSettingContent />} />
      )}
    </div>
  );
};

export default InformationSection;
