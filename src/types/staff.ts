export const memberJob = ["server", "chef", "cashier", "cleaner"] as const;

export type TMember = {
  basicInfo: {
    fullName: string;
    gender: "F" | "M" | "O";
    phone: string;
    role: string;
    job: (typeof memberJob)[number];
    dob: string;
    address: string;
    startedAt: string;
    createdAt: string;
    email: string;
  };
};
