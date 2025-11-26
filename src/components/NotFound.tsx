// NotFound.js
import React from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-xl font-semibold">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-4">The page you are looking for does not exist.</p>
      <Button
        onClick={() => {
          navigate(-1);
        }}
      >
        Go back
      </Button>
    </div>
  );
};

export default NotFound;
