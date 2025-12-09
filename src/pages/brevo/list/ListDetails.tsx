import { ContactTable } from "@/components/ContactTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useBrevoFirebaseKey } from "@/factory/brevo/brevo.firebaseKey";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TContact } from "@/types/brevo";
import type { TRestaurantCustomer } from "@/types/restaurant";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
} from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get } from "firebase/database";
import { Plus, Undo2 } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router";

const ListDetails = () => {
  const { listId } = useParams();

  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, listId });

  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.contactsOfList()),
    queryFn: async () => {
      const docs = await get(keys.contactsOfListRef());

      const promise = Object.keys(docs.val()).map((customerId) => {
        keys.setParams({ customerId });
        return get(keys.detailedCustomerRef());
      });

      const ret = await Promise.all(promise);
      return ret.map(doc => doc.val() as TRestaurantCustomer);
    },
  });

  return (
    <div className="px-10 mt-10">
      <div className="mb-5">
        <Button
          variant="ghost"
          className="hover:bg-primary/10  text-primary!"
          onClick={() => {
            navigate(-1);
          }}
        >
          <Undo2 />
        </Button>
      </div>

      <div>
        <div className="w-full flex"></div>
        <ContactTable data={data ?? []} />
      </div>
    </div>
  );
};

export default ListDetails;
