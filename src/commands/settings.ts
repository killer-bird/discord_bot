import {SlashCommandBuilder} from "@discordjs/builders"
import { CommandInteraction } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { ICommand } from "../interfaces/ICommand"
import { getRoomSettingsEmbed } from "../utills/createRoomSettingsMsg"
import { btnRowLow, btnRowHigh, btnRowMiddle } from "../components"
const data = new SlashCommandBuilder()
    .setName("settings")
    .setDescription("get Settings")


async function execute(interaction: CommandInteraction) {
    await interaction.deferReply()
    const room = await Room.findOne({id: interaction.channelId})
    if(room && room.id === interaction.channelId) {
        return await interaction.editReply({
            embeds: [getRoomSettingsEmbed()],
            components: [btnRowHigh, btnRowMiddle, btnRowLow]
        })
    }

}


export default {
    data,
    execute
} as ICommand