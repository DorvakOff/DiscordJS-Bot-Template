import {DiscordServer} from "../models/discord-server";
import {log} from "../utils/logger";
import db from "../utils/database";

export function getServer(id: string): Promise<DiscordServer> {
    return new Promise((resolve, reject) => {
        serverExists(id).then((exists) => {
            if (!exists) {
                addServer(id).then(() => {
                    log(`Added server ${id} to database`, "info")
                }).then(
                    () => {
                        getServerIfExists(id).then((server) => {
                            resolve(server)
                        }).catch((err) => {
                            reject(err)
                        })
                    }
                ).catch((err) => {
                    reject(err)
                })
            } else {
                getServerIfExists(id).then((server) => {
                    resolve(server)
                }).catch((err) => {
                    reject(err)
                })
            }
        }).catch((err) => {
            reject(err)
        })
    })
}

export function getServerIfExists(id: string): Promise<DiscordServer> {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM discord_servers WHERE id = ?", [id], (err, row) => {
            if (err || !row) {
                reject('Server not found')
            } else {
                let srv: any = row
                let server: DiscordServer = {
                    id: srv.id,
                    addedAt: srv.added_at,
                    disabledCommands: JSON.parse(srv.disabled_commands),
                    disabledModules: JSON.parse(srv.disabled_modules)
                }
                resolve(server)
            }
        })
    })
}

export function serverExists(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM discord_servers WHERE id = ?", [id], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row !== undefined)
            }
        })
    })
}

export function addServer(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO discord_servers (id) VALUES (?)", [id], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export function updateServer(server: DiscordServer): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run("UPDATE discord_servers SET disabled_commands = ?, disabled_modules = ? WHERE id = ?", [JSON.stringify(server.disabledCommands), JSON.stringify(server.disabledModules), server.id], (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}