import { JwtPayload } from "jsonwebtoken"
import { ObjectId } from "mongoose";

export interface IProject {
    projectId: string,
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

export interface ILoginedUser {
    _id: ObjectId
    name: string,
    email: string,
    apiKey: string,
    projectNo: number;
    projects: IProject[];
    createdAt: Date
    updatedAt: Date
}