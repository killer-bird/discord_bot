import { MessageActionRow } from "discord.js"
import { unbanBtn } from "./unbanBtn"
import { kickBtn } from "./kickBtn"
import { muteBtn } from "./muteBtn"
import { unmuteBtn } from "./unmuteBtn"
import { deleteModerBtn } from "./deleteModerBtn"
import { setModerBtn } from "./setModerBtn"


export const data = new MessageActionRow()
.addComponents( unbanBtn, kickBtn, muteBtn, unmuteBtn, setModerBtn)



