export interface volunteerProps {
  accountId?: number;
  id?: number;
  volunteerId?: number;
  requestId?: number;
  name?: string;
  image?: string;
  pictureProfile?: string;
  dob?: Date;
  address?: string;
  volunteerDisplayType: "SUGGESTION" | "PARTICIPATED" | "REQUEST";
  feedback?: {
    eventId: number;
    feedback: string;
    id: number;
    star: number;
    volunteerId: number;
  };
}
