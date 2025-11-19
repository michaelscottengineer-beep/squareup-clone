import React from "react";
import TableFilter from "./TableFilter";
import TableView from "./TableView";

const TableManagementLayout = () => {
  return (
    <div className="grid grid-cols-12 max-h-[calc(100vh-var(--pos-header-height))]">
      <div className="col-span-4 ">
        <TableFilter />
      </div>
      <div className="col-span-8 ">
        <TableView />
      </div>
    </div>
  );
};

export default TableManagementLayout;
