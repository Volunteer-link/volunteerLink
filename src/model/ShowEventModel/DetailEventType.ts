export interface DetailEventType {
  address: string;
  currentInEvent: number[];
  description: string;
  endTime: Date | string;
  fields: string[];
  hasDonate: boolean;
  id: number;
  images: string[];
  location: string;
  name: string;
  numberVolunteer: number;
  orgAccountId: number;
  organizationId: number;
  organizationName: string;
  organizationAvatar: string;
  startTime: Date | string;
  status: number;
  thumbnail: string;
  timePublish: Date | string;
}
