import express from 'express'
import { createServer } from 'http'
import { toBuffer } from 'qrcode'
import fetch from 'node-fetch'

function connect(conn, PORT) {
  const app = (global.app = express())
  const server = (global.server = createServer(app))
  let _qr = 'invalid'
  
  conn.ev.on('connection.update', function appQR({qr}) {
    if (qr) _qr = qr
  })
  
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() })
  })
  
  app.get('/get-qr-code', async (req, res) => {
    res.setHeader('content-type', 'image/png')
    res.end(await toBuffer(_qr))
  })
  
  app.get('*', (req, res) => {
    res.json("GATABOT-MD en ejecución")
  })
  
  server.listen(PORT, () => {
    console.log('App listened on port', PORT)
  })
}

export default connect
