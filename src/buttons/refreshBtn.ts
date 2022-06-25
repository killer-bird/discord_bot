import { MessageButton, MessageActionRow, ButtonInteraction } from "discord.js"
import { IButton } from "../interfaces"
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


export const execute = async (interaction: ButtonInteraction) => {
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

export default {
    data: refreshBtn,
    execute
} as IButton