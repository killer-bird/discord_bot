import { GuildMember, VoiceChannel, VoiceState } from "discord.js"
import { checkAdmPerms } from "./checkPerms"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces"
import { muteUser } from "./privateRoom.utills";

export const muteHandler = async (voiceState: VoiceState) => {
    const room = await Room.findOne({id: voiceState.channelId}) as IRoom;
    const member = voiceState.member as GuildMember
    if(checkAdmPerms( member.user, room)){
        await voiceState.setMute(false)
        return
    }
    await muteUser(voiceState.channel as VoiceChannel, member)
}