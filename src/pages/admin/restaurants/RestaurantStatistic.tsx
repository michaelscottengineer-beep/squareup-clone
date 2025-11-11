import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { db } from "@/firebase";
import type { TRestaurant } from "@/types/restaurant";
import { parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { DollarSign, Star, Users, UtensilsCrossed } from "lucide-react";
import React from "react";

const RestaurantStatistic = ({
  restaurantId,
  trigger,
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (o: boolean) => void;
  restaurantId: string;
  trigger?: React.ReactNode;
}) => {
  const { data: statistics } = useQuery({
    queryKey: ["restaurants", "details", restaurantId],
    queryFn: async () => {
      const resRef = ref(
        db,
        parseSegments("restaurants", restaurantId, "statistics")
      );
      const doc = await get(resRef);
      return (doc.val() as TRestaurant["statistics"]);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl!">
        <div className="p-8 grid grid-cols-2 gap-4">
           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Order</p>
                <p className="text-3xl font-bold mt-1">
                  {statistics?.totalOrder}
                </p>
              </div>
              <UtensilsCrossed  size={40} className="opacity-50" />
            </div>
          </div>


          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">
                  {statistics?.totalRevenue}
                </p>
              </div>
              <DollarSign size={40} className="opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Staff</p>
                <p className="text-3xl font-bold mt-1">
                  {statistics?.totalStaff}
                </p>
              </div>
              <Users size={40} className="opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Average Rating</p>
                <p className="text-3xl font-bold mt-1">
                  {statistics?.averageRating}
                </p>
              </div>
              <Star size={40} className="opacity-50" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantStatistic;
