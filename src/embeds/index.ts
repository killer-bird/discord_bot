import { MessageEmbed, User  } from "discord.js";


export const getNotifyEmbed = (message: string) :MessageEmbed => (
    new MessageEmbed().setTitle("Уведомление").setDescription(message)   
)

export const getErrEmbed = (message: string): MessageEmbed => (
    new MessageEmbed().setTitle("Ошибка").setDescription(message)   
)


export const getAwaitMsgEmbed = ( message : string ) :MessageEmbed => {
    
    const awaitMsgEmbed = new MessageEmbed()
    awaitMsgEmbed.setTitle("Настройки личной комнаты")
    .setDescription(`Чтобы ${message} введите его ниже`)
    .setFooter({text: "У вас есть 15 секунд, затем данное сообщение автоматически удалится"})
    
    
    return awaitMsgEmbed
}