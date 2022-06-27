import { CommandInteraction, ButtonInteraction } from "discord.js"
import { getErrEmbed } from '../embeds'



export const getNotPermsErr = async (interaction: CommandInteraction | ButtonInteraction) => {
    await interaction.reply({embeds: [getErrEmbed("В этой комнате у вас нет таких полномочий")]})
    setTimeout( async () => {
        await interaction.deleteReply()
    }, 5000);
}