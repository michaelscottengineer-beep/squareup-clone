import type { Value } from "platejs";
import type { TRestaurantCustomer } from "./restaurant";

export type TContact = {
  basicInfo: {
    firstName: string;
    lastName: string;
    email: string;
    sms: string;
    jobTitle: string;
    linkedin: string;
  };
  id: string;
};

export type TContactList = {
  id: string;
  basicInfo: {
    name: string;
    topicArn: string;
    createdAt: string;
  };
  contacts?: { [key: string]: TRestaurantCustomer["basicInfo"] };
  stats: {
    totalContact: number;
  };
};

export type TEmailSubject = {
  mainText: string;
  previewText: string;
};

export type TCampaignEmailConfig = {
  recipients: TContactList[];
  subject: TEmailSubject;
  html: string;
  value: Value
};

export type TCampaign = {
  id: string;
  basicInfo: {
    name: string;
    type: "sms" | "email";
    createdAt: string;
    updatedAt: string;
  };
  config?: {
    message: {
      text: string;
    };
    mms: {
      src: string;
    };
    schedule: {
      date: string;
    };
  };
  emailConfiguration?: TCampaignEmailConfig;
  recipients: TContactList[];
  stats: {
    totalRecipient: number;
  };
};

export type TMailTemplate = {
  id: string;
  basicInfo: {
    name: string;
    createdAt: string;
    updatedAt: string;
    status: "active" | "inactive";
  };
  config: {
    value: string;
    subject: string;
    html: string;
  };
};
