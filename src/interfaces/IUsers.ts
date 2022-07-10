interface IUser {
    timeLeftToReward: number | null | Date;
    voiceOnline: Date | null;
}

export interface IUsers {
    [id:string]: IUser
}