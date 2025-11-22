import { DataTable } from "@/components/ui/data-table";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { db } from "@/firebase";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

import type { TOrderCartItem, TOrderDocumentData } from "@/types/checkout";
import type { TWebsiteTemplate } from "@/types/website-template";
import { myWebsiteColumns } from "./myWebsiteColumns";

const MyWebsiteLayout = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: items, isLoading } = useQuery({
    queryKey: ["restaurants", restaurantId, "allWebsites"],
    queryFn: async () => {
      try {
        const path = parseSegments("restaurants", restaurantId, "allWebsites");

        const templatesRef = ref(db, path);

        const snap = await get(templatesRef);

        return snap.val()
          ? convertFirebaseArrayData<TWebsiteTemplate>(snap.val())
          : [];
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!restaurantId
  });

  return (
    <div>
      {!items?.length ? (
        <div>No orders found</div>
      ) : (
        <DataTable columns={myWebsiteColumns} data={items} />
      )}
    </div>
  );
};

export default MyWebsiteLayout;
