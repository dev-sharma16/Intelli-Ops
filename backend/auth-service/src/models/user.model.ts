import mongoose, { Schema, Document } from 'mongoose';
import { IUser, IProject } from '../types/user.type';

export interface IUserModel extends IUser, Document {};

const projectSchema = new Schema<IProject>(
    {
        projectId: { type: String, required: true },
        name: { type: String, required: true },
        createdAt: { type: Date, required: true },
    }
);

const userSchema = new Schema<IUserModel>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        apiKey : {type: String, required: true},
        projectNo: {
            type: Number,
            default: 0,
            min: 0,
            max: 2
        },
        projects: {
            type: [ projectSchema ],
            default: [],
        },
    },
    { timestamps: true } 
);

export const User = mongoose.model<IUserModel>('User', userSchema);