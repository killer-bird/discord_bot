interface IUser {
    timeLeftToReward: number | null;
    timeLeftToGift: Date | null;
}

export interface IUsers {
    [id:string]: IUser
}