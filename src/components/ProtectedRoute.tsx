import useAuth from "@/hooks/use-auth";
import type { PropsWithChildren } from "react";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { memberInfo, user } = useAuth();

  if (!user?.uid) return <div>Loading content...</div>;
  return !memberInfo || memberInfo?.basicInfo?.role === "admin" ? (
    children
  ) : (
    <div className="h-full w-full flex justify-center items-center">
      No permission
    </div>
  );
};

export default ProtectedRoute;
