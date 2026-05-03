const handler = async (m, {conn, isROwner, text}) => {
const datas = global

if (!process.send) throw 'Dont: node main.js\nDo: node index.js'
const {key} = await conn.sendMessage(m.chat, {text: '🚀🚀'}, {quoted: m})
await conn.sendMessage(m.chat, {text: '🚀🚀🚀🚀', edit: key})
await conn.sendMessage(m.chat, {text: '🚀🚀🚀🚀🚀🚀', edit: key})
await conn.sendMessage(m.chat, {text: '𝙍𝙚𝙞𝙣𝙞𝙘𝙞𝙖𝙧 | 𝙍𝙚𝙨𝙩𝙖𝙧𝙩', edit: key})
//process.send('reset')
process.exit(0)
}
handler.help = ['restart']
handler.tags = ['owner']
handler.command = ['restart', 'reiniciar']
handler.owner = true
export default handler

