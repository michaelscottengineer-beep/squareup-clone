import { Button } from "@/components/ui/button";
import React from "react";
import { IoMdPrint } from "react-icons/io";
import PaidButton from "../PaidButton";
import PlaceDraftOrderButton from "../PlaceDraftOrderButton";
import PlaceOrderButton from "../PlaceOrderButton";
import type { TOrderDocumentData } from "@/types/checkout";

const InvoiceActionButtons = ({
  orderStatus,
}: {
  orderStatus?: TOrderDocumentData['basicInfo']['orderStatus'];
}) => {
  return (
    <div className="flex items-center flex-wrap gap-4">
      <Button className="bg-white! text-gray-500 flex-1">
        <IoMdPrint />
        <span>Print</span>
      </Button>

      {orderStatus === "accepted" ? (
        <PaidButton />
      ) : (
        <>
          <PlaceDraftOrderButton />
          <PlaceOrderButton />
        </>
      )}
    </div>
  );
};

export default InvoiceActionButtons;
