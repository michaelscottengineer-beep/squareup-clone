import React from "react";
import { Outlet } from "react-router";

const RootPage = () => {
  return (
    <div>
      RootPage
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default RootPage;
