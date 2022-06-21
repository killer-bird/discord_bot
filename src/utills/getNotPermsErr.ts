import { CommandInteraction } from "discord.js"
import { getErrEmbed } from '../utills/getErrEmbed'



export const getNotPermsErr = async (interaction: CommandInteraction) => {
    await interaction.reply({embeds: [getErrEmbed("В этой комнате у вас нет таких полномочий")]})
    setTimeout( async () => {
        await interaction.deleteReply()
    }, 5000);
}