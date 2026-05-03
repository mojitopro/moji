import express from 'express'
import { createServer } from 'http'
import { spawn } from 'child_process'
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

// Iniciar servidor web
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// Iniciar el bot de WhatsApp como proceso hijo
console.log('Iniciando bot de WhatsApp...')
const botProcess = spawn('node', ['index.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
})

botProcess.on('exit', (code) => {
  console.log(`Bot process exited with code ${code}`)
  process.exit(code || 0)
})

botProcess.on('error', (err) => {
  console.error('Error starting bot:', err)
})

// Mantener el proceso vivo
setInterval(() => {}, 1000)
