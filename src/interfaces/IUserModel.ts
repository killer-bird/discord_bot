import { UserId } from "../types/UserId"
import {RoleId } from "../types/RoleId"
import { Currency } from "../types/Currency"

export interface IUserModel {
    id: UserId;
    currency: Currency;
    roles: RoleId[];
    ban: boolean
    mute: boolean
    gender: number
}
