export type OrderItem = {
    coffee: string,
    milk: string
}

export type Order = {
    name: string,
    location: string,
    items: Array<OderItem>
};


type Option = {
    title: string,
    logo: string
}

export type Theme = {
    tag: string | 'wxsd',
    logo: string,
    background: string | null,
    themeName: string | null,
    welecomeText: string,
    optionText: string,
    options: Array<Option>
}

export type WebSocketCredentials ={
    username: string;
    password: string;
    ipAddress: string;
}