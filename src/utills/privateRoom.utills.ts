import { Guild, CategoryChannel, User, VoiceChannel } from "discord.js"
import { IRoomConfig } from "../interfaces/IRoomConfig"
import { IRoom } from "../interfaces/IRoom"
import { privateRoomConfig } from "../config"
import { Room } from "../database/models/RoomModel"



export const createRoom = async(user: User, guild: Guild, roomConfig: IRoomConfig): Promise<VoiceChannel> => {
    const room = await Room.findOne({owner: user.id}) as IRoom
    return await guild.channels.create(room.name, {
        type: 'GUILD_VOICE',
        parent: privateRoomConfig.categoryChannel as CategoryChannel,
        userLimit: room.limit,
    })
}

export const deleteRoom = async (voice: VoiceChannel) :Promise<void> => {
    try {
        if (!voice.members.size) {
            await Room.updateOne({ id: voice.id }, { id: null })
            await voice.delete()
        }     
    } catch (error) {
        console.log(error)
        return
    }
    
}