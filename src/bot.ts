import { Client, GuildMember, PartialGuildMember, VoiceState,  VoiceChannelResolvable, TextChannelResolvable, CategoryChannelResolvable } from "discord.js";

import { connectDatabase } from "./database/connectDatabase"
import * as commandModules from "./commands"
import * as buttonsModules from "./buttons";
import * as events from "./events"
import dotenv from "dotenv";


dotenv.config()
const commands = Object(commandModules)
const buttons = Object(buttonsModules)

export const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_VOICE_STATES"]
})

client.on("ready", async () => await events.onReady(client))
client.on("guildMemberAdd", async (member: GuildMember) => await events.guildMemberAdd(member))
client.on("guildMemberUpdate", async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => await events.guildMemberUpdate(oldMember, newMember))
client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => await events.onVoiceStateUpdate(oldState, newState))





client.on("interactionCreate", async (interaction) => {
    if(interaction.isCommand()) {
        const { commandName } = interaction
        try {
            commands[commandName].execute(interaction, client)       
        } catch (error) {
            return
        }
    }
    if(interaction.isButton()) {
        
        const { customId } = interaction
        try {
            buttons[customId].execute(interaction)
        } catch (error) {
            console.log(error)
            return
        }
        
    }
        
})
connectDatabase()   
client.login(process.env.DISCORD_TOKEN)