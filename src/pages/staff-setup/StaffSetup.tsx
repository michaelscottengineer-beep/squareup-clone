import StaffJobSelector from "@/components/StaffJobSelector";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { Spinner } from "@/components/ui/spinner";
import { auth, db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { memberJob, type TInviting, type TMember } from "@/types/staff";
import { initFirebaseUpdateVariable, parseSegments } from "@/utils/helper";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { equalTo, get, ref, remove, set, update } from "firebase/database";
import { Check, X } from "lucide-react";
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
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
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
      setup: {
        password: "",
      },
    },
  });

  const { data: inviting, isLoading } = useQuery({
    queryKey: ["invites", invitingId],
    queryFn: async () => {
      const inviteRef = ref(db, parseSegments(...["invites", invitingId]));
      const doc = await get(inviteRef);

      return { ...doc.val(), id: invitingId } as TInviting;
    },
    enabled: !!invitingId,
  });

  const { data: staff } = useQuery({
    queryKey: [
      "restaurants",
      inviting?.restaurantId,
      "allStaffs",
      inviting?.staffId,
    ],
    queryFn: async () => {
      const staffId = inviting?.staffId;
      const staffRef = ref(
        db,
        parseSegments(
          ...["restaurants", inviting?.restaurantId, "allStaffs", staffId]
        )
      );
      const doc = await get(staffRef);

      return { ...doc.val(), id: staffId } as TMember;
    },
    enabled: !!inviting?.staffId,
  });

  const { mutate: rejectInvite } = useMutation({
    mutationFn: async () => {
      const invitingRef = ref(db, parseSegments("invites", invitingId));
      const updates = initFirebaseUpdateVariable();

      const staffStatusPath = parseSegments(
        "restaurants",
        inviting?.restaurantId,
        "allStaffs",
        inviting?.staffId,
        "basicInfo",
        "status"
      );

      updates[staffStatusPath] = "rejected";

      return Promise.all([remove(invitingRef), update(ref(db), updates)]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invites", invitingId],
      });
      toast.success("Rejected successfully!");
    },
    onError: (err) => {
      toast.error('Rejected error: ' + err.message)
    }
  });
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const basicInfo = data.basicInfo;
      if (!data.setup.password) {
        throw new Error("Please provide your password!");
      }

      const customerRes = await fetch(
        import.meta.env.VITE_BASE_URL + "/create-customer",
        {
          method: "POST",
          body: JSON.stringify({
            fullName: basicInfo.fullName,
            email: basicInfo.email,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const customerRet = await customerRes.json();

      if (!customerRet.id) {
        throw new Error("Create customer error!");
      }

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
        customerId: customerRet.id,
      });

      updates[
        parseSegments("users", userKey, "restaurants", inviting?.restaurantId)
      ] = {
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
      toast.error(`Setup member error : ` + err.message);
    },
  });

  useEffect(() => {
    if (staff) {
      form.reset({
        ...form.getValues(),
        ...staff,
        basicInfo: {
          ...form.getValues().basicInfo,
          ...staff.basicInfo,
        },
      });
    }
  }, [staff, form]);

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner /> Loading Item...
      </div>
    );
  }

  if (!inviting?.staffId) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        This inviting does not exists!
      </div>
    );
  }

  console.log(
    "check job",
    staff?.basicInfo.job,
    form.getValues("basicInfo.job")
  );
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
                      <FormLabel>Full Name</FormLabel>
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
                      <FormLabel>Address</FormLabel>
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
                      <FormLabel>Phone</FormLabel>
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
                      <FormLabel>Gender</FormLabel>
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
                      <FormLabel>Day of Birth</FormLabel>
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
                      <FormLabel>Job</FormLabel>
                      <FormControl>
                        <StaffJobSelector
                          restaurantId={inviting?.restaurantId ?? ""}
                          value={field.value}
                          onValueChange={(val) => field.onChange(val)}
                          disabled
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
                      <FormLabel>Password</FormLabel>
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

              <div className="flex items-center gap-8">
                <Button className="flex-1">
                  <Check /> {"DONE"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    rejectInvite();
                  }}
                  variant={"destructive"}
                  className="flex-1"
                >
                  <X />
                  {"Reject"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffSetup;
