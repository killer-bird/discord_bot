import { DMChannel, GuildChannel } from "discord.js";
import { Room } from "../database/models/RoomModel"
import {IEvent} from "../interfaces"

const onChannelDelete = async (channel: DMChannel | GuildChannel) => {
    try {
        await Room.updateOne({id: channel.id}, {id: null});
        console.log("channel DELETE")
    } catch (error) {
        console.log(error, "CHANNEL DELETE ERROR")
    }
}

export default {
    name: 'channelDelete',
    run: onChannelDelete
} as IEvent