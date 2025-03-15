export interface createEvent{
    name: string;
    location: string | null;
    address: string;
    startTime: string;
    endTime: string;
    description: string;
    timePublish: string | null;
    status: number,
    hasDonate: true,
    imagesEvent: string[],
    thumbnail: string,
    fieldsEvent: number[]
}