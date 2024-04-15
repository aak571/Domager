import { Route53Client } from '@aws-sdk/client-route-53'

// dotenv.config({ path: '../.env' })

// try to put this in try{} catch{} somehow
const route_53_client_provider = () => {
    try {
        const route_53_client = new Route53Client({
            region: 'ap-south-1',
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY
            }
        })
        return route_53_client
    }
    catch {
        return 'Not able to connect with the AWS Cloud Provider at the moment'
    }
}

export { route_53_client_provider }