import {SlashCommandBuilder} from "@discordjs/builders"
import { CommandInteraction } from "discord.js"
import { ICommand } from "../interfaces/"
import { incOrDecrCurrency } from "../utills/incOrDecrCurrency"
import { getNotifyEmbed, getErrEmbed } from "../embeds"
import { users } from "../users"

const data = new SlashCommandBuilder()
    .setName("gift")
    .setDescription("gift")


const execute = async (interaction: CommandInteraction) => {
    const date = new Date()
    const lastGiftDate = users[interaction.user.id]?.timeLeftToGift as Date

    if(+date - +lastGiftDate  >= 24 * 60 * 60 * 1000) {
        users[interaction.user.id].timeLeftToGift = new Date()
        await incOrDecrCurrency(interaction.user, 100)
        await interaction.deferReply()
        await interaction.editReply({embeds: [getNotifyEmbed(`${interaction.member}, вы получили 100 слёзок 💧`)]})
        setTimeout(() => {
            interaction.deleteReply()
        }, 3000);
        return
    }
    await interaction.reply({embeds: [getErrEmbed(`${interaction.member}, пока вы не можете получить слёзки!`)]})
    setTimeout(() => {
        interaction.deleteReply()
    }, 3000);
}


export default {
    data,
    execute
} as ICommand