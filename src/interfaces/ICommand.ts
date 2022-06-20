import {SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder} from "@discordjs/builders"


export interface ICommand {
    data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;

}