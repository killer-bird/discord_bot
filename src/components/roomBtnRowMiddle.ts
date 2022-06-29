import { MessageActionRow } from "discord.js"
import { unbanBtn } from "../buttons/unbanBtn"
import { kickBtn } from "../buttons/kickBtn"
import { muteBtn } from "../buttons/muteBtn"
import { unmuteBtn } from "../buttons/unmuteBtn"

import { setModerBtn } from "../buttons/setModerBtn"


export const btnRowMiddle = new MessageActionRow()
.addComponents( unbanBtn, kickBtn, muteBtn, unmuteBtn, setModerBtn)