import axios from 'axios'
let handler = async (m, {command, args, text, usedPrefix}) => {
if (!text) throw 'Ingresa el nombre de la canción a buscar'
try {
if (command.toLowerCase() !== 'soundcloudr') {
let response = await axios.get(`https://m.soundcloud.com/search/sounds?q=${text}`)
let data = response.data
let regex = /(?<="permalink_url":")[^"]*/g
let urls = data.match(regex)

let regex2 = /(?<="permalink":")[^"]*/g
let nombres = data.match(regex2)

let listSections = []
for (let index = 0; index < urls.length; index++) {
let counts = urls[index].split('/').length - 1
if (counts > 3) {
listSections.push({
rows: [
{
header: `Music ${index + 1}`,
title: '',
description: `${nombres[index]}\n`,
id: `${usedPrefix}soundcloudr ${urls[index]}`
}
]
})
}
}

return await conn.sendList(m.chat, `${htki} *𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎* ${htka}\n`, `\n𝘽𝙪𝙨𝙦𝙪𝙚𝙙𝙖 𝙙𝙚: ${text}`, '𝗕 𝗨 𝗦 𝗖 𝗔 𝗥', listSections, fkontak)
}

try {
const {data: api} = await axios.get(`${apis}/download/soundcloud?url=${encodeURIComponent(text)}`, {timeout: 25000})

if (!api?.status || !api?.data?.download) throw new Error('No se pudo obtener el enlace de descarga.')

const ddlink = api.data.download
const ddname = api.data.title
const portada = api.data.image
const scLink = api.data.link
const autor = api.data.author

await conn.sendMessage(m.chat, {image: {url: portada}, caption: `Espera por favor...\n\nEnviando: ${ddname}\n\n${wm}`}, {quoted: m})

await conn.sendMessage(
m.chat,
{
audio: {url: ddlink},
fileName: `${ddname}.mp3`,
mimetype: 'audio/mpeg',

contextInfo: {
externalAdReply: {
title: ddname,
body: autor || '',
renderLargerThumbnail: true,
showAdAttribution: true,
mediaType: 1,
thumbnailUrl: portada,
sourceUrl: scLink || ddlink
}
}
},
{quoted: m}
)
} catch (e) {
console.log('❌ soundcloud dl error:', e?.message || e)
await m.reply('❌ Ocurrió un error al procesar tu solicitud.')
}
} catch (e) {
return await m.reply('❌ Ocurrió un error al procesar tu solicitud.')
}
}

handler.command = /^(soundcloud|soundcloudr)$/i
handler.limit = 1
export default handler

