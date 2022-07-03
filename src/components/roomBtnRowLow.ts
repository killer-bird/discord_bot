import { MessageActionRow } from "discord.js"
import { deleteModerBtn } from "../buttons/deleteModerBtn"
import { infoBtn } from "../buttons/infoBtn"
import {invisibleBtn} from "../buttons/invisibleBtn"
import {visibleBtn} from "../buttons/visibleBtn"
import {privateBtn} from "../buttons/privateBtn"

export const btnRowLow = new MessageActionRow()
.addComponents(deleteModerBtn, infoBtn, invisibleBtn, visibleBtn, privateBtn)