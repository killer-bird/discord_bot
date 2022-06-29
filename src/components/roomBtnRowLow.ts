import { MessageActionRow } from "discord.js"
import { deleteModerBtn } from "../buttons/deleteModerBtn"
import { infoBtn } from "../buttons/infoBtn"



export const btnRowLow = new MessageActionRow()
.addComponents(deleteModerBtn, infoBtn)