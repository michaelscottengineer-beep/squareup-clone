import React, { type PropsWithChildren } from "react";

const ElementLayout = ({
  children,
  tdProps,
}: PropsWithChildren<{
  tdProps?: React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableDataCellElement>,
    HTMLTableDataCellElement
  >;
}>) => {
  return (
    <table width={"100%"} style={{ height: "100%" }}>
      <tbody>
        <tr>
          <td
            align="center"
            {...tdProps}
            style={{
              ...tdProps?.style,
            }}
          >
            {children}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ElementLayout;
