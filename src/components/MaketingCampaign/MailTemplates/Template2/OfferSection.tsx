import SettingOverlay from "@/components/templates/SettingOverlay";
import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import React, { type CSSProperties } from "react";
import OfferCardSetting from "./settings/OfferCardSetting";

const OfferSection = () => {
  return (
    <div
      className="flex"
      style={{
        display: "flex",
      }}
    >
      {/* OFFER 1 */}
      <OfferCard1 />
      {/* OFFER 2 */}
      <OfferCard2 />
    </div>
  );
};

const OfferCard1 = () => {
  const offerCard1 = useTemplate2Editor((s) => s.sections.offerCard1);
  const isEditing = useTemplate2Editor((s) => s.isEditing);
  const offerCard1Els = offerCard1.elements;
  return (
    <div className="relative" style={{}}>
      <div className="">
        <img
          src={offerCard1Els.offer1Image?.data?.src ?? ""}
          alt={offerCard1Els.offer1Image?.data?.alt ?? "offer1"}
          style={offerCard1Els.offer1Image?.style ?? undefined}
        />
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", height: "300px" }}
      >
        <div style={offerCard1Els.offer1Panel?.style ?? undefined}>
          <h3 style={offerCard1Els.offer1Title?.style ?? undefined}>
            {offerCard1Els.offer1Title?.text ?? ""}
          </h3>

          <p style={offerCard1Els.offer1Description?.style ?? undefined}>
            {offerCard1Els.offer1Description?.text ?? ""}
          </p>

          <div>
            <span style={offerCard1Els.offer1PriceMain?.style ?? undefined}>
              {offerCard1Els.offer1PriceMain?.text ?? ""}
            </span>
            <span style={offerCard1Els.offer1PriceOld?.style ?? undefined}>
              {offerCard1Els.offer1PriceOld?.text ?? ""}
            </span>
          </div>

          <a
            href={offerCard1Els.offer1Button?.data?.url ?? "#"}
            style={{
              textDecoration: "none",
              display: "block",
              ...((offerCard1Els.offer1Button?.style as React.CSSProperties) ??
                {}),
            }}
          >
            {offerCard1Els.offer1Button?.text ?? ""}
          </a>
        </div>
      </div>

  
        {isEditing && (
        <SettingOverlay
          settingContent={<OfferCardSetting sectionKey="offerCard1" />}
          className="block!"
          style={{
            display: "none",
          }}
        />
      )}
    </div>
  );
};
const OfferCard2 = () => {
  const offerCard2 = useTemplate2Editor((s) => s.sections.offerCard2);
  const isEditing = useTemplate2Editor((s) => s.isEditing);

  const offerCard2Els = offerCard2.elements;
  return (
    <div className="relative" style={{}}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={offerCard2Els.offer2Panel?.style ?? undefined}>
          <h3 style={offerCard2Els.offer2Title?.style ?? undefined}>
            {offerCard2Els.offer2Title?.text ?? ""}
          </h3>

          <p style={offerCard2Els.offer2Description?.style ?? undefined}>
            {offerCard2Els.offer2Description?.text ?? ""}
          </p>

          <div>
            <span style={offerCard2Els.offer2PriceMain?.style ?? undefined}>
              {offerCard2Els.offer2PriceMain?.text ?? ""}
            </span>
            <span style={offerCard2Els.offer2PriceOld?.style ?? undefined}>
              {offerCard2Els.offer2PriceOld?.text ?? ""}
            </span>
          </div>

          <a
            href={offerCard2Els.offer2Button?.data?.url ?? "#"}
            style={{
              textDecoration: "none",
              display: "block",
              ...((offerCard2Els.offer2Button?.style as React.CSSProperties) ??
                {}),
            }}
          >
            {offerCard2Els.offer2Button?.text ?? ""}
          </a>
        </div>
      </div>
      <div className="">
        <img
          src={offerCard2Els.offer2Image?.data?.src ?? ""}
          alt={offerCard2Els.offer2Image?.data?.alt ?? "offer2"}
          style={offerCard2Els.offer2Image?.style ?? undefined}
        />
      </div>
   
       {isEditing && (
        <SettingOverlay
          settingContent={<OfferCardSetting sectionKey="offerCard2" />}
          className="block!"
          style={{
            display: "none",
          }}
        />
      )}
    </div>
  );
};

export default OfferSection;
