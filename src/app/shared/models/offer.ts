export interface Offer {
    id: string,
    title: string,
    description: string,
    author: string,
    associationId: string,
    associationName: string,
    active: boolean,
    date: number,
    image?: string,
    zone?: string
}
