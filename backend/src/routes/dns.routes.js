import { Router } from 'express'
import { create_dns, delete_dns, edit_dns, get_dns } from '../controllers/dns.controllers.js'

const dns_routes = Router()

dns_routes.route('/create').post(create_dns)
dns_routes.route('/get').post(get_dns)
dns_routes.route('/edit').post(edit_dns)
dns_routes.route('/delete').post(delete_dns)

export { dns_routes }