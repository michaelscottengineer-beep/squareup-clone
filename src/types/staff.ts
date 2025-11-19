export const memberJob = ["server", "chef", "cashier", "cleaner"] as const;

export type TMember = {
  id: string;
  basicInfo: {
    fullName: string;
    gender: "F" | "M" | "O";
    phone: string;
    role: string;
    job: string;
    dob: string;
    address: string;
    startedAt: string;
    createdAt: string;
    email: string;
    userUID: string;
    status: "pending" | "accepted"
  };
};


export type TInviting = {
  id: string;
  email: string;
  staffId: string;
  restaurantId: string;
}