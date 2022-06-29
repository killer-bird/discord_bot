import { DMChannel, GuildChannel, VoiceChannel } from "discord.js";
import { Room } from "../database/models/RoomModel"
import {IEvent} from "../interfaces"


const onChannelUpdate = async (oldChannel: VoiceChannel, newChannel: VoiceChannel ) => {
    if(oldChannel.userLimit !== newChannel.userLimit){
        await Room.updateOne({id: oldChannel.id}, {limit: newChannel.userLimit})
    }
    if(oldChannel.name !== newChannel.name){
        console.log("NAME CHANGED")
        await Room.updateOne({id: oldChannel.id}, {name: newChannel.name})
    }
}


export default {
    name: 'channelUpdate',
    run: onChannelUpdate
} as IEvent