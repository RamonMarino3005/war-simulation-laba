export type Army = {
  id: string;
  name: string;
  resources: number;
  owner_id: string;
};
export type ArmyFields = Omit<Army, "id" | "owner_id">;
export type PublicArmy = Omit<Army, "owner_id">;
