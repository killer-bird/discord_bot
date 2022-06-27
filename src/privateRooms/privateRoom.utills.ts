import { Guild, CategoryChannel, User, VoiceChannel } from "discord.js"
import { IRoom } from "../interfaces/IRoom"
import { Room } from "../database/models/RoomModel"
import { config } from "./config"


export const createRoom = async(user: User, guild: Guild): Promise<VoiceChannel> => {
    const room = await Room.findOne({owner: user.id}) as IRoom
    const parent = await guild.channels.fetch(process.env.PARENT_CATEGORY as string) as CategoryChannel
    const voice =  await guild.channels.create(room.name, {
        type: 'GUILD_VOICE',
        parent,
        userLimit: room.limit,
    })
    await Room.updateOne({owner: user.id}, {id: voice.id})
    config[voice.id] = false
    return voice
}

export const deleteRoom = async (voice: VoiceChannel) :Promise<void> => {
    try {
        if (!voice.members.size) {
            await Room.updateOne({ id: voice.id }, { id: null })
            delete config[voice.id]
            await voice.delete()
        }     
    } catch (error) {
        console.log(error)
        return
    }
    
}