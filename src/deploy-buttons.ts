import * as buttonsModules from "./buttons";
import { IButton } from "./interfaces/IButton";

const buttons = []

for (const module of Object.values<any>(buttonsModules)) {   
    buttons.push(module.data)
}