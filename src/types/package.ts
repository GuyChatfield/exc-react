// UserPackage type
export type UserPackage = {
  id: string;
  name: string;
  description: string;
  productQuantities?: Record<string, number>;
  ownerUsername: string;
};
