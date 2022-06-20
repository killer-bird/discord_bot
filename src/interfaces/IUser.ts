import { UserId } from "../types/UserId"
import {RoleId } from "../types/RoleId"
import { Currency } from "../types/Currency"
import { IRoom } from "./IRoom"

export interface IUser {
    id: UserId;
    currency: Currency;
    roles: RoleId[];
    ban: boolean
    mute: boolean
    gender: number
    // room: IRoom
}
