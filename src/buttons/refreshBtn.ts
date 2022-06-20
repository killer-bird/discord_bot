import { MessageButton, MessageActionRow, CommandInteraction } from "discord.js"
import { sendCaptcha } from "../utills/sendCaptcha"

const refreshConfig  = {
    timeout : false,
}

const refreshBtn = new MessageButton()
    .setCustomId('refreshBtn')
    .setLabel('Обновить')
    .setStyle('SECONDARY')

export const data = new MessageActionRow()
.addComponents(
    refreshBtn
)


export const execute = async (interaction: CommandInteraction) => {
    if (refreshConfig.timeout) {
        return await interaction.reply("Подождите 5 минут")
    } else {
        refreshConfig.timeout = true
        setTimeout(() => {
            refreshConfig.timeout = false
        }, 300000)

        return await sendCaptcha(interaction.user)
    }
}