import express from 'express'
import cors from 'cors'
import { domain_routes } from './routes/domain.routes.js'
import { dns_routes } from './routes/dns.routes.js'

const serve = express()

serve.use(cors({
    origin: 'http://localhost:3000'
}))
serve.use(express.json())

serve.use('/api/v1/domain', domain_routes)
serve.use('/api/v1/dns', dns_routes)

export { serve }