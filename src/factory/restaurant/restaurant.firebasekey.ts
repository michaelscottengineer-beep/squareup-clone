import { db } from "@/firebase";
import { parseSegments } from "@/utils/helper";
import { ref } from "firebase/database";
import { useMemo } from "react";

type TRestaurantFirebaseKey = {
  restaurantId?: string;
  jobKey?: string | null;
  orderId?: string | null;
  permissionKey?: string | null;
  itemId?: string | null;
  categoryId?: string | null;
  optionId?: string | null;
  customerId?: string | null;
  listId?: string | null;
  campaignId?: string | null;
  mailTemplateId?: string | null;
};

export const useRestaurantFirebaseKey = (initKeys: TRestaurantFirebaseKey) => {
  return useMemo(() => {
    return restaurantFirebaseKey(initKeys);
  }, [initKeys]);
};

const restaurantFirebaseKey = (initKeys: TRestaurantFirebaseKey) => {
  const keys = {
    initKeys,
    setParams: function (para: Partial<TRestaurantFirebaseKey>) {
      keys.initKeys = { ...keys.initKeys, ...para };
    },

    root: () => "restaurants",
    details: () => {
      if (!initKeys.restaurantId) throw new Error("missing restaurantId");
      return parseSegments(...[keys.root(), initKeys.restaurantId]);
    },

    // #region allJobs
    jobs: () => parseSegments(...[keys.details(), "allJobs"]),
    job: () => {
      if (!initKeys.jobKey) throw new Error("missing jobKey");
      return parseSegments(...[keys.jobs(), initKeys.jobKey]);
    },
    jobRef: () => ref(db, keys.job()),
    jobBasicInfo: () => {
      return parseSegments(...[keys.job(), "basicInfo"]);
    },
    jobBasicInfoRef: () => {
      return ref(db, keys.jobBasicInfo());
    },

    // #endregion

    // #region allPermission
    permissions: () => parseSegments(...[keys.details(), "allPermissions"]),
    permissionsRef: () => ref(db, keys.permissions()),
    permission: () => {
      if (!initKeys.permissionKey) throw new Error("missing permissionKey");
      return parseSegments(...[keys.permissions(), initKeys.permissionKey]);
    },
    permissionRef: () => ref(db, keys.permission()),
    permissionBasicInfo: () => {
      return parseSegments(...[keys.permission(), "basicInfo"]);
    },
    permissionBasicInfoRef: () => {
      return ref(db, keys.permissionBasicInfo());
    },
    // #endregion

    // #region orders
    orders: () => parseSegments(...[keys.details(), "allOrders"]),
    ordersRef: () => ref(db, keys.orders()),
    order: () => {
      if (!initKeys.orderId) throw new Error("missing orderId");
      return parseSegments(...[keys.orders(), initKeys.orderId]);
    },
    orderRef: () => ref(db, keys.order()),
    orderBasicInfo: () => {
      return parseSegments(...[keys.order(), "basicInfo"]);
    },
    orderBasicInfoRef: () => {
      return ref(db, keys.orderBasicInfo());
    },
    // #endregion

    // #region allCustomers
    allCustomers: () => parseSegments(...[keys.details(), "allCustomers"]),
    allCustomerRef: () => ref(db, keys.allCustomers()),
    detailedCustomer: () => {
      if (!keys.initKeys.customerId) throw new Error("missing customerId");
      return parseSegments(...[keys.allCustomers(), keys.initKeys.customerId]);
    },
    detailedCustomerRef: () => ref(db, keys.detailedCustomer()),
    customerBasicInfo: () => {
      return parseSegments(...[keys.order(), "basicInfo"]);
    },
    customerBasicInfoRef: () => {
      return ref(db, keys.customerBasicInfo());
    },
    // #endregion
    // #region allItems
    allItems: function () {
      return parseSegments(...[keys.details(), "allItems"]);
    },
    allItemsRef: function () {
      return ref(db, keys.allItems());
    },
    detailedItem: function () {
      if (!keys.initKeys.itemId) throw new Error("missing itemId");
      return parseSegments(...[keys.allItems(), keys.initKeys.itemId]);
    },
    detailedItemRef: function () {
      return ref(db, keys.detailedItem());
    },
    itemBasicInfo: function () {
      return parseSegments(...[keys.detailedItem(), "basicInfo"]);
    },
    itemBasicInfoRef: function () {
      return ref(db, keys.itemBasicInfo());
    },

    // #endregion

    // #region allGroups
    allGroups: function () {
      return parseSegments(...[keys.details(), "allGroups"]);
    },
    allGroupsRef: function () {
      return ref(db, keys.allGroups());
    },
    detailedCategory: function () {
      if (!keys.initKeys.categoryId) throw new Error("missing categoryId");
      return parseSegments(...[keys.allGroups(), keys.initKeys.categoryId]);
    },
    detailedCategoryRef: function () {
      return ref(db, keys.detailedCategory());
    },
    categoryBasicInfo: function () {
      return parseSegments(...[keys.detailedCategory(), "basicInfo"]);
    },
    categoryBasicInfoRef: function () {
      return ref(db, keys.categoryBasicInfo());
    },

    // #endregion

    // #region allOptions
    allOptions: function () {
      return parseSegments(...[keys.details(), "allOptions"]);
    },
    allOptionsRef: function () {
      return ref(db, keys.allOptions());
    },
    detailedOption: function () {
      if (!keys.initKeys.optionId) throw new Error("missing optionId");
      return parseSegments(...[keys.allOptions(), keys.initKeys.optionId]);
    },
    detailedOptionRef: function () {
      return ref(db, keys.detailedOption());
    },
    optionBasicInfo: function () {
      return parseSegments(...[keys.detailedOption(), "basicInfo"]);
    },
    optionBasicInfoRef: function () {
      return ref(db, keys.optionBasicInfo());
    },

    // #endregion

    // #region allLists
    allLists: function () {
      return parseSegments(...[keys.details(), "allLists", "data"]);
    },
    allListsRef: function () {
      return ref(db, keys.allLists());
    },

    allListStatistics: function () {
      return parseSegments(...[keys.details(), "allLists", "statistics"]);
    },
    allListStatisticsRef: function () {
      return ref(db, keys.allListStatistics());
    },

    detailedList: function () {
      if (!keys.initKeys.listId) throw new Error("missing listId");
      return parseSegments(...[keys.allLists(), keys.initKeys.listId]);
    },
    detailedListRef: function () {
      return ref(db, keys.detailedList());
    },

    detailedListBasicInfo: function () {
      return parseSegments(...[keys.detailedList(), "basicInfo"]);
    },
    detailedListBasicInfoRef: function () {
      return ref(db, keys.detailedListBasicInfo());
    },
    contactsOfList: function () {
      return parseSegments(...[keys.detailedList(), "contacts"]);
    },
    contactsOfListRef: function () {
      return ref(db, keys.contactsOfList());
    },
    // #endregion

    // #region campaign

    allCampaigns: function () {
      return parseSegments(...[keys.details(), "allCampaigns", "data"]);
    },
    allCampaignsRef: function () {
      return ref(db, keys.allCampaigns());
    },
    detailedCampaign: function () {
      if (!keys.initKeys.campaignId) throw new Error("missing campaignId");
      return parseSegments(...[keys.allCampaigns(), keys.initKeys.campaignId]);
    },
    detailedCampaignRef: () => ref(db, keys.detailedCampaign()),
    // #endregion

    // #region MailTemplates

    allMailTemplates: function () {
      return parseSegments(...[keys.details(), "allMailTemplates", "data"]);
    },
    allMailTemplatesRef: function () {
      return ref(db, keys.allMailTemplates());
    },
    detailedMailTemplate: function () {
      if (!keys.initKeys.mailTemplateId)
        throw new Error("missing mailTemplateId");
      return parseSegments(
        ...[keys.allMailTemplates(), keys.initKeys.mailTemplateId]
      );
    },
    detailedMailTemplateRef: () => ref(db, keys.detailedMailTemplate()),

    // #endregion
  };
  return { ...keys };
};

export default restaurantFirebaseKey;
