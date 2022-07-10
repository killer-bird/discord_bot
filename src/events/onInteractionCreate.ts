import { CommandInteraction } from "discord.js"
import ExtendedClient from "../Client"
import { IEvent, ICommand, IButton, IModal } from "../interfaces"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import {config} from "../privateRooms"

const onInteractionCreate = async (interaction: CommandInteraction) => {
    const client = interaction.client as ExtendedClient
    
    if (interaction.isCommand()){
        const commandName = interaction.commandName
        if(!commandName) {
            return
        }
        const command = client.commands.get(commandName) as ICommand
        try {
            command.execute(interaction)
        } catch (error) {
            console.log(error)
        }
    }

    
    if(interaction.isButton()){
        const customId = interaction.customId
        const button = client.buttons.get(customId) as IButton
        if(config[interaction.channelId as string].btnDelay) {
            await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
            setTimeout( async () => {
                await interaction.deleteReply()
            }, 3000);
            return
        }
        try {
            console.log("started")
            config[interaction.channelId as string].btnDelay = true
            await button.execute(interaction)
            config[interaction.channelId as string].btnDelay = false
            console.log("ended")
        } catch (error) {
            console.log(error)
            config[interaction.channelId as string].btnDelay = false
            return
        }
    }


    if(interaction.isModalSubmit()){
        const customId = interaction.customId
        const modal = client.modals.get(customId) as IModal
        
        try {
            await modal.execute(interaction)
        } catch (error) {
            console.log(error)
        }
    }
    
}


export default {
    name: 'interactionCreate',
    run: onInteractionCreate
} as IEvent