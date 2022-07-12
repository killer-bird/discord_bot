interface IVoiceOnline {
    entryTime: Date | null
    timeLeftToReward: number 
}

interface IUser {
    timeLeftToGift: number | null | Date;
    voiceOnline: IVoiceOnline;
}

export interface IUsers {
    [id:string]: IUser
}