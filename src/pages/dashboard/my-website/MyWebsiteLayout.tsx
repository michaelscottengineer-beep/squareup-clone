import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { equalTo, get, ref } from "firebase/database";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { db } from "@/firebase";

import { useNavigate } from "react-router";

import type { TWebsite } from "@/types/website-template";
import { myWebsiteColumns } from "./myWebsiteColumns";
import useAuth from "@/hooks/use-auth";

const MyWebsiteLayout = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { data: items, isLoading } = useQuery({
    queryKey: ["websites", user?.uid],
    queryFn: async () => {
      try {
        const path = parseSegments("websites", user?.uid);

        const templatesRef = ref(db, path);

        const snap = await get(templatesRef);

        return snap.val() ? convertFirebaseArrayData<TWebsite>(snap.val()) : [];
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!user?.uid,
  });

  return (
    <div className="px-4">
      <h1 className="font-semibold text-lg mb-4">Your Websites</h1>
      <DataTable columns={myWebsiteColumns} data={items ?? []} />
    </div>
  );
};

export default MyWebsiteLayout;
