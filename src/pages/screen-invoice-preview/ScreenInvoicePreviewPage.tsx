import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { BiMoney } from "react-icons/bi";
import { io, type Socket } from "socket.io-client";

const ScreenInvoicePreviewPage = () => {
  const socketRef = React.useRef<Socket | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BASE_URL + "/invoice-preview");
    socketRef.current.connect();
    socketRef.current.on("customer:invoice-viewer", (data) => {
      console.log("Invoice viewer data:", data);
      setInvoiceData(data);
    });
    return () => {
      // Clean up on unmount
      socketRef.current?.disconnect();
    };
  }, []);

  const handleConfirm = () => {
    socketRef.current?.emit("invoice:customer-confirmation", {
      isConfirmed: true,
    });
  };

  if (!invoiceData) return <div>Welcome</div>;

  return (
    <div>
      <h1>Screen Invoice Preview Page</h1>
      <div className="flex items-center">
        <div>
          <pre>{JSON.stringify(invoiceData, null, 2)}</pre>
        </div>

        <div className="flex flex-col gap-2 w-[300px] border border-primary
        ">
          {Object.values(invoiceData.selectedItems).map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b py-2"
            >
              <span>
                {item.name} x {item.amount}
              </span>
              <span>
                ${((Number(item.price) || 0) * item.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {invoiceData?.paymentMethod === "scan" && (
        <div className="mt-4">
          <h2>Scan to Pay</h2>
          <img
            src={"/qrtmp.avif"}
            alt="Scan to Pay QR Code"
            className="w-64 h-64"
          />
        </div>
      )}

      <Button
        onClick={() => {
          setInvoiceData(null);
          handleConfirm();
        }}
      >
        Confirm
      </Button>
    </div>
  );
};

export default ScreenInvoicePreviewPage;
