import { GuildMember, VoiceChannel, VoiceState } from "discord.js"
import { checkAdmPerms } from "./checkPerms"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces"
import { banUser, unBanUser } from "../privateRooms";


export const banHandler = async ( voiceState: VoiceState, ban: boolean) => {
    const room = await Room.findOne({id: voiceState.channelId}) as IRoom;
    const member = voiceState.member as GuildMember

    if(checkAdmPerms( member.user, room)){
        await voiceState.setDeaf(false)
        return
    }
    
    if(ban){
        await banUser(voiceState.channel as VoiceChannel, member)
        
    } else {
        await unBanUser(voiceState.channel as VoiceChannel, member)
    }
}