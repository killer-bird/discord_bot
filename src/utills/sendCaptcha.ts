import { MessageButton, MessageActionRow, GuildMember, User } from "discord.js"
import * as buttons from "../buttons"
import { getCaptcha } from "./getCaptcha";

export const sendCaptcha = async (member: User) :Promise<any> => {
    

    return await member.send({
        files: [await getCaptcha()], 
        content: "Решите капчу",
        components: [buttons.refreshBtn.data]
    })
}
