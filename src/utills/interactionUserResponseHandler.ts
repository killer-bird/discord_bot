import { CommandInteraction, Collection, Message } from "discord.js"
import { getNotHaveTimeEmbed } from "./getNotHaveTimeEmbed"



export const userResponseHandler = async (func: Function, interaction: CommandInteraction, response: Collection<string, Message<boolean>> | undefined, ...args: any[]): Promise<void>=> {
    
    const awaitMsgTimeout = setTimeout(async() => {
        await interaction.editReply({embeds:[getNotHaveTimeEmbed()]})
        setTimeout(async() => {
            await interaction.deleteReply() 
        }, 3000);
    }, 15000);
    
    
    try {
        if (response) {
            await func(...args)
            clearTimeout(awaitMsgTimeout)
            await interaction.deleteReply()
        }
    } catch (error) {
        console.log(error)
        return
    }
}