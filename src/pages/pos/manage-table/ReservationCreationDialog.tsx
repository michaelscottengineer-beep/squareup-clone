import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import tableFirebaseKey from "@/factory/table/table.firebaseKey";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TRestaurantTable } from "@/types/restaurant";
import { parseSegments } from "@/utils/helper";
import { SelectValue } from "@radix-ui/react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { get, push, ref, set } from "firebase/database";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ReservationCreationDialog = () => {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full flex-wrap">
          <Plus /> <span>Add New Reservation</span>
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogClose className="hidden" ref={closeRef} />
        <ReservationCreationForm
          onSubmitCallback={() => closeRef.current?.click()}
        />
      </DialogContent>
    </Dialog>
  );
};

interface ReservationCreationDialogProps {
  onSubmitCallback?: () => void;
}
type TFormValues = TRestaurantTable["status"] & { tableName?: string };

const ReservationCreationForm = ({
  onSubmitCallback,
}: ReservationCreationDialogProps) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const queryClient = useQueryClient();

  const form = useForm<TFormValues>({
    defaultValues: {
      bookedAt: new Date().toISOString(),
      numberOfPeople: 0,
      customerInfo: { name: "", phone: "" },
      paymentStatus: "unpaid",
      tableStatus: "reserved",
      tableName: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TFormValues) => {
      const keys = tableFirebaseKey({ restaurantId, tableId: data.tableName });
      const tableRef = keys.detailsRef();
      const tableDoc = await get(tableRef);
      if (!tableDoc.exists()) {
        throw new Error("Table" + data.tableName + " does not exist!");
      } else {
        const tableData = tableDoc.val() as TRestaurantTable;
        if (
          tableData.status?.tableStatus !== "available" &&
          tableData.status?.tableStatus !== undefined
        ) {
          throw new Error("Table is not available!");
        } 
        if (data.numberOfPeople > tableData.basicInfo.maxPeople) {
          throw new Error(
            `Number of people exceeds max capacity of ${tableData.basicInfo.maxPeople}!`
          );
        }
      }

      delete data["tableName"];
      return await set(ref(db, parseSegments(keys.details(), "status")), {
        ...data,
      });
    },

    onSuccess: () => {
      toast.success("Action successfully");
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "pos", "allTables"],
      });
      onSubmitCallback?.();
    },
    onError: (err) => {
      console.error("Action error", err);
      toast.error("Action error: " + err.message);
    },
  });

  const onSubmit = (data: TFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name={`tableName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`customerInfo.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`customerInfo.phone`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Phone</FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`numberOfPeople`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of People</FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`bookedAt`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>

              <FormControl>
                {/* <DatePicker value={new Date(field.value)} onValueChange={(date) => field.onChange(date.toISOString())} /> */}
                <Input
                  type="time"
                  id="time-picker"
                  value={formatDate(new Date(field.value), "HH:mm:ss")}
                  onChange={(e) => {
                    console.log(e.target.value);
                    const [HH, mm, ss] = e.target.value.split(":");
                    const date = new Date(field.value);
                    date.setHours(parseInt(HH), parseInt(mm), parseInt(ss));
                    field.onChange(date.toISOString());
                  }}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`paymentStatus`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>

              <FormControl>
                {/* <DatePicker value={new Date(field.value)} onValueChange={(date) => field.onChange(date.toISOString())} /> */}
                <Select
                  value={field.value || "unpaid"}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={"paid"} className="capitalize">
                      paid
                    </SelectItem>
                    <SelectItem value={"unpaid"} className="capitalize">
                      unpaid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        <Button className="ml-auto">Done</Button>
      </form>
    </Form>
  );
};
export default ReservationCreationDialog;
