export interface createEvent{
    name: string;
    eventId? :number;
    location: string | null;
    address: string;
    startTime: string;
    endTime: string;
    description: string;
    timePublish: string | null;
    hasDonate: boolean,
    imagesEvent: string[],
    thumbnail: string,
    fieldsEvent: number[]
}