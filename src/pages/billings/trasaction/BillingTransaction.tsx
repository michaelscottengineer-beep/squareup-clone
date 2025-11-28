import { DataTable } from "@/components/ui/data-table";
import { parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { transactionColumns } from "./transaction-column";
import useAuth from "@/hooks/use-auth";

const BillingTransaction = () => {
  const { user } = useAuth();

  const { data: transactions } = useQuery({
    queryKey: ["billings", "transactions", user?.customerId],
    queryFn: async () => {
      const res = await fetch(
        import.meta.env.VITE_BASE_URL +
          "/billings/transactions?customerId=" +
          user?.customerId
      );
      const ret = await res.json();
      const data = ret.data;
      return data;
    },
    enabled: !!user?.customerId
  });


  return (
    <div>
      <h1 className="font-semibold text-2xl mb-4">Billing Transactions</h1>
      <div>
        <DataTable columns={transactionColumns} data={transactions || []} />
      </div>
    </div>
  );
};

export default BillingTransaction;
