import Command from '../command'
import {Client, CommandInteraction, Guild, User} from 'discord.js'

export default class PingCommand implements Command {
    name = 'ping'
    description = "Ping the bot to see if it's alive"
    run = async (
        client: Client,
        user: User,
        guild: Guild,
        command: CommandInteraction
    ) => {
        command.reply("...").then(msg => {
            let ping = command.createdTimestamp - msg.createdTimestamp
            msg.edit(`Pong! ${user.username} (${ping}ms)`)
        })
    }
}
