import http from 'http'
import { toBuffer } from 'qrcode'

const PORT = process.env.PORT || 3000

// Health check para Render
const server = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }))
    return
  }
  
  if (req.url === '/get-qr-code') {
    res.writeHead(200, { 'Content-Type': 'image/png' })
    try {
      const qr = global.qr || 'invalid'
      res.end(await toBuffer(qr))
    } catch (e) {
      res.end('')
    }
    return
  }
  
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('GATA_BOT-MD en ejecución')
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// Hacer que el QR esté disponible globalmente
const originalConnect = global.conn?.ev
if (originalConnect) {
  global.conn.ev.on('connection.update', ({ qr }) => {
    if (qr) global.qr = qr
  })
}
