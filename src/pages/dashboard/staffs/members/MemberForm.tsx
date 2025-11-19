import StaffJobSelector from "@/components/StaffJobSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
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
  SelectValue,
} from "@/components/ui/select";
import { SheetClose } from "@/components/ui/sheet";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { memberJob, type TMember } from "@/types/staff";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
  update,
} from "firebase/database";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const MemberForm = () => {
  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const { staffId } = useParams();

  const form = useForm<TMember>({
    defaultValues: {
      basicInfo: {
        address: "",
        createdAt: "",
        fullName: "",
        dob: "",
        job: "",
        gender: "F",
        phone: "",
        role: "employee",
        startedAt: "",
      },
    },
  });

  const { data: staff } = useQuery({
    queryKey: ["restaurants", restaurantId, "allStaffs", staffId],
    queryFn: async () => {
      const staffRef = ref(
        db,
        parseSegments(...["restaurants", restaurantId, "allStaffs", staffId])
      );
      const doc = await get(staffRef);

      return { ...doc.val(), id: staffId };
    },
    enabled: !!restaurantId && !!staffId && staffId !== "new",
  });

  const mutation = useMutation({
    mutationFn: async (data: TMember) => {
      const basicInfo = data.basicInfo;

      // const userRef = ref(db, parseSegments("users"));
      // const userQuery = query(
      //   userRef,
      //   orderByChild("email"),
      //   equalTo(basicInfo.email)
      // );
      // const user = await get(userQuery);
      // if (!user.exists()) {
      //   throw new Error(
      //     "The user with email " + basicInfo.email + " doest not exists!"
      //   );
      // }

      // const userKey = Object.keys(user.val() ?? {})?.[0];

      let newStaffKey = null;
      if (staffId && staffId !== "new") newStaffKey = staffId;
      else {
        newStaffKey = push(
          ref(db, parseSegments("restaurants", restaurantId, "allStaffs"))
        ).key;
      }

      const staffPath = parseSegments(
        "restaurants",
        restaurantId,
        "allStaffs",
        newStaffKey,
        "basicInfo"
      );
      const updates: { [key: string]: any } = {};
      updates[staffPath] = {
        ...basicInfo,
        userUID: "",
        status: "pending",
      };
      // updates[parseSegments("users", userKey, "restaurants", restaurantId)] = {
      //   default: false,
      //   id: restaurantId,
      //   staffId: newStaffKey,
      // };

      update(ref(db), updates);

      const inviting = await push(ref(db, parseSegments("invites")), {
        restaurantId,
        email: data.basicInfo.email,
        staffId: newStaffKey,
      });

      return await fetch(import.meta.env.VITE_BASE_URL + "/staff-inviting", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email: data.basicInfo.email,
          restaurantName: restaurantId,
          invitingId: inviting.key,
        }),
      });
    },
    onSuccess: () => {
      toast.success(
        `${
          staffId && staffId !== "new" ? "Edit" : "Send an inviting to"
        } member successfully`
      );
      navigate(-1);
    },
    onError: (err) => {
      console.log(
        `${
          staffId && staffId !== "new" ? "Edit" : "Send an inviting to"
        } member error`,
        err
      );
      toast.error(
        `${
          staffId && staffId !== "new" ? "Edit" : "Send an inviting to"
        } member error : ` + err.message
      );
    },
  });

  useEffect(() => {
    if (staff) form.reset(staff);
  }, [staff]);

  const onSubmit = (data: TMember) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Dialog open>
      <DialogContent
        className="w-screen! max-w-full! h-screen rounded-none flex flex-col "
        showCloseButton={false}
      >
        <DialogHeader className="p-0 w-full h-max flex justify-between">
          <Button
            variant={"ghost"}
            className="w-max h-max p-2 rounded-full"
            size={"icon-lg"}
            onClick={() => navigate(-1)}
          >
            <X />
          </Button>
          <div></div>
        </DialogHeader>
        <div className="w-full h-full flex justify-center items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8 w-full max-w-[600px] "
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`basicInfo.fullName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Address"
                          {...field}
                          className="flex-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`basicInfo.phone`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone"
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
                  name={`basicInfo.gender`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>

                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="w-full">
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`basicInfo.dob`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of Birth</FormLabel>
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
                      <FormLabel>Select Staff Job</FormLabel>
                      <FormControl>
                        <StaffJobSelector
                          restaurantId={restaurantId}
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`basicInfo.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
              <Button>
                {staffId && staffId !== "new" ? "Save" : "Create"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberForm;
