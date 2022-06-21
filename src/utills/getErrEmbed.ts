import {  MessageEmbed } from 'discord.js'

export const getErrEmbed = (message: string): MessageEmbed => {
    const errorEmbed = new MessageEmbed()
    errorEmbed.setTitle("Ошибка")
    .setDescription(message)
    
    return errorEmbed
}