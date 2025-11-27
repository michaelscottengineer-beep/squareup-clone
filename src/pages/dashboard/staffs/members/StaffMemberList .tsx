import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TMember } from "@/types/staff";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { useNavigate } from "react-router";
import { memberColumns } from "./memberColumns";

const StaffMemberList = () => {
  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: staffs } = useQuery({
    queryKey: ["restaurants", restaurantId, "allStaffs"],
    queryFn: async () => {
      const staffRef = ref(
        db,
        parseSegments("restaurants", restaurantId, "allStaffs")
      );
      const doc = await get(staffRef);

      return convertFirebaseArrayData<TMember>(doc.val() ?? {});
    },
  });

  return (
    <div className="space-y-4">
      <Button onClick={() => navigate("/dashboard/staffs/members/new")}>
        Add Member
      </Button>

      <div className="">
        <DataTable columns={memberColumns} data={staffs ?? []} />
      </div>
    </div>
  );
};

export default StaffMemberList;
