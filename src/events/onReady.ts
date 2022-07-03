import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import ExtendedClient from "../Client"
import { IEvent } from "../interfaces/IEvents"
import { User } from "../database/models/UserModel"
import { Room } from "../database/models/RoomModel"
import { createUser, newRoom, createRoomSettingsMsg } from "../utills/"


const onReady = async (client: ExtendedClient) => {
    
    const guild = client.guilds.cache.get(process.env.GUILD_ID as string)
    const members = await guild?.members.fetch()
    const rest = new REST({ version: "9" }).setToken(
        process.env.DISCORD_TOKEN  as string
    )
    const commandData = client.commands.map((command) => command.data.toJSON())
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID  as string,), {body: commandData})

    
    members?.forEach( async member => {        
        if(!member.user.bot && !await User.exists({id: member.user.id})) { 
            await createUser(member)    
        }
        if(!member.user.bot && !await Room.exists({owner: member.user.id})) {
            await newRoom(member)   
        }
    }) 
    console.log("on ready!")
}

export default {
    name: "ready",
    run: onReady,
} as IEvent