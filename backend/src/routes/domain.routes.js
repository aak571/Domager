import { Router } from "express"
import { add_domain, delete_domain, edit_domain_description, get_domains } from "../controllers/domain.controllers.js"

const domain_routes = Router()

domain_routes.route('/add').post(add_domain)
domain_routes.route('/get').get(get_domains)
domain_routes.route('/edit').post(edit_domain_description)
domain_routes.route('/delete').post(delete_domain)

export { domain_routes }