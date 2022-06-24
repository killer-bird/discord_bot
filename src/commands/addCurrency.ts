import {SlashCommandBuilder} from "@discordjs/builders"
import { CommandInteraction, User } from "discord.js"
import { incOrDecrCurrency } from "../utills/incOrDecrCurrency"
import { ICommand } from "../interfaces/ICommand"

const data = new SlashCommandBuilder()
    .setName("add")
    .setDescription("addCurrency")
    .addIntegerOption(option=> (
        option.setName("count")
        .setDescription("Сколько валюты дать?")
        .setRequired(true)
    ))
    .addUserOption(option => {
        return option.setName("user")
            .setDescription("Кому дать валюту?")
    })
    

async function execute(interaction: CommandInteraction) {
    const author = interaction.member?.user as User
    const count =  interaction.options.getInteger("count") as number
    const user = interaction.options.getUser("user")

    if (user) {
        await incOrDecrCurrency(user, count )
    } else {
        await incOrDecrCurrency(author, count)
    }
    
    return interaction.reply("SET")
}

export default {
    data,
    execute
} as ICommand