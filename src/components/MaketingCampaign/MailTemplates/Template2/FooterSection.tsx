import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import { Facebook, Instagram, Youtube } from "lucide-react";
import React from "react";

const FooterSection = () => {
  const footer = useTemplate2Editor((s) => s.footer);
  const isEditing = useTemplate2Editor((s) => s.isEditing);

  const f = footer.elements;

  return (
    <div style={f.footerWrapper?.style ?? undefined}>
      {/* FOOTER */}
      <div style={f.socialIconsBlock?.style ?? undefined}>
        {/* Facebook */}
        <a
          href={f.socialFacebook?.data?.url ?? "#"}
          style={f.socialFacebook?.style}
        >
          <Facebook
            size={16}
            color={f.socialFacebook?.style?.iconColor ?? "#fff"}
          />
        </a>

        {/* Custom SVG / placeholder */}
        <a
          href={f.socialCustom1?.data?.url ?? "#"}
          style={f.socialCustom1?.style}
        >
          {/* you can swap this with SVG markup if needed */}
          <span style={{ width: 16, height: 16, display: "inline-block" }} />
        </a>

        {/* Youtube */}
        <a
          href={f.socialYoutube?.data?.url ?? "#"}
          style={f.socialYoutube?.style}
        >
          <Youtube
            size={16}
            color={f.socialYoutube?.style?.iconColor ?? "#fff"}
          />
        </a>

        {/* Instagram */}
        <a
          href={f.socialInstagram?.data?.url ?? "#"}
          style={f.socialInstagram?.style}
        >
          <Instagram
            size={16}
            color={f.socialInstagram?.style?.iconColor ?? "#fff"}
          />
        </a>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={f.footerLegalTitle?.style}>{f.footerLegalTitle?.text}</div>
        <div style={f.footerAddress?.style}>{f.footerAddress?.text}</div>
        <div style={f.footerContact?.style}>{f.footerContact?.text}</div>
      </div>
    </div>
  );
};

export default FooterSection;
