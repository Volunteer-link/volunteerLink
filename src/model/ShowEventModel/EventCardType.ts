export interface EventCardType {
  address: string;
  description: string;
  endTime: Date | string;
  hasDonate: boolean;
  id: number;
  location: string;
  name: string;
  numberVolunteer: number;
  organizationId: number;
  organizationName: string;
  startTime: Date | string;
  status: number;
  thumbnail: string;
  timePublish: Date | string;
}
