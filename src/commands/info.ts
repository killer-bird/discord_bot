import {SlashCommandBuilder} from "@discordjs/builders"
import { CommandInteraction, MessageEmbed, User } from "discord.js"
import { User as UserModel } from "../database/models/UserModel"
import { isUserExist } from '../utills/isUserExist'
import { getErrEmbed } from "../embeds"
import { ICommand } from "../interfaces"

const getInfoEmbed = async (target: User) :Promise<MessageEmbed> => { 
    
    const info = await UserModel.findOne({id: target?.id})
    console.log(info?.currency)
    const infoEmbed = new MessageEmbed()
    infoEmbed.setTitle("Информация о пользователе")
    .setImage(`https://cdn.discordapp.com/avatars/${target?.id}/${target?.avatar}.jpg`)
    .addField( 'Ник',  target?.username)
    .addField('Мужские cлёзки', String(info?.currency))
    
    return infoEmbed
}

const data = new SlashCommandBuilder()
        .setName("info")
        .setDescription("get info")
        .addUserOption(option => (
            option.setName("user")
            .setDescription("target user")
        ))
        


async function execute(interaction: CommandInteraction) {
    const target = interaction.options.getUser("user")
    const author = interaction.member?.user as User
    await interaction.deferReply()
    if (target) {      
        if( await isUserExist(target.id)){
            return interaction.editReply({embeds: [ await getInfoEmbed(target)]})
        } else {
            return interaction.editReply({embeds: [ getErrEmbed(`
            Введен неккоректный пользователь: ${target} 
            Если это не бот, обратитесь за помощью к администрации.        
            `) ]})
            .then(()=> setTimeout(() => {
                interaction.deleteReply()
            }, 5000))
        }      
    } else {        
        return await interaction.editReply({embeds: [ await getInfoEmbed(author)]})
    } 
           
    
}

export default {
    data,
    execute
} as ICommand
 