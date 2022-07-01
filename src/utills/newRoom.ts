import { GuildMember } from "discord.js"
import { IRoom } from "../interfaces/IRoom"
import { Room } from "../database/models/RoomModel"



export const newRoom = async (member: GuildMember) => {
    
    const roomObject : IRoom = {
        id: null,
        owner: member.user.id,
        name: member.user.username,
        mutes: [],
        bans: [],
        moderators: [],
        limit: null,
        invisible: false,
        closed: false,
    }

    await new Room(roomObject).save()

}