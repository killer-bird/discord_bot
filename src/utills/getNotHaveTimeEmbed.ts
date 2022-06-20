import { MessageEmbed } from 'discord.js'



export const getNotHaveTimeEmbed = () :MessageEmbed => {

    const notHaveTimeEmbed = new MessageEmbed()
    notHaveTimeEmbed.setTitle("Не хватило времени")
    .setDescription("Вы не успели дать ответ в указанное время. Попробуйте еще раз")

    return notHaveTimeEmbed
}