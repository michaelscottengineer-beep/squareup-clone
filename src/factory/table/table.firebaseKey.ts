import { db } from "@/firebase";
import { parseSegments } from "@/utils/helper";
import { ref } from "firebase/database";

type TTableFirebaseKey = {
  restaurantId?: string;
  tableId?: string | null;
};

const tableFirebaseKey = (initKeys: TTableFirebaseKey) => {
  const keys = {
    initKeys,
    addParams: function (para: Partial<TTableFirebaseKey>) {
      keys.initKeys = { ...keys.initKeys, ...para };
    },
    root: () =>
      parseSegments("restaurants", keys.initKeys.restaurantId, "allTables"),
    rootRef: () => ref(db, keys.root()),
    details: function () {
      if (!keys.initKeys.tableId) throw new Error("missing tableId");
      return parseSegments(...[keys.root(), keys.initKeys.tableId]);
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

export default tableFirebaseKey;
