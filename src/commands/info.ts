import {SlashCommandBuilder} from "@discordjs/builders"
import { CommandInteraction, MessageEmbed, User } from "discord.js"
import { User as UserModel } from "../database/models/UserModel"
import { isUserExist } from '../utills/isUserExist'
import { getNotExistEmbed } from "../utills/getNotExistsEmbed"

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

export const data = new SlashCommandBuilder()
        .setName("info")
        .setDescription("get info")
        .addUserOption(option => (
            option.setName("user")
            .setDescription("target user")
        ))
        


export async function execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser("user")
    const author = interaction.member?.user as User
    await interaction.deferReply()
    if (user) {      
        if( await isUserExist(user.id)){
            return interaction.editReply({embeds: [ await getInfoEmbed(user)]})
        } else {
            return interaction.editReply({embeds: [ getNotExistEmbed(user) ]})
            .then(()=> setTimeout(() => {
                interaction.deleteReply()
            }, 5000))
        }      
    } else {        
        return await interaction.editReply({embeds: [ await getInfoEmbed(author)]})
    } 
           
    
}

 