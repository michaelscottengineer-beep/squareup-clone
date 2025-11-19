import { db } from "@/firebase";
import { parseSegments } from "@/utils/helper";
import { ref } from "firebase/database";

type TOrderFirebaseKey = {
  restaurantId?: string;
  orderId?: string | null;
};

const orderFirebaseKey = (initKeys: TOrderFirebaseKey) => {
  const keys = {
    initKeys,
    addParams: function (para: Partial<TOrderFirebaseKey>) {
      keys.initKeys = { ...keys.initKeys, ...para };
      console.log("my keys", keys.initKeys);
    },
    root: () =>
      parseSegments("restaurants", keys.initKeys.restaurantId, "allOrders"),
    rootRef: () => ref(db, keys.root()),
    details: function () {
      console.log(this, keys);
      if (!keys.initKeys.orderId) throw new Error("missing orderId");
      return parseSegments(...[keys.root(), keys.initKeys.orderId]);
    },
    detailsRef: function () {
      return ref(db, keys.details());
    },
    basicInfo: function () {
      return parseSegments(...[keys.details(), "basicInfo"]);
    },
    basicInfoRef: function () {
      return ref(db, keys.basicInfo());
    },
  };
  return { ...keys };
};

export default orderFirebaseKey;
