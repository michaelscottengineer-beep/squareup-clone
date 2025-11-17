import { db } from "@/firebase";
import { parseSegments } from "@/utils/helper";
import { ref } from "firebase/database";

type TRestaurantFirebaseKey = {
  restaurantId?: string;
  jobKey?: string | null;
};

const restaurantFirebaseKey = ({
  restaurantId,
  jobKey,
}: TRestaurantFirebaseKey) => {
  const keys = {
    root: () => "restaurants",
    details: () => {
      if (!restaurantId) throw new Error("missing restaurantId");
      return parseSegments(...[keys.root(), restaurantId]);
    },

    jobs: () => parseSegments(...[keys.details(), "allJobs"]),
    job: () => {
      if (!jobKey) throw new Error("missing jobKey");
      return parseSegments(...[keys.jobs(), jobKey]);
    },
    jobRef: () => ref(db, keys.job()),
    jobBasicInfo: () => {
      return parseSegments(...[keys.job(), "basicInfo"]);
    },
    jobBasicInfoRef: () => {
      return ref(db, keys.jobBasicInfo());
    },
  };
  return { ...keys };
};

export default restaurantFirebaseKey;
