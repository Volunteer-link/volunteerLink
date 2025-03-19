export interface volunteerProps {
  accId: number;
  requestId: number;
  name?: string;
  image?: string;
  dob?: Date;
  address?: string;
  volunteerDisplayType: "SUGGESTION" | "PARTICIPATED" | "REQUEST";
}
