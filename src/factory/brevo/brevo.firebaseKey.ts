import { db } from "@/firebase";
import { parseSegments } from "@/utils/helper";
import { ref } from "firebase/database";
import { useMemo } from "react";

type TBrevoFirebaseKey = {
  contactId?: string | null;
  listId?: string | null;
};

export const useBrevoFirebaseKey = (initKeys: TBrevoFirebaseKey) => {
  return useMemo(() => {
    return brevoFirebaseKey(initKeys);
  }, [initKeys]);
};

const brevoFirebaseKey = (initKeys: TBrevoFirebaseKey) => {
  const keys = {
    initKeys,
    setParams: function (para: Partial<TBrevoFirebaseKey>) {
      keys.initKeys = { ...keys.initKeys, ...para };
    },

    root: () => "brevo",

    // #region allContacts
    allContacts: function () {
      return parseSegments(...[keys.root(), "allContacts", "data"]);
    },
    allContactsRef: function () {
      return ref(db, keys.allContacts());
    },

    allContactStatistics: function () {
      return parseSegments(...[keys.root(), "allContacts", "statistics"]);
    },
    allContactStatisticsRef: function () {
      return ref(db, keys.allContactStatistics());
    },

    detailedContact: function () {
      if (!keys.initKeys.contactId) throw new Error("missing contactId");
      return parseSegments(...[keys.allContacts(), keys.initKeys.contactId]);
    },
    detailedContactRef: function () {
      return ref(db, keys.detailedContact());
    },

    // #endregion

   
  };
  return { ...keys };
};

export default brevoFirebaseKey;
