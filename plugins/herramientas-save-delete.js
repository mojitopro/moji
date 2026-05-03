// Código elaborado por: https://github.com/elrebelde21

import fs from 'fs'
import path from 'path'

const globalContentFile = path.join(process.cwd(), './database/globalContent.json')
const localContentFile = path.join(process.cwd(), './database/localContent.json')

function loadGlobalContent() {
try {
if (fs.existsSync(globalContentFile)) {
const data = fs.readFileSync(globalContentFile, 'utf8')
return JSON.parse(data)
}
return {}
} catch (e) {
console.error(`Error al cargar globalContent.json: ${e}`)
return {}
}
}

function saveGlobalContent(data) {
try {
fs.writeFileSync(globalContentFile, JSON.stringify(data, null, 2), 'utf8')
} catch (e) {
console.error(`Error al guardar globalContent.json: ${e}`)
}
}

function loadLocalContent() {
try {
if (fs.existsSync(localContentFile)) {
const data = fs.readFileSync(localContentFile, 'utf8')
return JSON.parse(data)
}
return {}
} catch (e) {
console.error(`Error al cargar localContent.json: ${e}`)
return {}
}
}

function saveLocalContent(data) {
try {
fs.writeFileSync(localContentFile, JSON.stringify(data, null, 2), 'utf8')
} catch (e) {
console.error(`Error al guardar localContent.json: ${e}`)
}
}

