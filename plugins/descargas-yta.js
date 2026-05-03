import fetch from 'node-fetch'
import yts from 'yt-search'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import ytdl from 'ytdl-core'

const LimitAud = 700 * 1024 * 1024 // 700MB

let handler = async (m, { text, conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${lenguajeGB['smsAvisoMG']()}${mid.smsMalused7}\n*${usedPrefix + command} https://youtu.be/c5gJRzCi0f0*`,
      fkontak,
      m
    )
  }

  
  const yt_play = await search(args.join(' '))
  let youtubeLink = ''
  const arg0 = (args[0] || '').trim()

  if (isYouTubeUrl(arg0)) {
    youtubeLink = arg0
  } else if (/^\d+$/.test(arg0)) {
    const index = parseInt(arg0, 10) - 1
    if (index >= 0) {
      if (Array.isArray(global.videoList) && global.videoList.length > 0) {
        const matchingItem = global.videoList.find((item) => item.from === m.sender)
        if (matchingItem) {
          if (index < matchingItem.urls.length) youtubeLink = matchingItem.urls[index]
          else throw `${lenguajeGB['smsAvisoFG']()}${mid.smsYT} ${matchingItem.urls.length}*`
        } else {
          throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
        }
      } else {
        throw `${lenguajeGB['smsAvisoMG']()}${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
      }
    }
  } else {
  }

  await conn.reply(m.chat, lenguajeGB['smsAvisoEG']() + mid.smsAud, fkontak, m)

  const [_, qualityArg = '320'] = (text || '').split(' ')
  const validQualities = ['64', '96', '128', '192', '256', '320']
  const selectedQuality = validQualities.includes(qualityArg) ? qualityArg : '320' 

  try {
    const target = youtubeLink || yt_play?.[0]?.url
    if (!target) throw new Error('No se encontró URL válida de YouTube ni resultados de búsqueda.')

    const info = await ytdl.getInfo(target)
    const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' })
    if (!format?.url) throw new Error('No se encontró formato de audio')
    const audioUrl = format.url
    const mimetype = format.mimeType?.split(';')[0] || 'audio/mpeg'

    // Descargar buffer directamente para evitar URLs expiradas
    const audioRes = await fetch(audioUrl)
    if (!audioRes.ok) throw new Error(`Error al descargar audio: ${audioRes.status}`)
    const audioBuffer = await audioRes.arrayBuffer()
    if (!audioBuffer || audioBuffer.length === 0) throw new Error('Buffer de audio vacío o inválido')

    const fileName = `${sanitizeFilename(yt_play?.[0]?.title || 'audio')}.mp3`

    if (audioBuffer.length > LimitAud) {
      await conn.sendMessage(
        m.chat,
        {
          document: audioBuffer,
          mimetype: mimetype,
          fileName
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          audio: audioBuffer,
          mimetype: mimetype,
          fileName
        },
        { quoted: m }
      )
    }
  } catch (e) {
    console.log(`Error en hiudyy ytmp3`)
    try {
      const target = youtubeLink || yt_play?.[0]?.url
      if (!target) throw new Error('No se encontró URL válida de YouTube ni resultados de búsqueda.')

      const sanka = await getFromSanka(target)
      const audioUrl = sanka.download
      const title = yt_play?.[0]?.title || sanka.title || 'audio'
      const fileName = `${sanitizeFilename(title)}.mp3`

      // Descargar buffer directamente
      const audioRes = await fetch(audioUrl)
      if (!audioRes.ok) throw new Error(`Error al descargar audio de Sanka: ${audioRes.status}`)
      const audioBuffer = await audioRes.arrayBuffer()
      if (!audioBuffer || audioBuffer.length === 0) throw new Error('Buffer de audio de Sanka vacío')

      if (audioBuffer.length > LimitAud) {
        await conn.sendMessage(
          m.chat,
          {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName
          },
          { quoted: m }
        )
      } else {
        await conn.sendMessage(
          m.chat,
          {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName
          },
          { quoted: m }
        )
      }
    } catch (e2) {
      console.log(`❌ Error Sanka Vollerei: ${e2?.message || e2}`)
      await conn.reply(
        m.chat,
        `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`,
        fkontak,
        m
      )
    }
  }
}

handler.command = /^audio|fgmp3|dlmp3|getaud|yt(a|mp3)$/i
export default handler

async function search(query, options = {}) {
  const search = await yts.search({ query, hl: 'es', gl: 'ES', ...options })
  return search.videos
}

async function getFileSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return parseInt(res.headers.get('content-length') || 0)
  } catch {
    return 0
  }
}

function sanitizeFilename(name = 'audio') {
  return String(name).replace(/[\\/:*?"<>|]/g, '').slice(0, 200)
}

function isYouTubeUrl(u = '') {
  try {
    const { hostname } = new URL(u)
    return /(^|\.)youtube\.com$/.test(hostname) || /(^|\.)youtu\.be$/.test(hostname)
  } catch {
    return false
  }
}

async function getFromSanka(youtubeUrl) {
  const endpoint = `https://www.sankavollerei.com/download/ytmp3?apikey=planaai&url=${encodeURIComponent(youtubeUrl)}`
  const res = await fetch(endpoint)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json().catch(() => null)
  if (!json?.status || !json?.result?.download) {
    throw new Error('Respuesta inválida de Sanka Vollerei')
  }

  return {
    download: json.result.download,
    title: json.result.title,
    duration: json.result.duration,
    thumbnail: json.result.thumbnail
  }
}
