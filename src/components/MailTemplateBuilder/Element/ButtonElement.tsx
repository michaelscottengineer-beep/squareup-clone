import React, { type CSSProperties } from "react";
import ElementLayout from "./ElementLayout";

const ButtonElement = ({
  element,
}: {
  element: {
    style: CSSProperties;
    props: any;
    id: string;
  };
}) => {
  const { props, style } = element;

  const Content = () => props.text;

  return (
    <ElementLayout tdProps={{}}>
      <button style={{ textWrap: "pretty", ...style }}>
        {props.url ? (
          <a href={props.url} style={{ textWrap: "pretty" }}>
            <Content />
          </a>
        ) : (
          <Content />
        )}
      </button>
    </ElementLayout>
  );
};

export default ButtonElement;
