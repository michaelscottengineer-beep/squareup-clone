import { ContactTable } from "@/components/ContactTable";
import { useQuery } from "@tanstack/react-query";
import { Columns, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBrevoFirebaseKey } from "@/factory/brevo/brevo.firebaseKey";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
} from "@/utils/helper";
import { get } from "firebase/database";
import type { TContact } from "@/types/brevo";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TRestaurantCustomer } from "@/types/restaurant";

const ContactTableContainer = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const keys = useRestaurantFirebaseKey({ restaurantId });
  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allCustomers()),
    queryFn: async () => {
      const docs = await get(keys.allCustomerRef());

      return convertFirebaseArrayData<TRestaurantCustomer>(docs.val());
    },
  });

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">2 contacts</span>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-[#0b4d2c]">
            <Columns className="h-4 w-4 mr-2" />
            Customize columns
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone number or e..."
              className="pl-9 w-[320px]"
            />
          </div>
        </div>
      </div>

      <ContactTable data={data ?? []} />
    </div>
  );
};

export default ContactTableContainer;
