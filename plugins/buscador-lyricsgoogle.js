import BuscarLetra from '../lib/lyricsgg.js'

let handler = async (m, {conn, usedPrefix, command, text}) => {
let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : ''
if (!teks) throw `️${lenguajeGB['smsAvisoMG']()}${mid.smsMalused}`
try {
let res = await BuscarLetra(text)
let {titulo, artista, albulm, fecha, Generos, letra} = res
let txt = '*𝙂𝙊𝙊𝙂𝙇𝙀 𝙇𝙔𝙍𝙄𝘾𝙎 🪴*\n\n'
txt += ` *↬ ${mid.smsYT1}:* ${titulo}\n`
txt += ` *↬ ${mid.smsYT6}:* ${artista}\n`
txt += ` *↬ ${mid.smsYT7}:* ${albulm}\n`
txt += ` *↬ ${mid.smsYT8}:* ${fecha}\n`
txt += ` *↬ ${mid.smsYT8}:* ${Generos}\n\n`
txt += `${letra}`
m.reply(txt)
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = false
}
}
handler.command = handler.help = ['google-lyrics', 'lyricsgoogle', 'googlelyrics']
handler.limit = 1
export default handler
