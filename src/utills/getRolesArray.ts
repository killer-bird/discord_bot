import { GuildMember } from "discord.js"
import { RoleId } from "../types/RoleId"


export const getRolesArray = (member: GuildMember): RoleId[] => {
    return member.roles.cache.map(m => m.id).filter(r => r !== process.env.GUILD_ID)
}