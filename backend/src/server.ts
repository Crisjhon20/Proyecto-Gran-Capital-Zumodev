import { serve } from '@hono/node-server'
import app from './app.js'
import { getEnv } from './config/env.js'

const { PORT } = getEnv()

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Gran Capital API escuchando en http://localhost:${info.port}`)
})
