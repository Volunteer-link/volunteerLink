interface Field{
    id: number,
    name: string,
}

export interface Organization {
    $type: string,
    id: number,
    gmail: string,
    enabled: boolean,
    name: string,
    urlImage: string,
    accountId: number,
    fields: Field[],
    description: string,
    urlFacebook: string,
    isApproval: boolean,
    phoneNumber: string,
    address: string
    star: number,
    numberRated: number,
}