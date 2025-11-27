import { Check, Edit2, Trash } from "lucide-react";
import React, { useState } from "react";

import usePosOrderLineState from "@/stores/use-pos-order-line-state";
import { Input } from "@/components/ui/input";
import {
  SectionHeader,
  SectionItemRow,
  SectionItemText,
  SectionTitle,
} from ".";
import { useMutation } from "@tanstack/react-query";
import tableFirebaseKey from "@/factory/table/table.firebaseKey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { get } from "firebase/database";
import type { TRestaurantTable } from "@/types/restaurant";
import { toast } from "sonner";

const TableNo = () => {
  const orderId = usePosOrderLineState((state) => state.orderId);
  const setTableNo = usePosOrderLineState((state) => state.setTableNo);
  const tableNo = usePosOrderLineState((state) => state.tableNo);
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const [text, setText] = useState(tableNo);
  const [isEdit, setIsEdit] = useState(false);

  const { mutate: checkTableName } = useMutation({
    mutationFn: async () => {
      const keys = tableFirebaseKey({ restaurantId, tableId: text });
      const tableRef = keys.detailsRef();
      const tableDoc = await get(tableRef);
      if (!tableDoc.exists()) {
        throw new Error("Table" + tableNo + " does not exist!");
      } else {
        const tableData = tableDoc.val() as TRestaurantTable;
        if (
          tableData.status?.tableStatus !== "available" &&
          tableData.status?.tableStatus !== undefined
        ) {
          throw new Error("Table is not available!");
        }
      }
    },
    onSuccess: () => {
      toast.success("Updated name successfully!");
      setIsEdit(false);
      setTableNo(text);
    },
    onError: (err) => {
      toast.error("Error: " + err.message);
    },
  });

  return (
    <div className="info section flex flex-col gap-1">
      <SectionHeader className="mb-0">
        <SectionTitle>
          {isEdit ? (
            <Input
              className=""
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            `Table No ${tableNo.padStart(2, "0")}`
          )}
        </SectionTitle>
        <div className="flex items-center gap-1">
          {isEdit ? (
            <Check
              className="w-4 h-4 text-green-500 cursor-pointer"
              onClick={() => {
                checkTableName();
              }}
            />
          ) : (
            <Edit2
              className="w-4 h-4 text-gray-400 cursor-pointer"
              onClick={() => setIsEdit(true)}
            />
          )}
          <Trash
            className="w-4 h-4 text-destructive cursor-pointer"
            onClick={() => setIsEdit(false)}
          />
        </div>
      </SectionHeader>

      <SectionItemRow>
        <SectionItemText className="font-medium">
          Order: {orderId}
        </SectionItemText>
        {/* <span className="font-medium">2 People</span> */}
      </SectionItemRow>
    </div>
  );
};

export default TableNo;
