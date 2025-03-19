export interface volunteerProps {
  accId: number;
  requestId: number;
  name?: string;
  image?: string;
  pictureProfile?: string;
  dob?: Date;
  address?: string;
  volunteerDisplayType: "SUGGESTION" | "PARTICIPATED" | "REQUEST";
}
