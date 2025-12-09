"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useBrevoFirebaseKey } from "@/factory/brevo/brevo.firebaseKey";
import { increment, push, ref, update } from "firebase/database";
import { db } from "@/firebase";
import { initFirebaseUpdateVariable } from "@/utils/helper";
import { toast } from "sonner";

interface CreateContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  sms: string;
  jobTitle: string;
  linkedin: string;
}

export function CreateContactDialog({
  open,
  onOpenChange,
}: CreateContactDialogProps) {
  const form = useForm<FormData>({
    defaultValues: {
      firstName: 'First n',
      lastName: "Last n",

    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = form;

  const keys = useBrevoFirebaseKey({});

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const newContact = await push(keys.allContactsRef());
      keys.setParams({ contactId: newContact.key });

      const updates = initFirebaseUpdateVariable();

      updates[keys.detailedContact() +  '/basicInfo'] = data;
      updates[keys.allContactStatistics() + "/totalContact"] = increment(1);

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Created successfully!");
      reset();
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Created failed: " + err.message);
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Create a contact
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 pb-6 space-y-4"
          >
            <FormField
              control={control}
              name={`firstName`}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    FIRSTNAME
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`lastName`}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    LASTNAME
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`email`}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    EMAIL
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123123"
                      className={errors.email ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`sms`}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    SMS
                  </FormLabel>

                  <FormControl>
                    <div className="flex gap-2">
                      <Select defaultValue="vn">
                        <SelectTrigger className="w-[80px]">
                          <SelectValue>
                            <span className="flex items-center gap-1">
                              <span>🇻🇳</span>
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vn">🇻🇳</SelectItem>
                          <SelectItem value="us">🇺🇸</SelectItem>
                          <SelectItem value="uk">🇬🇧</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input {...field} placeholder="+84" className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                JOB_TITLE
              </Label>
              <Input {...register("jobTitle")} placeholder="Some text here" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                LINKEDIN
              </Label>
              <Input {...register("linkedin")} placeholder="Some text here" />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                className="text-[#0b4d2c]"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1a1a2e] hover:bg-[#16162a] text-white"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
