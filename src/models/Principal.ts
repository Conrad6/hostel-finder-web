export interface IPrincipal {
    username: string;
    email: string;
    id: string;
    avatar: string;
    roles: string[];
    displayName: string;
    expiration: number;
}
