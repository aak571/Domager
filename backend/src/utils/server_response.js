class server_response {
    constructor(status, body = {}, message = '{Server has nothing to say}', result = 'Successful') {
        this.status = status
        this.body = body
        this.message = message
        this.result = result
    }
}

export { server_response }