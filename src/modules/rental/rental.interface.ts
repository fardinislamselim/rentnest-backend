export interface ICreateRentalRequest {
  propertyId: string;
  startDate: string;
  endDate?: string;
}

export interface IUpdateRentalStatus {
  status: "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
}
