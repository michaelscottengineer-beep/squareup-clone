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
import { auth, db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { memberJob, type TInviting, type TMember } from "@/types/staff";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
  set,
  update,
} from "firebase/database";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

type FormValues = TMember & {
  setup: {
    password: string;
  };
};
const StaffSetup = () => {
  const navigate = useNavigate();
  const { invitingId } = useParams();

  const form = useForm<FormValues>({
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
      setup: {
        password: "",
      },
    },
  });

  const { data: inviting } = useQuery({
    queryKey: ["invites", invitingId],
    queryFn: async () => {
      const inviteRef = ref(db, parseSegments(...["invites", invitingId]));
      const doc = await get(inviteRef);

      return { ...doc.val(), id: invitingId } as TInviting;
    },
    enabled: !!invitingId,
  });

  console.log(inviting)
  const { data: staff } = useQuery({
    queryKey: ["restaurants", inviting?.restaurantId, "allStaffs", inviting?.staffId],
    queryFn: async () => {
      const staffId = inviting?.staffId;
      const staffRef = ref(
        db,
        parseSegments(...["restaurants", inviting?.restaurantId, "allStaffs", staffId])
      );
      const doc = await get(staffRef);
      console.log(doc.exists(), ["restaurants", inviting?.restaurantId, "allStaffs", staffId])
      return { ...doc.val(), id: staffId } as TMember;
    },
    enabled: !!inviting,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const basicInfo = data.basicInfo;

      const { user } = await createUserWithEmailAndPassword(
        auth,
        basicInfo.email,
        data.setup.password
      );

      const userKey = user.uid;

      const newStaffKey = inviting?.staffId;

      const staffStatusPath = parseSegments(
        "restaurants",
        inviting?.restaurantId,
        "allStaffs",
        newStaffKey,
        "basicInfo",
        "status"
      );
      const staffUserUIDPath = parseSegments(
        "restaurants",
        inviting?.restaurantId,
        "allStaffs",
        newStaffKey,
        "basicInfo",
        "userUID"
      );

      const updates: { [key: string]: any } = {};
      updates[staffStatusPath] = "accepted";
      updates[staffUserUIDPath] = userKey;

      await set(ref(db, parseSegments("users", userKey)), {
        displayName: basicInfo.fullName,
        email: basicInfo.email,
        role: "user",
        avatar: "",
        customerId: "",

      });

      updates[parseSegments("users", userKey, "restaurants", inviting?.restaurantId)] = {
        default: false,
        id: inviting?.restaurantId,
        staffId: newStaffKey,
      };


      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success(`Setup member successfully`);
      navigate("/signin");
    },
    onError: (err) => {
      console.log(`Setup member error`, err);
      toast.error(`Setup member error : ` + err.message);
    },
  });

  useEffect(() => {
    console.log("SS", staff);
    if (staff)
      form.reset({
        ...form.getValues(),
        basicInfo: {
          ...staff.basicInfo,
        },
      });
  }, [staff]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Dialog open>
      <DialogContent
        className="w-screen! max-w-full! h-screen rounded-none flex flex-col "
        showCloseButton={false}
      >
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
                      <FormControl>
                        <Input
                          disabled
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
                        <Input
                          disabled
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
                      <FormControl>
                        <Input
                          disabled
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
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="w-full" disabled>
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
                      <FormControl>
                        <Input
                          placeholder="Day of  Birth"
                          {...field}
                          className="flex-1"
                          disabled
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
                          <SelectTrigger className="w-full" disabled>
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`basicInfo.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Staff Email"
                          {...field}
                          disabled
                          className="flex-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`setup.password`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          required
                          placeholder="Your password"
                          {...field}
                          className="flex-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button>{"DONE"}</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffSetup;
