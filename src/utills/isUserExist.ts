import {User as UserModel } from '../database/models/UserModel'

export const isUserExist = async (id : string) : Promise<boolean> => {   
    if(await UserModel.exists({id: id})){
        return true
    }
    return false
}