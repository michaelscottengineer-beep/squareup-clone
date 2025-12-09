import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useMutation } from "@tanstack/react-query";
import { ref, set } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const ScheduleEditorDialog = ({ initDate }: { initDate: string }) => {
  const [date, setDate] = useState(new Date());
  const { campaignId } = useParams();
  const closeRef = useRef<HTMLButtonElement>(null);

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });

  const mutation = useMutation({
    mutationFn: async () => {
      return await set(ref(db, keys.detailedCampaign() + "/config/schedule"), {
        date: date.toISOString(),
      });
    },
    onSuccess: () => {
      toast.success("Edit schedule successfully!");
      closeRef.current?.click();
    },
    onError: (err) => {
      toast.error("Edit schedule failed: " + err.message);
    },
  });

  useEffect(() => {
    if (initDate) setDate(new Date(initDate));
  }, [initDate]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" rounded-full">Edit schedule</Button>
      </DialogTrigger>

      <DialogContent className="" showCloseButton={false}>
        <div className="flex items-center gap-10">
          <div>
            <Label className="text-lg">Date</Label>
            <p className="text-muted-foreground text-xs mb-2">
              When do you want to send your campaign?
            </p>
            <DatePicker
              value={date}
              onValueChange={(data) => {
                console.log("change date", data);
                const newDate = new Date(date);
                newDate.setDate(data.getDate());
                newDate.setMonth(data.getMonth());
                newDate.setFullYear(data.getFullYear());

                setDate(newDate);
              }}
            ></DatePicker>
          </div>

          <div>
            <Label className="text-lg">Time</Label>
            <p className="text-muted-foreground text-xs mb-2">
              Asia/Ho_Chi_Minh GMT+07:00
            </p>
            <Input
              type="time"
              value={`${date.getHours().toString().padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`}
              onChange={(e) => {
                const [h, m] = e.target.value.split(":");
                const newDate = new Date(date);
                newDate.setHours(Number(h));
                newDate.setMinutes(Number(m));
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex items-center gap-4">
            <DialogClose asChild ref={closeRef}>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Spinner />} Edit schedule
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleEditorDialog;
