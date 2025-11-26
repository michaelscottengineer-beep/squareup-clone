import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import type { TPaymentMethod } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";

const BillingListCards = () => {
  const { user } = useAuth();

  const { data: methods } = useQuery({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_BASE_URL + "/payment_methods",
          {
            body: JSON.stringify({
              customerId: user?.customerId,
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
    enabled: !!user?.uid,
  });

  return (
    <div>
      <div className="flex mb-8 items-center justify-between">
        <h1 className="text-2xl font-semibold">BillingListCards</h1>
        <Button className="uppercase bg-green-500 hover:bg-green-600 ">
          <Plus className="w-4 h-4 mr-2" /> add new card
        </Button>
      </div>

      <div className="grid grid-cols-3">
        {methods?.map((method) => {
          return (
            <Button
              key={method.id}
              className="flex justify-start border-border border"
              asChild
              variant={"ghost"}
            >
              <div className="method flex font-semibold items-center gap-2">
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
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BillingListCards;
