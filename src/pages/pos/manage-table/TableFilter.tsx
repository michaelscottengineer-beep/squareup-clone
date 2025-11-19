import React from "react";
import TableStatusTabsList from "./TableStatusTabsList";
import TableStatusList from "./TableStatusList";
import ReservationCreationDialog from "./ReservationCreationDialog";

const TableFilter = () => {
  const [selectedTab, setSelectedTab] = React.useState<string>("All");

  return (
    <div className="flex flex-col pl-4 py-6">
      <TableStatusTabsList onValueChange={(val) => setSelectedTab(val)} />

      <div className="pr-4 space-y-4 flex-1 flex flex-col">
        <TableStatusList selectedTab={selectedTab} />

        <ReservationCreationDialog />
      </div>
    </div>
  );
};

export default TableFilter;
