import React, { type CSSProperties } from "react";
import ElementLayout from "./ElementLayout";

const TextElement = ({
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
      <p style={{ ...style }}>{props.text}</p>
    </ElementLayout>
  );
};

export default TextElement;
