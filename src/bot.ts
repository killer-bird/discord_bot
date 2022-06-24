import { Client, GuildMember, PartialGuildMember, VoiceState,  VoiceChannelResolvable, TextChannelResolvable, CategoryChannelResolvable } from "discord.js";
import ExtendedClient from "./Client";
import dotenv from "dotenv";


dotenv.config()



// client.on("interactionCreate", async (interaction) => {
//     if(interaction.isCommand()) {
//         const { commandName } = interaction
//         try {
//             commands[commandName].execute(interaction, client)       
//         } catch (error) {
//             return
//         }
//     }
//     if(interaction.isButton()) {
//         const { customId } = interaction 

//         try {
//             buttons[customId].execute(interaction)
//         } catch (error) {
//             console.log(error)
//             return
//         }
        
//     }
//     if(interaction.isModalSubmit()){
//         const { customId } = interaction 
//         const value = interaction.fields.getTextInputValue(customId + 'Input')
//         console.log(customId, value)
//     }
        
// })
// connectDatabase()   
// client.login(process.env.DISCORD_TOKEN)

export const client = new ExtendedClient(
    process.env.DISCORD_TOKEN as string,
    process.env.MONGO_URI as string
)

client.init()