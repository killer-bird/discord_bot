import { execute } from './../modals/renameModal';
import { Client, TextChannel, CommandInteraction } from "discord.js"
import ExtendedClient from "../Client"
import { IEvent, ICommand, IButton } from "../interfaces"
import { User } from "../database/models/UserModel"
import { createUser } from "../utills/createUser"
import { newRoom } from "../utills/newRoom"
import { createRoomSettingsMsg } from "../utills/createRoomSettingsMsg"


const onInteractionCreate = async (interaction: CommandInteraction) => {
    const client = interaction.client as ExtendedClient
    
    if (interaction.isCommand()){
        
        const commandName = interaction.commandName
        if(!commandName) {
            return
        }
        const command = client.commands.get(commandName) as ICommand
        try {
            await command.execute(interaction)
        } catch (error) {
            console.log(error)
        }
    }
    if(interaction.isButton()){
        const customId = interaction.customId

        const button = client.buttons.get(customId) as IButton
        console.log(button)
        try {
            await button.execute(interaction)
        } catch (error) {
            console.log(error)
        }
    }
    
}

export default {
    name: 'interactionCreate',
    run: onInteractionCreate
} as IEvent