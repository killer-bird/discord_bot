interface IRoom {
    btnDelay: boolean,
    lifeTimer: NodeJS.Timer | null

}
export interface IRoomsConfig{
    [id:string]: IRoom
}