import { MessageActionRow } from "discord.js"
import { limitBtn } from "../buttons/limitBtn"
import { renameBtn } from "../buttons/renameBtn"
import { lockBtn } from "../buttons/lockBtn"
import { unlockBtn } from "../buttons/unlockBtn"
import { banBtn } from "../buttons/banBtn"

export const btnRowHigh = new MessageActionRow()
.addComponents( 
    renameBtn, 
    limitBtn, 
    lockBtn, 
    unlockBtn,
    banBtn, 
    
    )

