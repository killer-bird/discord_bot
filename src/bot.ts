import ExtendedClient from "./Client";
import dotenv from "dotenv";


dotenv.config()

export const client = new ExtendedClient(
    process.env.DISCORD_TOKEN as string,
    process.env.MONGO_URI as string
)

client.init()