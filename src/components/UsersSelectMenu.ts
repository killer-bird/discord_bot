import { MessageSelectMenu } from "discord.js"

export const usersSelectMenu = new MessageSelectMenu()
    .setCustomId('selectUsers')
    .setPlaceholder('void')
    .addOptions([
        {
            label: 'Select me',
            description: 'This is a description',
            value: 'first_option',
        },
        {
            label: 'You can select me too',
            description: 'This is also a description',
            value: 'second_option',
        },
        {
            label: 'I am also an option',
            description: 'This is a description as well',
            value: 'third_option',
        },
    ])