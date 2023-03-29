import { log } from './utils/logger'
import 'dotenv/config'
import { Client, GatewayIntentBits, GuildMember } from 'discord.js'
import { loadCommands } from './utils/command-utils'
import Command from './commands/command'

const start = Date.now()
const token = process.env.TOKEN

if (!token) {
	log('No token provided', 'error')
	process.exit(1)
}

log('Token provided', 'info')

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
})

client.login(token).catch((error) => {
	log(error, 'error')
	process.exit(1)
})

let commands: Command[] = []

client.on('ready', () => {
	log(`API started, took ${Date.now() - start} ms`, 'info')

	commands = loadCommands(client)
})

client.on('interactionCreate', (interaction) => {
	if (!interaction.isCommand()) return

	const command = commands.find((c) => c.name === interaction.commandName)

	if (!command || !interaction.guild) return

	command.run(client, interaction.user, interaction.guild, interaction)
})
