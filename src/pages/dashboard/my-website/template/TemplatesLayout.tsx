import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { equalTo, get, ref } from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { db } from "@/firebase";

import { useNavigate } from "react-router";

import type { TWebsiteTemplate } from "@/types/website-template";
import { templateColumns } from "./template-columns";

const TemplatesLayout = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: items, isLoading } = useQuery({
    queryKey: ["users", restaurantId, "website-templates"],
    queryFn: async () => {
      try {
        const path = parseSegments("website-templates");

        const templatesRef = ref(db, path);

        const snap = await get(templatesRef);

        return snap.val()
          ? convertFirebaseArrayData<TWebsiteTemplate>(snap.val())
          : [];
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <div>
      {!items?.length ? (
        <div>No orders found</div>
      ) : (
        <DataTable columns={templateColumns} data={items} />
      )}
    </div>
  );
};

export default TemplatesLayout;
