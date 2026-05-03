let handler = async (m, {conn, text, command}) => {
let id = text ? text : m.chat
let chat = global.db.data.chats[m.chat]
chat.welcome = false
await conn.reply(id, `*${wm} 𝘼𝘽𝘼𝙉𝘿𝙊𝙉𝘼 𝙀𝙇 𝙂𝙍𝙐𝙋𝙊, 𝙁𝙐𝙀 𝙂𝙀𝙉𝙄𝘼𝙇 𝙀𝙎𝙏𝘼𝙍 𝘼𝙌𝙐𝙄 👋*`)
await conn.groupLeave(id)
try {
//chat.welcome = true
} catch (e) {
await m.reply(`${fg}`)
return console.log(e)
}
}
handler.command = /^(salir|leavegc|salirdelgrupo|leave)$/i
handler.group = true
handler.owner = true
export default handler
