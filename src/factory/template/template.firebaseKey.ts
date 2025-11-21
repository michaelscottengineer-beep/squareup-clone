import { db } from "@/firebase";
import { parseSegments } from "@/utils/helper";
import { ref } from "firebase/database";

type TTemplateFirebaseKey = {
  restaurantId?: string;
  templateId?: string | null;
};

const templateFirebaseKey = (initKeys: TTemplateFirebaseKey) => {
  const keys = {
    initKeys,
    addParams: function (para: Partial<TTemplateFirebaseKey>) {
      keys.initKeys = { ...keys.initKeys, ...para };
      console.log("my keys", keys.initKeys);
    },
    adminRoot: () => "website-templates",
    adminRootRef: () => ref(db, keys.adminRoot()),

    restaurantRoot: () =>
      parseSegments("restaurants", keys.initKeys.restaurantId, "allWebsites"),
    restaurantRootRef: () => ref(db, keys.restaurantRoot()),


    adminDetails: function () {
      console.log(this, keys);
      if (!keys.initKeys.templateId) throw new Error("missing templateId");
      return parseSegments(...[keys.adminRoot(), keys.initKeys.templateId]);
    },
    adminDetailsRef: function () {
      return ref(db, keys.adminDetails());
    },

    adminBasicInfo: function () {
      return parseSegments(...[keys.adminDetails(), "basicInfo"]);
    },
    adminBasicInfoRef: function () {
      return ref(db, keys.adminBasicInfo());
    },
  };
  return { ...keys };
};

export default templateFirebaseKey;
