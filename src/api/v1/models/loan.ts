export interface Loan {
  id: string;
  applicantName: string;
  amount: number;
  status: "PENDING" | "REVIEW" | "APPROVED" | "REJECTED";
}
