import { db } from "@/firebase";
import { parseSegments } from "@/utils/helper";
import { ref } from "firebase/database";

type TRestaurantFirebaseKey = {
  restaurantId?: string;
  jobKey?: string | null;
  permissionKey?: string | null;
};

const restaurantFirebaseKey = ({
  restaurantId,
  jobKey,
  permissionKey,
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

    permissions: () => parseSegments(...[keys.details(), "allPermissions"]),
    permissionsRef: () => ref(db, keys.permissions()),
    permission: () => {
      if (!permissionKey) throw new Error("missing permissionKey");
      return parseSegments(...[keys.permissions(), permissionKey]);
    },
    permissionRef: () => ref(db, keys.permission()),
    permissionBasicInfo: () => {
      return parseSegments(...[keys.permission(), "basicInfo"]);
    },
    permissionBasicInfoRef: () => {
      return ref(db, keys.permissionBasicInfo());
    },
  };
  return { ...keys };
};

export default restaurantFirebaseKey;
