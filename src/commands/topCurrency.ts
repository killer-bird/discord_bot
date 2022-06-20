import {SlashCommandBuilder} from "@discordjs/builders"
import { CommandInteraction, User, MessageEmbed, Client } from "discord.js"
import { User as UserModel } from "../database/models/UserModel"
import { client  } from "../bot"

export const data = new SlashCommandBuilder()
    .setName("top")
    .setDescription("usertop")


export async function execute(interaction: CommandInteraction) {
    const topEmbed = new MessageEmbed()
    topEmbed.setTitle("Топ пользователей")
    const top = await UserModel.find({}).sort({
        currency: -1
    }).limit(10)
    top.map(async(topMember, index)=>{
        const user = await client.users.fetch(topMember.id)
        topEmbed.addField(`${index + 1} ${user.username}`, `${topMember.currency}`)
    })
    await interaction.deferReply()
    return await interaction.editReply({embeds: [ topEmbed ]})
}