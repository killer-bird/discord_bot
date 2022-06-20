import { User, MessageEmbed } from 'discord.js'

export const getNotExistEmbed = (user: User) : MessageEmbed => {
    const notExistEmbed = new MessageEmbed()
    notExistEmbed.setTitle("Ошибка")
    
    .setDescription(`
    Введен неккоректный пользователь: ${user} 
    Если это не бот, обратитесь за помощью к администрации.
    `)
    
    return notExistEmbed
}