import Command from '../command'
import { Client, Guild, CommandInteraction, User } from 'discord.js'

export default class PingCommand implements Command {
	name = 'ping'
	description = "Ping the bot to see if it's alive"
	run = async (
		client: Client,
		user: User,
		guild: Guild,
		command: CommandInteraction
	) => {
		let ping = Date.now() - command.createdTimestamp
		command.reply(`Pong! ${user.username} (${ping}ms)`)
	}
}
