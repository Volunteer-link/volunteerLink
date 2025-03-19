
interface Field{
    id: number;
    name: string;
}
export interface VolunteerProfilePage{
    $type: string;
    id: number;
    gmail: string;
    enabled: boolean;
    name: string;
    urlImage: string;
    accountId: number;
    fields: Field[];
    dateOfBirth: string;
    sex: number;
    address: string;
    phoneNumber: string;
    skill: string;
    isAvailable: boolean;
}