import {SlashCommandBuilder} from "@discordjs/builders"
import { CommandInteraction, User } from "discord.js"
import { User as UserModel } from "../database/models/UserModel"
import { incOrDecrCurrency } from "../utills/incOrDecrCurrency"
import { isUserExist } from '../utills/isUserExist'
import { getNotExistEmbed } from "../utills/getNotExistsEmbed"

export const data = new SlashCommandBuilder()
    .setName("give")
    .setDescription("giveCurrency")
    .addIntegerOption(option=> (
        option.setName("count")
        .setDescription("Сколько валюты дать?")
        .setRequired(true)
    ))
    .addUserOption(option => {
        return option.setName("user")
            .setDescription("Кому дать валюту?")
            .setRequired(true)
    })
    

export async function execute(interaction: CommandInteraction) {
    const author = interaction.member?.user as User
    const target = interaction.options.getUser("user") as User
    const count =  interaction.options.getInteger("count") as number  
    const authorModel = await UserModel.findOne({id: author.id})
    
    if(authorModel?.currency as number >= count) {
        
        if(await isUserExist(target.id)){
            await incOrDecrCurrency(author, -count)
            await incOrDecrCurrency(target, count)
        } else {
            return interaction.reply({embeds: [ getNotExistEmbed(target) ]})
            .then(()=> setTimeout(() => {
                interaction.deleteReply()
            }, 5000))
        }   
    }

       
    return interaction.reply("GIVE")
}