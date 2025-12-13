import React, { type CSSProperties } from "react";
import ElementLayout from "./ElementLayout";

const ImageElement = ({
  element,
}: {
  element: {
    style: CSSProperties;
    props: any;
    id: string;
  };
}) => {
  const { props, style } = element;

  return (
    <ElementLayout
      tdProps={{
        align: "center",
      }}
    >
      <img src={props.src} style={{...style}} />
    </ElementLayout>
  );
};

export default ImageElement;
