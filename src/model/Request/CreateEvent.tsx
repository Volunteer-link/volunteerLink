export interface createEvent{
    name: string;
    location: string | null;
    address: string;
    startTime: string;
    endTime: string;
    description: string;
    timePublish: Date | null;
    status: 0,
    hasDonate: true,
    imagesEvent: string[],
    thumbnail: string
}