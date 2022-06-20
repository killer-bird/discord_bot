import { MessageActionRow } from "discord.js"
import { limitBtn } from "./limitBtn"
import { renameBtn } from "./renameBtn"
import { lockBtn } from "./lockBtn"
import { unlockBtn } from "./unlockBtn"
import { banBtn } from "./banBtn"
import { unbanBtn } from "./unbanBtn"

export const data = new MessageActionRow()
.addComponents( 
    renameBtn, 
    limitBtn, 
    lockBtn, 
    unlockBtn,
    banBtn, 
    
    )

