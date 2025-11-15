import { Button } from "@/components/ui/button";
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
import { memberJob, type TMember } from "@/types/staff";
import { parseSegments } from "@/utils/helper";
import { useMutation } from "@tanstack/react-query";
import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
  update,
} from "firebase/database";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const MemberForm = () => {
  const restaurantId = useCurrentRestaurantId(state => state.id);

  const form = useForm<TMember>({
    defaultValues: {
      basicInfo: {
        address: "",
        createdAt: "",
        fullName: "",
        dob: "",
        job: "chef",
        gender: "F",
        phone: "",
        role: "employee",
        startedAt: "",
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TMember) => {
      const basicInfo = data.basicInfo;

      const userRef = ref(db, parseSegments("users"));
      const userQuery = query(
        userRef,
        orderByChild("email"),
        equalTo(basicInfo.email)
      );
      const user = await get(userQuery);
      if (!user.exists()) {
        throw new Error(
          "The user with email " + basicInfo.email + " doest not exists!"
        );
      }

      const userKey = Object.keys(user.val() ?? {})?.[0];

      const newStaffKey = push(
        ref(db, parseSegments("restaurants", restaurantId, "allStaffs"))
      ).key;
      const staffPath = parseSegments(
        "restaurants",
        restaurantId,
        "allStaffs",
        newStaffKey,
        "basicInfo"
      );
      const updates: { [key: string]: any } = {};
      updates[staffPath] = { ...basicInfo, userUID: userKey };
      updates[parseSegments("users", userKey, "restaurants", restaurantId)] = {
        default: false,
        id: restaurantId,
        staffId: newStaffKey,
      };

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Create member successfully");
    },
    onError: (err) => {
      console.log("create member error", err);
      toast.error("Create member error : " + err.message);
    },
  });
  const onSubmit = (data: TMember) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 max-w-[500px]"
      >
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name={`basicInfo.fullName`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Full Name"
                    {...field}
                    className="flex-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`basicInfo.address`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Address" {...field} className="flex-1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name={`basicInfo.phone`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Phone" {...field} className="flex-1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`basicInfo.gender`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>

                    <SelectContent className="">
                      <SelectItem value="M" className="">
                        Male
                      </SelectItem>
                      <SelectItem value="F" className="">
                        Female
                      </SelectItem>
                      <SelectItem value="O" className="">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name={`basicInfo.dob`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Day of  Birth"
                    {...field}
                    className="flex-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`basicInfo.job`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Job" />
                    </SelectTrigger>

                    <SelectContent className="">
                      {memberJob.map((job, i) => {
                        return (
                          <SelectItem
                            key={job}
                            value={job}
                            className="capitalize"
                          >
                            {job}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name={`basicInfo.email`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Staff Email"
                    {...field}
                    className="flex-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button>Create</Button>
      </form>
    </Form>
  );
};

export default MemberForm;
