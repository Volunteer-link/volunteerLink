export interface volunteerProps {
  accountId: number;
  id?: number;
  requestId: number;
  name?: string;
  image?: string;
  pictureProfile?: string;
  dob?: Date;
  address?: string;
  volunteerDisplayType: "SUGGESTION" | "PARTICIPATED" | "REQUEST";
}
