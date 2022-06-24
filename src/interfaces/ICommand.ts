import Client from "../Client"
import { Message, CommandInteraction } from "discord.js"
import {SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder} from "@discordjs/builders"

interface Run {
    (interaction: CommandInteraction):void
}


export interface ICommand {
    data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
    run?: Run
    

}