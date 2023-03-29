import { Client } from 'discord.js'
import fs from 'fs'
import Command from '../commands/command'
import { log } from './logger'

export function loadCommands(client: Client): Command[] {
	// Load each module in the commands folder
	let modules: string[] = []
	let commands: Command[] = []

	fs.readdirSync('src/commands').forEach((dir) => {
		// check if the file is a directory
		if (fs.lstatSync(`src/commands/${dir}`).isDirectory()) {
			modules.push(dir)
		}
	})

	// Log the number of modules loaded
	log(`Loading ${modules.length} modules`)

	// Load each command in the modules
	modules.forEach((module) => {
		fs.readdirSync(`src/commands/${module}`).forEach((file) => {
			if (file.endsWith('.ts')) {
				const cls = require(`../commands/${module}/${file}`).default
				const command = new cls()
				commands.push(command)
			}
		})
	})

	// Log the number of commands loaded
	log(`Loading ${commands.length} commands`)

	// Clear the non-existing commands
	client.application?.commands.fetch().then((cmds) => {
		cmds.forEach((cmd) => {
			if (!commands.find((c) => c.name === cmd.name)) {
				cmd.delete()
				log(`Deleted command ${cmd.name}`, 'debug')
			}
		})
	})

	// Register each command
	commands.forEach((command) => {
		client.application?.commands
			.create({
				name: command.name,
				description: command.description,
			})
			.then(() => {
				// Log the command that was loaded
				log(`Loaded command ${command.name}`, 'debug')
			})
			.catch((error) => {
				log(error, 'error')
			})
	})

	// Log the number of commands loaded
	log(`Loaded ${commands.length} commands`)

	return commands
}
