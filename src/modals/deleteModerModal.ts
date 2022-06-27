import { Modal, MessageActionRow } from "discord.js"
import { usersSelectMenu } from "../components/UsersSelectMenu"

export const deleteModerModal = new Modal()
    .setCustomId('deleteModerModal')
    .setTitle('Снять модератора комнаты')

const row = new MessageActionRow({
    components: [usersSelectMenu]
})
