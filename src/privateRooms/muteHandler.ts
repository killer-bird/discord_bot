import { GuildMember, VoiceChannel, VoiceState } from "discord.js"
import { checkAdmPerms } from "./checkPerms"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces"
import { muteUser, unMuteUser } from "./privateRoom.utills";

export const muteHandler = async (voiceState: VoiceState, mute: boolean) => {
    const room = await Room.findOne({id: voiceState.channelId}) as IRoom;
    const member = voiceState.member as GuildMember
    if(checkAdmPerms( member.user, room)){
        await voiceState.setMute(false)
        return
    }
    if(mute){
        await muteUser(voiceState.channel as VoiceChannel, member)
        console.log("mute")
        return
    } 
    console.log("unmute")
    await unMuteUser(voiceState.channel as VoiceChannel, member)
    
}