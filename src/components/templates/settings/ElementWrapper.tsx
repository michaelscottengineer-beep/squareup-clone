import React, { type PropsWithChildren } from "react";

const ElementWrapper = ({ children }: PropsWithChildren) => {
  return <div className="w-max h-max">{children}</div>;
};

export default ElementWrapper;
