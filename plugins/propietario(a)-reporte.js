//Código elaborado por: https://github.com/elrebelde21

/*
import { webp2png } from '../lib/webp2mp4.js';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OWNER1 = ["5214774444444@s.whatsapp.net", "593968263524@s.whatsapp.net"];
const ACTIVE_CONVERSATIONS = {};
const MAX_VIDEO_SIZE_MB = 60; // Límite de 60MB para videos

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
let media = false;
let q = m.quoted ? m.quoted : m;
let mime = (q.msg || q).mimetype || '';
let url = '';

if (/image|video|audio/.test(mime)) {
media = await q.download();

if (/video/.test(mime)) {
let videoPath = join(__dirname, `./temp_video_${new Date().getTime()}.mp4`);
fs.writeFileSync(videoPath, media);

let videoStats = fs.statSync(videoPath);
let videoSizeMB = videoStats.size / (1024 * 1024);
if (videoSizeMB > MAX_VIDEO_SIZE_MB) {
fs.unlinkSync(videoPath);
return m.reply(`*⚠️ El video excede el tamaño permitido (max 60 MB). Por favor, recórtalo, comprime o envía uno más ligero.*`);
}
url = videoPath;
} else {
url = await uploadImage(media);
}} else if (/webp/.test(mime)) {
media = await q.download();
url = await webp2png(media);
}

let activeConversation = Object.entries(ACTIVE_CONVERSATIONS).find(([id, convo]) => convo.active && convo.userId === m.sender && convo.chatId === m.chat);

if (activeConversation) {
let [reportId] = activeConversation;
let message = `❒═════[SEGUIMIENTO DE CONVERSACION]═════❒\n*┬\n├❧ NUMERO:* wa.me/${m.sender.split("@")[0]} (ID: ${reportId}):*\n*┬\n├❧ MENSAJE:* ${text || ''}\n*┴*`;

if (url) {
if (/image/.test(mime)) {
await conn.sendMessage(OWNER1, { image: { url }, caption: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
} else if (/video/.test(mime)) {
await conn.sendMessage(OWNER1, { video: { url }, caption: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
} else if (/audio/.test(mime)) {
await conn.sendMessage(OWNER1, { audio: { url }, mimetype: mime, caption: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
}} else if (m.msg && m.msg.sticker) {
await conn.sendMessage(OWNER1, { sticker: media, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
} else {
await conn.sendMessage(OWNER1, { text: message, mentions: [m.sender] }, { quoted: m });
}
return;
}

if (command === 'report' || command === 'reporte') {
if (!text && !m.quoted) return m.reply(`${mg}*𝙀𝙨𝙘𝙧𝙞𝙗𝙖 𝙚𝙡 𝙧𝙚𝙥𝙤𝙧𝙩𝙚*\n\n*𝙀𝙅𝙀𝙈𝙋𝙇𝙊:*\n*${usedPrefix + command} el comando ${usedPrefix}infobot no funciona.*\n\n*𝙒𝙧𝙞𝙩𝙚 𝙩𝙝𝙚 𝙧𝙚𝙥𝙤𝙧𝙩*\n\n*𝙀𝙓𝘼𝙈𝙋𝙇𝙀:*\n*${usedPrefix + command} the command ${usedPrefix}owner it does not work.*`);
if (text.length < 8) throw `${fg} ✨ *Mínimo 10 caracteres para hacer El Reporte.*\n\n✨ *Minimum 10 characters to make the Report.*`
if (text.length > 1000) throw `${fg} 😼 *Máximo 1000 caracteres para hacer El Reporte.*\n\n😼 *Maximum 1000 characters to make the Report.*`

let reportId = Math.floor(Math.random() * 901);

ACTIVE_CONVERSATIONS[reportId] = {
userId: m.sender,
userName: m.pushName || 'Anónimo',
active: true,
chatId: m.chat,
url: url,
mime: mime,
};

let reportText = text || (m.quoted && m.quoted.text) || '';
let teks = `*╭━━[ 𝙍𝙀𝙋𝙊𝙍𝙏𝙀 | 𝙍𝙀𝙋𝙊𝙍𝙏 ]━━━⬣*\n*┃*\n*┃* *𝙉𝙐𝙈𝙀𝙍𝙊 | 𝙉𝙐𝙈𝘽𝙀𝙍*\n┃ ✦ Wa.me/${m.sender.split("@")[0]}\n*┃*\n*┃* *𝙈𝙀𝙉𝙎𝘼𝙅𝙀 | 𝙈𝙀𝙎𝙎𝘼𝙂𝙀*\n*┃* ✦ ${reportText}\n*┃*\n*╰━━━━━━━━━━━━━━━━━━⬣*\n\n> Responde al mensaje con: *"responder ${reportId} [mensaje]"* para interactuar con el usuarios.\n> Usa *.fin ${reportId}* para finalizar la conversación.`;

await conn.sendMessage(OWNER1, { text: teks, mentions: [m.sender] }, { quoted: m });
await conn.reply(m.chat, `╰⊱💚⊱ *𝙀́𝙓𝙄𝙏𝙊 | 𝙎𝙐𝘾𝘾𝙀𝙎𝙎* ⊱💚⊱╮\n\n*El reporte ha sido enviado a mí Creadora. Tendrá una respuesta pronto. De ser Falso será Ignorado el reporte.*\n\n*The report has been sent to my Creator. You will have an answer soon. If false, the report will be ignored.*`);
return;
}};

handler.before = async (m, { conn }) => {
let activeConversation = Object.entries(ACTIVE_CONVERSATIONS).find(([id, convo]) => convo.active && convo.userId === m.sender && convo.chatId === m.chat);

if (activeConversation) {
let [reportId] = activeConversation;   
let message2 = `❒═════[SEGUIMIENTO DE CONVERSACION]═════❒\n*┬\n├❧ NUMERO:* wa.me/${m.sender.split("@")[0]} (ID: ${reportId}):*\n*┴*\n*┬*\n*├❧ MENSAJE:* ${m.text || ''}\n*┴*`;

if (m.mtype === 'stickerMessage') {
let sticker = await m.download();
if (sticker) {
await conn.sendMessage(OWNER1, { sticker }, { quoted: m });
} else {   
}} else if (m.mtype === 'imageMessage' || m.mtype === 'videoMessage' || m.mtype === 'audioMessage') {
let media = await m.download();
let url = await uploadImage(media);
if (url) {                      
await conn.sendMessage(OWNER1, { [m.mtype === 'videoMessage' ? 'video' : m.mtype === 'audioMessage' ? 'audio' : 'image']: { url }, caption: message2, contextInfo: { mentionedJid: [m.sender] }}, { quoted: m });
} else {
console.error('Error');
}} else {
await conn.sendMessage(OWNER1, { text: message2, mentions: [m.sender] }, { quoted: m });
}}

let matchResponder = m.text.match(/^responder (\S+) (.+)/i);
if (matchResponder) {
let [_, reportId, ownerMessage] = matchResponder;

if (!ACTIVE_CONVERSATIONS[reportId] || !ACTIVE_CONVERSATIONS[reportId].active) return
let { userId } = ACTIVE_CONVERSATIONS[reportId];
if (m.quoted) {
let quoted = m.quoted;
let mime = (quoted.msg || quoted).mimetype || '';
if (/image|video|audio|sticker/.test(mime)) {
let media = await quoted.download();
let url = await uploadImage(media);
if (/image/.test(mime)) {
await conn.sendMessage(userId, { image: { url }, caption: ownerMessage });
} else if (/video/.test(mime)) {
await conn.sendMessage(userId, { video: { url }, caption: ownerMessage });
} else if (/audio/.test(mime)) {
await conn.sendMessage(userId, { audio: { url }, mimetype: mime, caption: ownerMessage });
} else if (/sticker/.test(mime)) {
await conn.sendMessage(userId, { sticker: media });
}} else {
await conn.sendMessage(userId, { text: ownerMessage });
}} else {
await conn.sendMessage(userId, { text: `*💬 Respuesta del propietario:*\n${ownerMessage}` });
}
return;
}

if (m.quoted && m.quoted.text) {
let quotedTextMatch = m.quoted.text.match(/ID: (\d+)/);
if (quotedTextMatch) {
let reportId = quotedTextMatch[1];
if (ACTIVE_CONVERSATIONS[reportId] && ACTIVE_CONVERSATIONS[reportId].active) {
let { userId } = ACTIVE_CONVERSATIONS[reportId];
let ownerMessage = m.text || '';

if (/image|video|audio|sticker/.test(m.mtype)) {
let media = await m.download();
let url = await uploadImage(media);
if (/image/.test(m.mtype)) {
await conn.sendMessage(userId, { image: { url }, caption: ownerMessage });
} else if (/video/.test(m.mtype)) {
await conn.sendMessage(userId, { video: { url }, caption: ownerMessage });
} else if (/audio/.test(m.mtype)) {
await conn.sendMessage(userId, { audio: { url }, mimetype: m.mimetype });
} else if (/sticker/.test(m.mtype)) {
await conn.sendMessage(userId, { sticker: media });
}} else {
await conn.sendMessage(userId, { text: `*💬 Respuesta del propietario:*\n${ownerMessage}` });
}
return;
}}}

let matchFin = m.text.match(/^\.fin (\S+)/i);
if (matchFin) {
let [_, reportId] = matchFin;

if (!ACTIVE_CONVERSATIONS[reportId]) return await conn.reply(m.chat, `⚠️ No se encontró ninguna conversación activa con ese ID.`, m);        
let { userId } = ACTIVE_CONVERSATIONS[reportId];
ACTIVE_CONVERSATIONS[reportId].active = false;
await conn.reply(userId, `🔒 *La conversación ha sido cerrada por el propietario.*`);
await conn.reply(m.chat, `✔️ Conversación ${reportId} cerrada.`);
return;
}};
handler.help = ['reporte', 'request'].map(v => v + ' <teks>')
handler.tags = ['info']
handler.exp = 25 
handler.command = /^(report|request|reporte|bugs|bug|report-owner|reportes|reportar)$/i 
handler.private = true
export default handler

*/
let handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text)
throw `${mg}*𝙀𝙨𝙘𝙧𝙞𝙗𝙖 𝙚𝙡 𝙧𝙚𝙥𝙤𝙧𝙩𝙚*\n\n*𝙀𝙅𝙀𝙈𝙋𝙇𝙊:*\n*${usedPrefix + command} el comando ${usedPrefix}infobot no funciona.*\n\n*𝙒𝙧𝙞𝙩𝙚 𝙩𝙝𝙚 𝙧𝙚𝙥𝙤𝙧𝙩*\n\n*𝙀𝙓𝘼𝙈𝙋𝙇𝙀:*\n*${usedPrefix + command} the command ${usedPrefix}owner it does not work.*`
if (text.length < 8) throw `${fg} ✨ *Mínimo 10 caracteres para hacer El Reporte.*\n\n✨ *Minimum 10 characters to make the Report.*`
if (text.length > 1000) throw `${fg} 😼 *Máximo 1000 caracteres para hacer El Reporte.*\n\n😼 *Maximum 1000 characters to make the Report.*`
let teks = `*╭━━[ 𝙍𝙀𝙋𝙊𝙍𝙏𝙀 | 𝙍𝙀𝙋𝙊𝙍𝙏 ]━━━⬣*\n*┃*\n*┃* *𝙉𝙐𝙈𝙀𝙍𝙊 | 𝙉𝙐𝙈𝘽𝙀𝙍*\n┃ ✦ Wa.me/${m.sender.split`@`[0]}\n*┃*\n*┃* *𝙈𝙀𝙉𝙎𝘼𝙅𝙀 | 𝙈𝙀𝙎𝙎𝘼𝙂𝙀*\n*┃* ✦ ${text}\n*┃*\n*╰━━━━━━━━━━━━━━━━━━⬣*`
conn.reply('593968263524@s.whatsapp.net', m.quoted ? teks + m.quoted.text : teks, null, {
contextInfo: {mentionedJid: [m.sender]}
})
conn.reply('573147616444@s.whatsapp.net', m.quoted ? teks + m.quoted.text : teks, null, {
contextInfo: {mentionedJid: [m.sender]}
})
m.reply(
'╰⊱💚⊱ *𝙀́𝙓𝙄𝙏𝙊 | 𝙎𝙐𝘾𝘾𝙀𝙎𝙎* ⊱💚⊱╮\n\n*El reporte ha sido enviado a mí Creadora. Tendrá una respuesta pronto. De ser Falso será Ignorado el reporte.*\n\n*The report has been sent to my Creator. You will have an answer soon. If false, the report will be ignored.*'
)
}
handler.help = ['reporte', 'request'].map((v) => v + ' <teks>')
handler.tags = ['info']
handler.exp = 25
handler.command = /^(report|request|reporte|bugs|bug|report-owner|reportes|reportar)$/i
export default handler
