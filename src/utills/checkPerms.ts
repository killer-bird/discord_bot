import { User } from "discord.js"
import { IRoom } from "../interfaces/IRoom"
import { Room } from "../database/models/RoomModel"


export const checkAdmPerms = (user: User, room: IRoom):boolean => {
    if( room.owner === user.id ) 
        return true
    return false
}

export const checkModPerms = (user: User, room: IRoom):boolean => {
    if( room.moderators.includes(user.id) ) 
        return true
    return false
}