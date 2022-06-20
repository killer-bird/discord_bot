import { MessageEmbed } from 'discord.js'


export const getNotificationEmbed = (notification : string) :MessageEmbed => { 
    const notificationEmbed = new MessageEmbed()
    notificationEmbed.setTitle("Уведомление")
    .setDescription(notification)


    return notificationEmbed
}