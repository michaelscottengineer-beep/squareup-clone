import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, CreditCard, Lock } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type FormValues = {
  cardNumber: string;
  expire: string;
  cvc: string;
  zip: string;
  email: string;
};

const AddPaymentMethodButton = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + " / " + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch(
        import.meta.env.VITE_BASE_URL + "/create_payment_method",
        {
          body: JSON.stringify({
            type: "card",
            card: {
              exp_month: data.expire.split(" / ")[0],
              exp_year: data.expire.split(" / ")[1],
              number: data.cardNumber,
              cvc: data.cvc,
            },
            billing_details: {
              email: data.email,
            },
          }),
          headers: {
            "Content-Type": "application/json", // IMPORTANT
          },
          method: "POST",
        }
      );

      return await res.json();
    },
    onSuccess: (data) => {
      toast.success("created successfully");
    },
    onError: (err) => {
      console.error(err, "error, creat payment method");
      toast.error("create error", {
        description: err.message,
      });
    },
  });
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
    return;
    alert("Card added successfully!");
    reset();
    setOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form.getValues());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="uppercase bg-green-500 hover:bg-green-600 w-full">
          <Plus className="w-4 h-4 mr-2" /> add new card
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-0" showCloseButton={false}>
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Debit/Credit Card
            </DialogTitle>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          <div className="h-0.5 bg-gray-200 -mx-6 mt-4"></div>
        </DialogHeader>

        <div className="space-y-4 px-4 py-4">
          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 1234 1234 1234"
              maxLength={19}
              {...register("cardNumber", {
                required: "Card number is required",
                pattern: {
                  value: /^[\d\s]{19}$/,
                  message: "Enter a valid card number",
                },
                onChange: (e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setValue("cardNumber", formatted);
                },
              })}
              className={`pr-24 ${errors.cardNumber ? "border-red-500" : ""}`}
            />
            {errors.cardNumber && (
              <p className="text-xs text-red-500">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          {/* Expiry, CVC, and Zip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="expire">MM / YY</Label>
              <div className="relative">
                <Input
                  id="expire"
                  placeholder="MM / YY"
                  maxLength={7}
                  {...register("expire", {
                    required: "Expiry is required",
                    pattern: {
                      value: /^\d{2}\s\/\s\d{2}$/,
                      message: "Invalid format",
                    },
                    onChange: (e) => {
                      const formatted = formatExpiry(e.target.value);
                      setValue("expire", formatted);
                    },
                  })}
                  className={errors.expire ? "border-red-500" : ""}
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.expire && (
                <p className="text-xs text-red-500">{errors.expire.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <div className="relative">
                <Input
                  id="cvc"
                  placeholder="CVC"
                  maxLength={4}
                  {...register("cvc", {
                    required: "CVC is required",
                    pattern: {
                      value: /^\d{3,4}$/,
                      message: "Invalid CVC",
                    },
                  })}
                  className={errors.cvc ? "border-red-500" : ""}
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.cvc && (
                <p className="text-xs text-red-500">{errors.cvc.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">Zip</Label>
              <Input
                id="zip"
                placeholder="Zip"
                maxLength={10}
                {...register("zip", {
                  required: "Zip is required",
                  minLength: {
                    value: 5,
                    message: "Invalid zip",
                  },
                })}
                className={
                  errors.zip
                    ? "border-red-500 border-2"
                    : "border-2 border-orange-400"
                }
              />
              {errors.zip && (
                <p className="text-xs text-red-500">{errors.zip.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={
                  errors.email
                    ? "border-red-500 border-2"
                    : "border-2 border-orange-400"
                }
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleFormSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-6 rounded-lg"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            CONFIRM CARD
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodButton;
