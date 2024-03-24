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
































// import dotenv from 'dotenv'
// import {
//     Route53Client, CreateHostedZoneCommand, UpdateHostedZoneCommentCommand, DeleteHostedZoneCommand,
//     ListHostedZonesCommand, ChangeResourceRecordSetsCommand
// } from '@aws-sdk/client-route-53'
// import { cl } from "./utils/console.log.js"

// dotenv.config({ path: '../.env' })

// // try to put this in try{} catch{} somehow
// const route_53_client = new Route53Client({
//     region: 'ap-south-1',
//     credentials: {
//         accessKeyId: process.env.ACCESS_KEY_ID,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY
//     }
// })




// /* Create Route 53 Hosted Zone */

// // const create_hosted_zone = async () => {
// //     const create_hosted_zone_command = new CreateHostedZoneCommand({
// //         Name: 'google.com',
// //         CallerReference: Date.now().toString(),
// //         HostedZoneConfig: {
// //             Comment: 'A Hosted Zone and a tribute to Google'
// //         },
// //         // TagSet: [
// //         //     {
// //         //         Key:'',
// //         //         Value
// //         //     },
// //         //     {
// //         //         Key: "Fame",
// //         //         Value: "World Wide",
// //         //     }
// //         //
// //         // ],
// //     })
// //     await route_53_client.send(create_hosted_zone_command)
// //         .then(res => {
// //             cl(`AWS Route 53 Hosted Zone created successfully - ${res.HostedZone.Id}`)
// //         })
// //         .catch(err => {
// //             cl(`Faced some issue while creating Route 53 Hosted Zone - ${err}`)
// //         })
// // }

// // const route_53_hosted_zone = async () => {
// //     await create_hosted_zone()
// // }

// // route_53_hosted_zone()





// /* Edit Route 53 Hosted Zone */

// // const update_description_of_hosted_zone = async () => {
// //     const update_hosted_zone_command = new UpdateHostedZoneCommentCommand({
// //         Id: 'Z03149841ST62LQRQXBEX',
// //         Comment: 'This is a new comment, hope it gets updated'
// //     })
// //     await route_53_client.send(update_hosted_zone_command)
// //         .then(res => {
// //             cl(`Successfully updated the description: ${res}`)
// //         })
// //         .catch(err => {
// //             cl(`Couldn't update the description due to an unexpected error - ${err}`)
// //         })
// // }

// // const update_hosted_zone = async () => {
// //     await update_description_of_hosted_zone()
// // }

// // update_hosted_zone()





// /* Delete Hosted Zone */

// // const delete_hosted_zone = async () => {
// //     const delete_hosted_zone_command = new DeleteHostedZoneCommand({
// //         Id: 'Z03149841ST62LQRQXBEX'
// //     })
// //     await route_53_client.send(delete_hosted_zone_command)
// //         .then(res => {
// //             cl(`Hosted Zone deleted successfully - ${res}`)
// //         })
// //         .catch(err => {
// //             cl(`Delete Unsuccessfully - ${err}`)

// //         })
// // }

// // const hosted_zone_deleter = async () => {
// //     await delete_hosted_zone()
// // }

// // hosted_zone_deleter()





// /* List all the Hosted Zone */

// // const list_all_the_hosted_zones = async () => {
// //     const list_hosted_zones_command = new ListHostedZonesCommand({})
// //     await route_53_client.send(list_hosted_zones_command)
// //         .then(res => {
// //             cl(`List of all Hosted Zones - ${res.HostedZones}`)
// //             res.HostedZones.forEach(hosted_zone => {
// //                 cl(`\n`)
// //                 cl(`ID: ${hosted_zone.Id}`)
// //                 cl(`Name: ${hosted_zone.Name}`)
// //                 cl(`Description: ${hosted_zone.Config.Comment}`)
// //             })
// //         })
// //         .catch(err => {
// //             cl(`Error while listing the Hosted Zones - ${err}`)
// //         })
// // }

// // const list_hosted_zones = async () => {
// //     await list_all_the_hosted_zones()
// // }

// // list_hosted_zones()




// /* Create a record inside a hosted zone */

// const create_a_record_inside_a_hosted_zone = async () => {
//     const changeBatch = {
//         Changes: [
//             {
//                 Action: "CREATE",
//                 ResourceRecordSet: {
//                     Name: 'multivalue.sample.com',  // make sure u include the hosted zone name after the record name
//                     Type: 'CNAME',
//                     TTL: 300,
//                     // Weight: 1,
//                     SetIdentifier: "Multivalue_Idetifier",
//                     ResourceRecords: [
//                         {
//                             Value: 'MultivaluePolicy1'
//                         }
//                     ]
//                 }
//             }
//         ]
//     }
//     const create_record_command = new ChangeResourceRecordSetsCommand({
//         HostedZoneId: 'Z047198034O3UPWPUGRNI',
//         ChangeBatch: changeBatch,
//     })
//     await route_53_client.send(create_record_command)
//         .then(res => {
//             cl("Record created")
//         })
//         .catch(err => {
//             cl(err.message)
//         })
// }

// const create_record = async () => {
//     await create_a_record_inside_a_hosted_zone()
// }

// create_record()