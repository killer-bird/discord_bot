import { MessageEmbed } from "discord.js"


export const getAwaitMsgEmbed = ( message : string ) :MessageEmbed => {
    
    const awaitMsgEmbed = new MessageEmbed()
    awaitMsgEmbed.setTitle("Настройки личной комнаты")
    .setDescription(`Чтобы ${message} введите его ниже`)
    .setFooter({text: "У вас есть 15 секунд, затем данное сообщение автоматически удалится"})
    
    
    return awaitMsgEmbed
}