import { DataTable } from "@/components/ui/data-table";
import { parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { transactionColumns } from "./transaction-column";

const CUSTOMER_ID = `cus_TQ00ka7jjNyZ8e`;

const BillingTransaction = () => {
  const { data: transactions } = useQuery({
    queryKey: ["billings", "transactions", CUSTOMER_ID],
    queryFn: async () => {
      const res = await fetch(
        import.meta.env.VITE_BASE_URL +
          "/billings/transactions?customerId=" +
          CUSTOMER_ID
      );
      const ret = await res.json();
      const data = ret.data;
      return data;
    },
  });

  console.log('user transactions ' , transactions);

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-4">Billing Transactions</h1>
      <div>
        <DataTable columns={transactionColumns}  data={transactions || []} />
      </div>
    </div>
  );
};

export default BillingTransaction;
