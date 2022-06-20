import {SlashCommandBuilder} from "@discordjs/builders"
import { CommandInteraction, User } from "discord.js"
import { User as UserModel } from "../database/models/UserModel"
import { getNotificationEmbed } from '../utills/getNotificationEmbed'


const setCurrency = async (target: User, count: number) : Promise<void> => {
    await UserModel.updateOne({id: target.id}, {currency: count})
}

export const data = new SlashCommandBuilder()
    .setName("set")
    .setDescription("setCurrency")
    .addIntegerOption(option=> (
        option.setName("count")
        .setDescription("Сколько валюты установить?")
        .setRequired(true)
    ))
    .addUserOption(option => {
        return option.setName("user")
            .setDescription("Кому установить количество валюты")
    })
    

export async function execute(interaction: CommandInteraction) {
    const author = interaction.member?.user as User
    const count  =   interaction.options.getInteger("count") as number
    const user = interaction.options.getUser("user")
    
    if (user) {
        setCurrency(user, count)
        .then( async () => {
           await ( await user.createDM() ).send({embeds: [getNotificationEmbed(`${author} установил вам  баланс мужских слёзок: ${count}`)]})
        })
    } else {
        setCurrency(author , count)
    }
    
    return await interaction.reply({content: `Установил ${count} ${user ? user : ''}`, ephemeral: true})
}