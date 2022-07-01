import { MessageActionRow } from "discord.js"
import { deleteModerBtn } from "../buttons/deleteModerBtn"
import { infoBtn } from "../buttons/infoBtn"
import {invisibleBtn} from "../buttons/invisibleBtn"
import {visibleBtn} from "../buttons/visibleBtn"


export const btnRowLow = new MessageActionRow()
.addComponents(deleteModerBtn, infoBtn, invisibleBtn, visibleBtn)