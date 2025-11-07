import { daysOfWeek, timeSlots30min } from "@/data/date";
import { db } from "@/firebase";
import type { TOpeningHours } from "@/types/restaurant";
import { parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";

const useCheckAvailableOpeningHours = (shopId?: string) => {

  const { data } = useQuery({
    queryKey: ["restaurants", shopId, "basicInfo", "openingHours"],
    queryFn: async () => {
      const openHoursRef = ref(
        db,
        parseSegments("restaurants", shopId, "basicInfo", "openingHours")
      );
      const doc = await get(openHoursRef);
      console.log(doc);
      return doc.val() as TOpeningHours[];
    },
    enabled: !!shopId,
  });

  if (!data) return false;

  const curDate = new Date();
  const curDay = curDate.getDay();
  const curHours = curDate.getHours();
  const curMinutes = curDate.getMinutes();

  return data.some((o) => {
    const dayFrom = daysOfWeek.indexOf(o.dow.from);
    const dayTo = daysOfWeek.indexOf(o.dow.to);

    const timeFromIdx = timeSlots30min.indexOf(o.time.from);
    const timeFrom = timeSlots30min[timeFromIdx];
    const timeFromHours = Number(timeFrom.split(":")[0]);
    const timeFromMinutes = Number(timeFrom.split(":")[1]);

    const timeToIdx = timeSlots30min.indexOf(o.time.to);
    const timeTo = timeSlots30min[timeToIdx];
    const timeToHours = Number(timeTo.split(":")[0]);
    const timeToMinutes = Number(timeTo.split(":")[1]);

    const totalCurMinutes = curHours * 60 + curMinutes;
    const totalTimeFromMinutes = timeFromHours * 60 + timeFromMinutes;
    const totalTimeToMinutes = timeToHours * 60 + timeToMinutes;

    return (
      curDay >= dayFrom &&
      curDay <= dayTo &&
      totalCurMinutes >= totalTimeFromMinutes &&
      totalCurMinutes <= totalTimeToMinutes
    );
  });
};

export default useCheckAvailableOpeningHours;
