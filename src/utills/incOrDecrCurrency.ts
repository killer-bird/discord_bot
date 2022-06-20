import {  User } from "discord.js"
import { User as UserModel } from "../database/models/UserModel"


export const incOrDecrCurrency = async (target: User, count: number): Promise<void> => {
    await UserModel.updateOne({id: target.id}, {$inc: {currency: count}})
}