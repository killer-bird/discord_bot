import { GuildMember, RoleResolvable } from "discord.js"
import { User } from "../database/models/UserModel"
import { createUser } from "../utills/createUser"
import { newRoom } from "../utills/newRoom"
import { IEvent } from "../interfaces/IEvents"
import { users } from "../users"


const onGuildMemberAdd = async (member: GuildMember) => {

    const isOldUser = await User.findOne({id: member.user.id})
    users[member.user.id] = {
        timeLeftToGift: 0,
        voiceOnline: {
            entryTime: null,
            timeLeftToReward: 0
        }
    }
    
    if( isOldUser ) {
        console.log( member.user, "exist!!")
        setTimeout( async() => {
            try {
                for (const roleId of isOldUser.roles) {
                    let role = await member.guild.roles.fetch(roleId)
                    await member.roles.add(role as RoleResolvable)
                }
            } catch (error) {
                console.log(error)
                return
            }           
        }, 100000);       
    } else {
        console.log("NEW USER ADDED")
        
        const defaultRole = await member.guild.roles.fetch(process.env.DEFAULT_ROLE as string)
        setTimeout( async () => {
            try {
                await member.roles.add(defaultRole as RoleResolvable)       
            } catch (error) {
                console.log(error)
                return
            }
        }, 100000)
        await createUser(member)
        await newRoom(member)

        
    }
}



export default {
    name: 'guildMemberAdd',
    run: onGuildMemberAdd
} as IEvent