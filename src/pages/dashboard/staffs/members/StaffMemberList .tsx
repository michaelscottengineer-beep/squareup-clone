import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TMember } from "@/types/staff";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import React from "react";
import { useForm } from "react-hook-form";
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
    <div className="space-y-8">
      <div className="header flex items-center justify-between">
        <h1 className="text-2xl font-medium">Staff Member List</h1>
        <div>
          <Button onClick={() => navigate("/dashboard/staffs/members/new")}>
            Add Member
          </Button>
        </div>
      </div>

      <div>
        <DataTable
          columns={memberColumns}
          data={staffs ?? []}
        />
      </div>
    </div>
  );
};

export default StaffMemberList;
