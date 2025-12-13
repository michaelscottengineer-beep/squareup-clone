export type TSystemMailTemplate = {
  id: string;
  basicInfo: {
    name: string;
    createdAt: string;
    createdByUserId: string;
    previewImageUrl: string;
  };
  authorInfo: {
    role?: string;
    createdByUserId: string;
  },
  data: {
    html: string;
    tree: Array<any>;
  };
};
