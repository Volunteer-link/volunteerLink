export interface DetailEventType {
  address: string;
  currentInEvent: number[];
  description: string;
  endTime: Date | string;
  fields: { id: number; name: string }[];
  hasDonate: boolean;
  id: number;
  images: string[];
  location: string;
  name: string;
  numberVolunteer: number;
  orgAccountId: number;
  organizationAvatar: string;
  organizationId: number;
  organizationName: string;
  startTime: Date | string;
  status: number;
  thumbnail: string;
  timePublish: Date | string;
}
