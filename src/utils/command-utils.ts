import {Client, Guild} from 'discord.js'
import fs from 'fs'
import Command from '../commands/command'
import {log} from './logger'
import {getServer} from "../managers/server-manager";
import {DiscordServer} from "../models/discord-server";

let commandList: Command[] = []

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
                command.metadata = {
                    module: module
                }
                log(`Loaded command ${command.name} from module ${module}`, 'debug')
                commands.push(command)
            }
        })
    })

    // Log the number of commands loaded
    log(`Loaded ${commands.length} commands`)

    registerCommands(client.guilds.cache.map((guild) => guild))

    commandList = commands

    return commands
}

export function registerCommands(guilds: Guild[]): void {
    guilds.forEach(
        (guild) => {
            getServer(guild.id).then(server => {
                if (server) {
                    loadServerCommands(server, guild)
                }
            })
        }
    )
}


export function loadServerCommands(server: DiscordServer, guild: Guild): void {
    let toRegister: any[] = commandList.filter(
        (command) =>
            !server.disabledCommands.includes(command.name)
            && !server.disabledModules.includes(command.metadata.module)
    ).map((command) => {
        return {
            name: command.name,
            description: command.description,
        }
    })

    guild.commands.set(toRegister).then(() => {
        log(`Registered ${toRegister.length} commands for ${guild.name}`, 'debug')
    }).catch((error) => {
        log(error, 'error')
    })
}

export function getCommands(): Command[] {
    return commandList
}