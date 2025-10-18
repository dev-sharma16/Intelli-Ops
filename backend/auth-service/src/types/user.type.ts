import { JwtPayload } from "jsonwebtoken"

export interface IProject {
    // projectId: string,
    name: string,
    createdAt: Date
};

export interface IUser {
    name: string,
    email: string,
    password: string,
    apiKey: string,
    projectNo: number;
    projects: IProject[];
};

export interface IDecodedToken extends JwtPayload{
    id: string,
    name: string,
    email: string,
}