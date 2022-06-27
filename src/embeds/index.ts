import { MessageEmbed, User  } from "discord.js";


export const getNotifyEmbed = (message: string) :MessageEmbed => (
    new MessageEmbed().setTitle("Уведомление").setDescription(message)   
)

export const getErrEmbed = (message: string): MessageEmbed => (
    new MessageEmbed().setTitle("Ошибка").setDescription(message)   
)

