import React from "react";
import { Outlet } from "react-router";
import Header from "./shop/components/Header";

const RootPage = () => {
  return (
    <div>
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default RootPage;
