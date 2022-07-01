import { UserId } from "../types/UserId"
import { UserName } from "../types/UserName"
import { RoomName } from "../types/RoomName"
import { UserLimit } from "../types/UserLimit"


export interface IRoom {
    id: string | null
    owner: UserId
    name:  RoomName | UserName;
    mutes: UserId[];
    bans: UserId[];
    moderators: UserId[];
    limit: UserLimit | null;
    invisible: boolean;
    closed: boolean;
}
export type IRoomKey = keyof IRoom;