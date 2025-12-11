import SettingOverlay from "@/components/templates/SettingOverlay";
import useTemplate1Editor from "@/stores/template-editor/useTemplate1Editor";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import GmailFooterSettings from "./GmailFooterSettings";

const GmailFooter = () => {
  const gmailFooter = useTemplate1Editor((state) => state.sections.gmailFooter);
  const isEditing = useTemplate1Editor((state) => state.isEditing);
  if (!gmailFooter || gmailFooter.isHidden) return null;

  const { elements } = gmailFooter;

  return (
    <div className="relative">
      <div
        style={{
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "2px solid #d1d5db",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}
        >
     
          {/* Right side content */}
          <div style={{ flex: 1 }}>
            {/* Brand Name */}
            <h3 style={elements.brandName.style}>{elements.brandName.text}</h3>

            {/* Slogan */}
            <p style={elements.slogan.style}>{elements.slogan.text}</p>

            {/* Contact block */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {/* Address */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                }}
              >
                <MapPin size={16} color="#2563eb" />
                <span style={elements.address.style}>
                  {elements.address.text}
                </span>
              </div>

              {/* Phone */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Phone size={16} color="#2563eb" />

                <span style={elements.phone.style}>{elements.phone.text}</span>
              </div>

              {/* Email */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Mail size={16} color="#2563eb" />

                <a href={elements.email.data?.url} style={elements.email.style}>
                  {elements.email.text}
                </a>
              </div>

              {/* Website */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Globe size={16} color="#2563eb" />
                <a
                  href={elements.website.data?.url}
                  style={elements.website.style}
                >
                  {elements.website.text}
                </a>
              </div>
            </div>

            {/* Disclaimer */}
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <p style={elements.disclaimer.style}>
                {elements.disclaimer.text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <SettingOverlay
          settingContent={<GmailFooterSettings />}
          style={{ display: "none" }}
          className="block!"
        />
      )}
    </div>
  );
};

export default GmailFooter;