let handler = async (m, {conn, text, usedPrefix, command, isOwner}) => {
const localContent = loadLocalContent()
const chat = localContent[m.chat] || {savedContent: {}}
if (!chat.savedContent && !global.db.data.sticker && !fs.existsSync(globalContentFile))
return m.reply(`${lenguajeGB['smsAvisoMG']()} 𝙉𝙊 𝙃𝘼𝙔 𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙉𝙄 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 𝙂𝙐𝘼𝙍𝘿𝘼𝘿𝙊𝙎.`)

const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null
const isAdmin = m.isGroup ? groupMetadata?.participants.find((p) => p.id === m.sender)?.admin : false

if (text) {
const keyword = text.toLowerCase().trim()
if (chat.savedContent[keyword]) {
const contentCreator = chat.savedContent[keyword].creator
if (m.sender === contentCreator || isAdmin || isOwner) {
delete chat.savedContent[keyword]
saveLocalContent(localContent)
await m.reply(`${lenguajeGB['smsAvisoEG']()}𝙀𝙇 ${keyword} 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊 𝘼𝙇 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙀 𝙄𝙈𝘼𝙂𝙀𝙉 𝙁𝙐𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 𝘿𝙀 𝙇𝘼 𝘽𝘼𝙎𝙀 𝘿𝙀 𝘿𝘼𝙏𝙊𝙎 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼𝙈𝙀𝙉𝙏𝙀.`)
await m.react('✅')
} else {
throw `${lenguajeGB['smsAvisoMG']()} *𝙎𝙊𝙇𝙊 𝙋𝙐𝙀𝘿𝙀𝙎 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍 𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙌𝙐𝙀 𝙏𝙐 𝙂𝙐𝘼𝙍𝘿𝘼𝙎𝙏𝙀, 𝘼 𝙈𝙀𝙉𝙊𝙎 𝙌𝙐𝙀 𝙎𝙀𝘼𝙎 𝘼𝘿𝙈𝙄𝙉 𝙊 𝙊𝙒𝙉𝙀𝙍.*`
}
return
}

if (isOwner) {
const globalContent = loadGlobalContent()
if (globalContent[keyword]) {
delete globalContent[keyword]
saveGlobalContent(globalContent)
await m.reply(`${lenguajeGB['smsAvisoEG']()}𝙀𝙇 ${keyword} 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊 𝘼𝙇 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙀 𝙄𝙈𝘼𝙂𝙀𝙉 𝙁𝙐𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 𝘿𝙀 𝙇𝘼 𝘽𝘼𝙎𝙀 𝘿𝙀 𝘿𝘼𝙏𝙊𝙎 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼𝙈𝙀𝙉𝙏𝙀..`)
await m.react('✅')
return
}
}

const commandEntry = Object.entries(global.db.data.sticker).find(([_, value]) => value.text === keyword)
if (commandEntry) {
const [hash, commandData] = commandEntry
const {chat: commandChat, creator, locked} = commandData

if (isOwner) {
delete global.db.data.sticker[hash]
await m.reply(`${lenguajeGB['smsAvisoEG']()} *${keyword}* 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 𝘾𝙊𝙍𝙍𝙀𝙎𝙏𝘼𝙈𝙀𝙉𝙏𝙀 𝙋𝙊𝙍 𝙀𝙇 𝙊𝙒𝙉𝙀𝙍`)
await m.react('✅')
} else if (commandChat === m.chat) {
if (m.sender === creator || isAdmin) {
if (locked && m.sender !== creator) throw `${lenguajeGB['smsAvisoMG']()} 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙀𝙎𝙏𝘼 𝘽𝙇𝙊𝙌𝙐𝙀𝘼𝘿𝙊, 𝙎𝙊𝙇𝙊 𝙀𝙇 𝘾𝙍𝙀𝘼𝘿𝙊𝙍 𝙋𝙐𝙀𝘿𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍𝙇𝙊*`
delete global.db.data.sticker[hash]
await m.reply(`${lenguajeGB['smsAvisoEG']()} *${keyword}* 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 𝘾𝙊𝙍𝙍𝙀𝙎𝙏𝘼𝙈𝙀𝙉𝙏𝙀.`)
await m.react('✅')
} else {
throw `${lenguajeGB['smsAvisoMG']()} 𝙎𝙊𝙇𝙊 𝙀𝙇 𝘾𝙍𝙀𝘼𝘿𝙊𝙍 𝙊 𝙐𝙉 𝘼𝘿𝙈𝙄𝙉 𝙋𝙐𝙀𝘿𝙀𝙉 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙇𝙊𝘾𝘼𝙇`
}
} else {
throw `${lenguajeGB['smsAvisoMG']()} 𝙉𝙊 𝙏𝙄𝙀𝙉𝙀𝙎 𝙋𝙀𝙍𝙈𝙄𝙎𝙊 𝙋𝘼𝙍𝘼 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊`
}
return
}
throw `${lenguajeGB['smsAvisoMG']()} 𝙇𝘼 𝙋𝘼𝙇𝘼𝘽𝙍𝘼 𝘾𝙇𝘼𝙑𝙀 𝙊 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙉𝙊 𝙀𝙓𝙄𝙎𝙏𝙀 `
} else if (m.quoted && m.quoted.fileSha256) {
const hash = m.quoted.fileSha256.toString('base64')
if (global.db.data.sticker[hash]) {
const commandData = global.db.data.sticker[hash]
const {chat: commandChat, creator, locked} = commandData

if (isOwner) {
delete global.db.data.sticker[hash]
await m.reply(`${lenguajeGB['smsAvisoEG']()} 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 𝘾𝙊𝙍𝙍𝙀𝙎𝙏𝘼𝙈𝙀𝙉𝙏𝙀 𝙋𝙊𝙍 𝙀𝙇 𝙊𝙊𝙒𝙉𝙀𝙍.`)
await m.react('✅')
} else if (commandChat === m.chat) {
if (m.sender === creator || isAdmin) {
if (locked && m.sender !== creator) throw `${lenguajeGB['smsAvisoMG']()} 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙀𝙎𝙏𝘼 𝘽𝙇𝙊𝙌𝙐𝙀𝘼𝘿𝙊, 𝙎𝙊𝙇𝙊 𝙀𝙇 𝘾𝙍𝙀𝘼𝘿𝙊𝙍 𝙋𝙐𝙀𝘿𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍𝙇𝙊`
delete global.db.data.sticker[hash]
await m.reply(`${lenguajeGB['smsAvisoEG']()} 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 𝘾𝙊𝙍𝙍𝙀𝙎𝙏𝘼𝙈𝙀𝙉𝙏𝙀.`)
await m.react('✅')
} else {
throw `${lenguajeGB['smsAvisoMG']()} 𝙎𝙊𝙇𝙊 𝙀𝙇 𝘾𝙍𝙀𝘼𝘿𝙊𝙍 𝙊 𝙐𝙉 𝘼𝘿𝙈𝙄𝙉 𝙋𝙐𝙀𝘿𝙀𝙉 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙇𝙊𝘾𝘼𝙇`
}
} else {
throw `${lenguajeGB['smsAvisoMG']()} 𝙉𝙊 𝙏𝙄𝙀𝙉𝙀𝙎 𝙋𝙀𝙍𝙈𝙄𝙎𝙊 𝙋𝘼𝙍𝘼 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊`
}
} else {
throw `${lenguajeGB['smsAvisoMG']()} 𝙇𝘼 𝙋𝘼𝙇𝘼𝘽𝙍𝘼 𝘾𝙇𝘼𝙑𝙀 𝙊 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙉𝙊 𝙀𝙓𝙄𝙎𝙏𝙀 `
}
} else {
throw `${lenguajeGB['smsAvisoMG']()}𝙎𝙊𝙇𝙊 𝙎𝙀 𝙋𝙐𝙀𝘿𝙀 𝘼𝙎𝙄𝙂𝙉𝘼𝙍 𝙏𝙀𝙓𝙏𝙊 𝙊 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝘼 𝙎𝙏𝙄𝘾𝙆𝙀𝙍  𝙀 𝙄𝙈𝘼𝙂𝙀𝙉, 𝙋𝘼𝙍𝘼 𝙊𝘽𝙏𝙀𝙉𝙀𝙍 𝙀𝙇 𝘾𝙊𝘿𝙄𝙂𝙊 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊 𝙐𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 ${usedPrefix}listcmd*`
}
}
handler.help = ['delcmd']
handler.tags = ['tools']
handler.command = /^(delsave|delcmd)$/i
export default handler
