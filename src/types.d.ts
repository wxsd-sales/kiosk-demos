export type OrderItem = {
    coffee: string,
    milk: string
}

export type Order = {
    name: string,
    location: string,
    items: Array<OderItem>
};