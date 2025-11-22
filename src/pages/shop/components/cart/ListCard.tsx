import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TPaymentMethod } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaCcVisa } from "react-icons/fa6";
import { FaCcMastercard } from "react-icons/fa6";

interface ListCardProps {
  onChange?: (methodId: string) => void;
}

const ListCard = ({ onChange }: ListCardProps) => {
  const { data: methods } = useQuery({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_BASE_URL + "/payment_methods",
          {
            body: JSON.stringify({
              customerId: "cus_TQ00ka7jjNyZ8e",
            }),
            headers: {
              "Content-Type": "application/json", // IMPORTANT
            },
            method: "POST",
          }
        );
        const ret = await res.json();

        return ret?.data as TPaymentMethod[];
      } catch (err) {
        console.log(err);
        return [];
      }
    },
  });

  useEffect(() => {
    if (methods?.length) {
      onChange?.(methods[0].id);
    }
  }, [methods]);

  console.log(methods);
  return (
    <div>
      <RadioGroup
        onValueChange={(val) => onChange?.(val)}
        defaultValue={methods?.[0]?.id ?? ""}
      >
        {methods?.map((method) => {
          return (
            <Button
              key={method.id}
              className="flex justify-start border-border border"
              asChild
              variant={"ghost"}
            >
              <Label className="method flex font-semibold items-center gap-2">
                <RadioGroupItem value={method.id} />
                <div>
                  {method.card.brand === "mastercard" ? (
                    <FaCcMastercard />
                  ) : (
                    <FaCcVisa />
                  )}
                </div>
                <div>{method.card.brand}</div>
                <div className="text-xs">**** {method.card.last4}</div>
                <div className="ml-auto text-xs">
                  {method.card.exp_month} / {method.card.exp_year}
                </div>
              </Label>
            </Button>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default ListCard;
