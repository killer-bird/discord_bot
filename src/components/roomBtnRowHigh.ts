import { MessageActionRow } from "discord.js"
import { limitBtn } from "../buttons/limitBtn"
import { renameBtn } from "../buttons/renameBtn"
import { lockBtn } from "../buttons/lockBtn"
import { unlockBtn } from "../buttons/unlockBtn"
import { banBtn } from "../buttons/banBtn"
import { unbanBtn } from "../buttons/unbanBtn"

export const data = new MessageActionRow()
.addComponents( 
    renameBtn, 
    limitBtn, 
    lockBtn, 
    unlockBtn,
    banBtn, 
    
    )

