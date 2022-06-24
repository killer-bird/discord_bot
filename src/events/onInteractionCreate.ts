import { execute } from './../modals/renameModal';
import { Client, TextChannel, CommandInteraction } from "discord.js"
import ExtendedClient from "../Client"
import { IEvent, ICommand } from "../interfaces"
import { User } from "../database/models/UserModel"
import { createUser } from "../utills/createUser"
import { newRoom } from "../utills/newRoom"
import { createRoomSettingsMsg } from "../utills/createRoomSettingsMsg"


const onInteractionCreate = async (interaction: CommandInteraction) => {
    if (interaction.isCommand()){
        
        const client = interaction.client as ExtendedClient
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
        console.log(interaction.customId)
    }
    
}

export default {
    name: 'interactionCreate',
    run: onInteractionCreate
} as IEvent