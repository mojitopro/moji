let handler = async (m, {conn, args, usedPrefix, command}) => {
if (!m.quoted && !m.mentionedJid?.length && !args[0])
return m.reply("𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀 𝘼𝙇 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘿𝙀 𝘼𝙇𝙂𝙐𝙄𝙀𝙉 𝙋𝘼𝙍𝘼 𝙋𝙊𝘿𝙀𝙍 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍 𝙀𝙇 𝙈𝙀𝙉𝙎𝘼𝙅𝙀\n\n𝙍𝙀𝙋𝙇𝙔 𝙏𝙊 𝙎𝙊𝙈𝙀𝙊𝙉𝙀'𝙎 𝙈𝙀𝙎𝙎𝘼𝙂𝙀 𝙎𝙊 𝙔𝙊𝙐 𝘾𝘼𝙉 𝘿𝙀𝙇𝙀𝙏𝙀 𝙏𝙃𝙀 𝙈𝙀𝙎𝙎𝘼𝙂𝙀.")
try {
if (m.quoted) {
let delet = m.quoted.sender
let bang = m.quoted.id
return conn.sendMessage(m.chat, {delete: {remoteJid: m.chat, fromMe: false, id: bang, participant: delet}})
}

let target = ''
if (m.mentionedJid?.length) {
target = m.mentionedJid[0]
} else if (args[0] && args[0].startsWith('+')) {
target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
} else {
return m.reply('⚠️ 𝘿𝙀𝘽𝙀𝙎 𝙈𝙀𝙉𝘾𝙄𝙊𝙉𝘼𝙍 𝘼 𝘼𝙇𝙂𝙐𝙄𝙀𝙉, 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀𝙍 𝘼 𝙐𝙉 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝙊 𝙋𝙍𝙊𝙈𝙊𝙍𝘾𝙄𝙊𝙉𝘼𝙏 𝙐𝙉 𝙉𝙐𝙈𝙀𝙍𝙊 𝙑𝘼𝙇𝙄𝘿𝙊')
}

let chats = (await conn.chats[m.chat]?.messages) || []
let messagesToDelete = Object.values(chats).filter((msg) => msg.key.participant === target || msg.key.remoteJid === target)

if (!messagesToDelete.length) return m.reply('⚠️ 𝙉𝙊 𝙎𝙀 𝙀𝙈𝘾𝙊𝙉𝙏𝙍𝘼𝙍𝙊𝙉 𝙈𝙀𝙉𝙎𝘼𝙅𝙀𝙎 𝙍𝙀𝘾𝙄𝙀𝙉𝙏𝙀𝙎 𝘿𝙀𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊𝙎')
let totalToDelete = Math.min(messagesToDelete.length, 200) // Máximo 200 mensajes
let deletedCount = 0

for (let i = 0; i < totalToDelete; i++) {
let message = messagesToDelete[i]
try {
await conn.sendMessage(m.chat, {delete: message.key})
deletedCount++
} catch (err) {
console.log('❌ No se pudo eliminar un mensaje:', err)
}
}
m.reply(`✅ 𝙎𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍𝙊𝙉 ${deletedCount} 𝙈𝙀𝙉𝙎𝘼𝙅𝙀𝙎 𝘿𝙀 ${target.includes('@s.whatsapp.net') ? `𝙀𝙇 𝙉𝙐𝙈𝙀𝙍𝙊 ${args[0]}` : '𝙀𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙈𝙀𝙉𝘾𝙄𝙊𝙉𝘼𝘿𝙊'}.`)
} catch (err) {
console.error(err)
}
}
handler.help = ['delete *@user* | +number']
handler.tags = ['group']
handler.command = /^del(ete)?$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

