"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const Client_1 = __importDefault(require("./Client"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// client.on("interactionCreate", async (interaction) => {
//     if(interaction.isCommand()) {
//         const { commandName } = interaction
//         try {
//             commands[commandName].execute(interaction, client)       
//         } catch (error) {
//             return
//         }
//     }
//     if(interaction.isButton()) {
//         const { customId } = interaction 
//         try {
//             buttons[customId].execute(interaction)
//         } catch (error) {
//             console.log(error)
//             return
//         }
//     }
//     if(interaction.isModalSubmit()){
//         const { customId } = interaction 
//         const value = interaction.fields.getTextInputValue(customId + 'Input')
//         console.log(customId, value)
//     }
// })
// connectDatabase()   
// client.login(process.env.DISCORD_TOKEN)
exports.client = new Client_1.default(process.env.DISCORD_TOKEN, process.env.MONGO_URI);
exports.client.init();
