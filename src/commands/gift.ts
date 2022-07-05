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
    if(!users[interaction.user.id]?.timeLeftToGift) {
        await incOrDecrCurrency(interaction.user, 100)
        let delay = 15
        const date = new Date()
        users[interaction.user.id as string].timeLeftToGift = date.setSeconds(delay)
        const interval = setInterval(() => {
            delay--
        }, 1000)
        setTimeout(() => {
            users[interaction.user.id as string].timeLeftToGift = null
            clearInterval(interval)
        }, delay * 1000)

        await interaction.deferReply()
        await interaction.editReply({embeds: [getNotifyEmbed(`${interaction.member}, вы получили 100 слёзок 💧`)]})
        setTimeout(() => {
            interaction.deleteReply()
        }, 3000);
        return
    }
    await interaction.reply({embeds: [getErrEmbed(`${interaction.member}, пока вы не можете получить слёзки! Осталось 2 часа`)]})
    setTimeout(() => {
        interaction.deleteReply()
    }, 3000);
}


export default {
    data,
    execute
} as ICommand