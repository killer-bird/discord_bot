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
        const date = new Date()
        date.setDate(date.getDate() + 1)
        users[interaction.user.id].timeLeftToGift = date 
        
        await incOrDecrCurrency(interaction.user, 100)
        setTimeout(() => {
            users[interaction.user.id].timeLeftToGift = null
        }, 86400000);
        // users[interaction.user.id as string].timeLeftToGift = new Date(date.setDate(date.getDate()+1))
        // console.log(users[interaction.user.id as string].timeLeftToGift)
        // const interval = setInterval(() => {
        //     delay--
        // }, 1000)
        // setTimeout(() => {
        //     users[interaction.user.id as string].timeLeftToGift = null
        //     clearInterval(interval)
        // }, delay * 1000)
    
        await interaction.deferReply()
        await interaction.editReply({embeds: [getNotifyEmbed(`${interaction.member}, вы получили 100 слёзок 💧`)]})
        setTimeout(() => {
            interaction.deleteReply()
        }, 3000);
        return
    }
    const date = new Date()
    const difference = 24 - (date.getHours() - users[interaction.user.id]?.timeLeftToGift!.getHours())
    await interaction.reply({embeds: [getErrEmbed(`${interaction.member}, пока вы не можете получить слёзки! Осталось ${difference} часа`)]})
    setTimeout(() => {
        interaction.deleteReply()
    }, 3000);
}



export default {
    data,
    execute
} as ICommand