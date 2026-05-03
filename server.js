import express from 'express'
import { createServer } from 'http'
import { toBuffer } from 'qrcode'

const PORT = process.env.PORT || 3000
const app = express()
const server = createServer(app)

let _qr = 'QR no disponible aún'

// Health check para Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

app.get('/get-qr-code', async (req, res) => {
  res.setHeader('content-type', 'image/png')
  try {
    res.end(await toBuffer(_qr))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('*', (req, res) => {
  res.json("GATA_BOT-MD en ejecución")
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// Mantener el proceso vivo
setInterval(() => {}, 1000)
