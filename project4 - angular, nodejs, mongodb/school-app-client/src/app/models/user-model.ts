export interface UserModel {
    _id?: string;
    name: string;
    password?: string;
    token?: string;
    role?:string;
    image?:string;
}
