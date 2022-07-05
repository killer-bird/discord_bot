interface IUser {
    timeLeftToReward: number;
    timeLeftToGift: Date | null;
}

export interface IUsers {
    [id:string]: IUser
}