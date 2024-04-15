import { CreateHostedZoneCommand, DeleteHostedZoneCommand, ListHostedZonesCommand, UpdateHostedZoneCommentCommand }
    from "@aws-sdk/client-route-53"
import { route_53_client_provider } from "../utils/route_53_credentials.js"
import { server_response } from '../utils/server_response.js'
import { cl } from "../utils/console.log.js"

const add_domain = (req, res, next) => {
    const route_53_client = route_53_client_provider()

    if (typeof route_53_client_provider === String) return res.status(503).send(`${route_53_client}`)

    const create_hosted_zone = async () => {
        const create_hosted_zone_command = new CreateHostedZoneCommand({
            Name: req.body.domain_name,
            CallerReference: Date.now().toString(),
            HostedZoneConfig: {
                Comment: req.body.description
            }
        })
        await route_53_client.send(create_hosted_zone_command)
            .then(resp => {
                cl(`Domain (Hosted Zone) added successfully - ${resp.HostedZone.Id}`)
                res.status(200).json(new server_response(200, resp, 'Domain (Hosted Zone) added successfully'))
            })
            .catch(err => {
                cl(`Faced some issue while adding your Domain (Hosted Zone) - ${err}`)
                res.status(400).json(new server_response(400, err, err.message, 'Unsuccessful'))
            })
    }

    const route_53_hosted_zone = async () => {
        await create_hosted_zone()
    }

    route_53_hosted_zone()
}

const get_domains = (req, res, next) => {
    const route_53_client = route_53_client_provider()

    const list_all_the_hosted_zones = async () => {
        const list_hosted_zones_command = new ListHostedZonesCommand({})
        await route_53_client.send(list_hosted_zones_command)
            .then(resp => {
                cl(`List of all Hosted Zones - ${resp}`)
                const domain_details = resp.HostedZones.map(detail => {
                    return {
                        name: detail.Name,
                        id: detail.Id,
                        record_count: detail.ResourceRecordSetCount,
                        description: detail.Config.Comment,
                    }
                })
                res.status(200).json(new server_response(200, domain_details, 'Here you go, all these are your registered ' +
                    'Domains from AWS Route 53',
                ))
            })
            .catch(err => {
                cl(`Error while listing the Hosted Zones - ${err}`)
                res.status(400).json(new server_response(400, err, err.message, 'Unsuccessful'))
            })
    }

    const list_hosted_zones = async () => {
        await list_all_the_hosted_zones()
    }

    list_hosted_zones()
}

const edit_domain_description = (req, res, next) => {
    cl('EDIT')
    const route_53_client = route_53_client_provider()

    const edit_description = async () => {
        const edit_description_command = new UpdateHostedZoneCommentCommand({
            Id: req.body.id, // add the data here
            Comment: req.body.new_description
        })
        await route_53_client.send(edit_description_command)
            .then(resp => {
                cl('Successfully updated the description')
                res.status(200).json(new server_response(200, resp, 'Successfully updated the description'))
            })
            .catch(err => {
                cl("Couldn't update the description due to an unexpected issue")
                res.status(400).json(new server_response(400, err, err.message, "Unsuccessful"))
            })
    }

    const edit_domain = async () => {
        await edit_description()
    }

    edit_domain()
}

const delete_domain = (req, res, next) => {
    const route_53_client = route_53_client_provider()

    const delete_route_53_domain = async () => {
        const delete_domain_command = new DeleteHostedZoneCommand({
            Id: req.body.id
        })
        await route_53_client.send(delete_domain_command)
            .then(resp => {
                cl('Domain deleted successfully')
                res.status(200).json(new server_response(200, resp, 'Domain deleted successfully'))
            })
            .catch(err => {
                cl("Couldn't delete the Domain due to an unexpected issue")
                res.status(400).json(new server_response(400, err, err.message, "Unsuccessful"))
            })
    }

    const delete_domain_route_53 = async () => {
        await delete_route_53_domain()
    }

    delete_domain_route_53()
}

export { add_domain, get_domains, edit_domain_description, delete_domain }