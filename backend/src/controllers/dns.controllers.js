import { ChangeResourceRecordSetsCommand, ListResourceRecordSetsCommand } from "@aws-sdk/client-route-53"
import { change_batch_for_edit_dns_provider, change_batch_provider } from "../utils/route_53_change_batch.js"
import { route_53_client_provider } from "../utils/route_53_credentials.js"
import { server_response } from "../utils/server_response.js"
import { cl } from "../utils/console.log.js"

const create_dns = (req, res, next) => {
    const create_dns_route_53 = async () => {
        const route_53_client = route_53_client_provider()

        const change_batch = change_batch_provider('CREATE', req.body.name, req.body.type, req.body.ttl, req.body.record_id, req.body.value)
        const create_record_command = new ChangeResourceRecordSetsCommand({
            HostedZoneId: req.body.hosted_zone_id,
            ChangeBatch: change_batch
        })
        await route_53_client.send(create_record_command)
            .then(resp => {
                cl('Your AWS Route 53 DNS record created successfully')
                res.status(200).json(new server_response(200, resp, 'Your AWS Route 53 DNS record created successfully'))
            })
            .catch(err => {
                cl("Couldn't create DNS record in AWS Route 53 due to an unexpected issue")
                res.status(400).json(new server_response(400, err, err.message, 'Unsuccessful'))
            })
    }

    const dns_create = async () => {
        await create_dns_route_53()
    }

    dns_create()
}

const get_dns = (req, res, next) => {
    const route_53_client = route_53_client_provider()

    const get_all_dns_from_hosted_zone = async () => {
        const get_dns_command = new ListResourceRecordSetsCommand({
            HostedZoneId: req.body.id,
        })
        await route_53_client.send(get_dns_command)
            .then(resp => {
                cl('These are your DNS records in the requested Hosted Zone')
                res.status(200).json(new server_response(200, resp.ResourceRecordSets, 'These are your DNS records in the requested Hosted Zone'))
            })
            .catch(err => {
                cl('Some problem while retrieving DNS records')
                res.status(400).json(new server_response(400, err, err.message, 'Unsuccessful'))
            })
    }

    const get_dns_from_hosted_zone = async () => {
        await get_all_dns_from_hosted_zone()
    }

    get_dns_from_hosted_zone()
}

const edit_dns = (req, res, next) => {
    const route_53_client = route_53_client_provider()
    const edit_the_dns = async () => {
        const change_batch = change_batch_for_edit_dns_provider(
            'DELETE', req.body.name, req.body.type, req.body.ttl, req.body.record_id, req.body.value,
            'CREATE', req.body.name_old, req.body.type_old, req.body.ttl_old, req.body.record_id_old, req.body.value_old
        )

        const edit_dns_command = new ChangeResourceRecordSetsCommand({
            HostedZoneId: req.body.hosted_zone_id,
            ChangeBatch: change_batch
        })
        await route_53_client.send(edit_dns_command)
            .then(resp => {
                cl('Changes saved successfully')
                res.status(200).json(new server_response(200, resp, 'Changes saved successfully'))
            })
            .catch(err => {
                cl(`Couldn't save changes: ${err.message}`) //
                res.status(400).json(new server_response(400, err, err.message, 'Unsuccessful'))
            })
    }

    const edit_dns_of_hosted_zone = async () => {
        await edit_the_dns()
    }

    edit_dns_of_hosted_zone()
}

const delete_dns = (req, res, next) => {
    const route_53_client = route_53_client_provider()

    const delete_the_dns = async () => {
        const change_batch = change_batch_provider('DELETE', req.body.name, req.body.type, req.body.ttl,
            req.body.record_id, req.body.value)
        const delete_dns_command = new ChangeResourceRecordSetsCommand({
            HostedZoneId: req.body.hosted_zone_id,
            ChangeBatch: change_batch
        })
        await route_53_client.send(delete_dns_command)
            .then(resp => {
                cl('Record deleted from AWS Route 53')
                res.status(200).json(new server_response(200, resp, 'Record deleted from AWS Route 53'))
            })
            .catch(err => {
                cl("Couldn't delete the record from AWS Route 53")
                res.status(400).json(new server_response(400, err, err.message, 'Unsuccessful'))
            })
    }

    const delete_dns_from_hosted_zone = async () => {
        await delete_the_dns()
    }

    delete_dns_from_hosted_zone()
}

export { create_dns, get_dns, edit_dns, delete_dns }