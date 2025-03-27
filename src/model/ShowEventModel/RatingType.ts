export interface RatingType {
  accountId: number;
  eventId: number;
  feedback: string;
  id: number;
  pictureImage: string;
  star: number;
  volunteerId: number;
  volunteerName: string;
  time: Date | string;
}
