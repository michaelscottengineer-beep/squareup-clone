import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { push, ref, remove, update } from "firebase/database";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/use-auth";
import type { TMember } from "@/types/staff";

const ActionsCell = ({ member }: { member: TMember }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { id: staffId, basicInfo } = member;

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { mutate: handleDelete } = useMutation({
    mutationFn: async () => {
      const staffPath = parseSegments(
        "restaurants",
        restaurantId,
        "allStaffs",
        staffId
      );
      const staffRestaurantPath = parseSegments(
        "users",
        basicInfo.userUID,
        "restaurants",
        restaurantId
      );

      return await Promise.all([
        remove(ref(db, staffPath)),
        remove(ref(db, staffRestaurantPath)),
      ]);
    },
    onSuccess: () => {
      toast.success("deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allStaffs"],
      });
    },
    onError: (err) => {
      toast.error("deleted error", {
        description: err.message,
      });
    },
  });

  const { mutate: handleResend } = useMutation({
    mutationFn: async () => {
      const data = member;

      const oldInvitingId = member.basicInfo.invitingId;
      const oldInvitingRef = ref(db, parseSegments("invites", oldInvitingId));

      const inviting = await push(ref(db, parseSegments("invites")), {
        restaurantId,
        email: data.basicInfo.email,
        staffId: data.id,
      });

      const updateInvitingIdPath = parseSegments(
        "restaurants",
        restaurantId,
        "allStaffs",
        data.id,
        "basicInfo",
        "invitingId"
      );
      const updateStatusPath = parseSegments(
        "restaurants",
        restaurantId,
        "allStaffs",
        data.id,
        "basicInfo",
        "status"
      );

      const sendEmailPromise = fetch(
        import.meta.env.VITE_BASE_URL + "/staff-inviting",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            email: data.basicInfo.email,
            restaurantName: restaurantId,
            invitingId: inviting.key,
          }),
        }
      );

      return Promise.all([
        oldInvitingId ? remove(oldInvitingRef) : "" ,
        update(ref(db), {
          [updateInvitingIdPath]: inviting.key,
          [updateStatusPath]: "pending",
        }),
        sendEmailPromise,
      ]);
    },
    onSuccess: () => {
      toast.success("Resent successfully");
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allStaffs"],
      });
    },
    onError: (err) => {
      toast.error("Resent error: " + err.message);
    },
  });

  const { mutate: handleCancel } = useMutation({
    mutationFn: async () => {
      const data = member;

      const oldInvitingId = member.basicInfo.invitingId;

      const oldInvitingRef = ref(db, parseSegments("invites", oldInvitingId));

      const updateInvitingIdPath = parseSegments(
        "restaurants",
        restaurantId,
        "allStaffs",
        data.id,
        "basicInfo",
        "invitingId"
      );
      const updateStatusPath = parseSegments(
        "restaurants",
        restaurantId,
        "allStaffs",
        data.id,
        "basicInfo",
        "status"
      );

      return Promise.all([
        remove(oldInvitingRef),
        update(ref(db), {
          [updateInvitingIdPath]: "",
          [updateStatusPath]: "canceled",
        }),
      ]);
    },
    onSuccess: () => {
      toast.success("Resent successfully");
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allStaffs"],
      });
    },
    onError: (err) => {
      toast.error("Resent error: " + err.message);
    },
  });
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleDelete()}>
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleResend()}>
          Resend
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCancel()}>
          Cancel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/dashboard/staffs/members/" + member.id)}
        >
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;
