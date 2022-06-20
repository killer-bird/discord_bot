import { Client, TextChannel } from "discord.js"
import { User } from "../database/models/UserModel"
import { createUser } from "../utills/createUser"
import { newRoom } from "../utills/newRoom"
import { privateRoomConfig } from "../config"
import { createRoomSettingsMsg } from "../utills/createRoomSettingsMsg"
export const onReady = async (client: Client) => {

    privateRoomConfig.categoryChannel = await client.channels.fetch(process.env.PARENT_CATEGORY as string)
    const roomSettingsChannel = await client.channels.fetch(process.env.ROOM_SETTINGS as string) as TextChannel
    if(!Array.from(await roomSettingsChannel.messages.fetch()).length) {
        await createRoomSettingsMsg(roomSettingsChannel)
    }
    

    const guild = client.guilds.cache.get(process.env.GUILD_ID as string)
    const members = await guild?.members.fetch()

    members?.forEach( async member => {        
        if(!member.user.bot && !await User.exists({id: member.user.id})) { 
            await createUser(member)
            await newRoom(member)       
        }
    }) 
    console.log("on ready!")
}