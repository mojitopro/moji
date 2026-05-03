let handler = async (m, {conn, usedPrefix, text}) => {
if (conn.user.jid !== global.conn.user.jid) throw false
let users = [...new Set([...global.conns.filter((conn) => conn.user && conn.state !== 'close').map((conn) => conn.user.jid)])]
let cc = text ? m : m.quoted ? await m.getQuotedObj() : false || m
let teks = text ? text : cc.text
let content = conn.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? teks : '*〔 𝗗𝗜𝗙𝗨𝗦𝗜𝗢𝗡 𝗔 𝗦𝗨𝗕 𝗕𝗢𝗧𝗦 〕*\n\n' + teks)
for (let id of users) {
await conn.copyNForward(id, content, true)
}
conn.reply(
m.chat,
`*𝗗𝗜𝗙𝗨𝗦𝗜𝗢𝗡 𝗘𝗡𝗩𝗜𝗔𝗗𝗔 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢 𝗔 ${users.length} 𝗦𝗨𝗕 𝗕𝗢𝗧𝗦*
    
  ${users.map((v) => '🐈 Wa.me/' + v.replace(/[^0-9]/g, '') + `?text=${encodeURIComponent(usedPrefix)}estado`).join('\n')}
  \n*𝗦𝗘 𝗙𝗜𝗡𝗔𝗟𝗜𝗭𝗢 𝗖𝗢𝗡 𝗘𝗟 𝗘𝗡𝗩𝗜𝗢 𝗘𝗡 ${users.length * 1.5} 𝗦𝗘𝗚𝗨𝗡𝗗𝗢𝗦 𝗔𝗣𝗥𝗢𝗫𝗜𝗠𝗔𝗗𝗔𝗠𝗘𝗡𝗧𝗘`.trim(),
m
)
}
handler.command = /^bcbot$/i
handler.owner = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

