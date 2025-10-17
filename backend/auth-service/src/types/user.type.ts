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