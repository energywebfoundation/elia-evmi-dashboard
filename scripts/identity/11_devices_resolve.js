const { address1056, abi1056, Resolver } = require('@ew-did-registry/did-ethr-resolver');
const { ProviderTypes } = require('@ew-did-registry/did-resolver-interface');
const { devices } = require('./identities.json')

const main = async () => {
    const resolver = new Resolver({
        provider: {
            uriOrInfo: 'https://volta-rpc.energyweb.org',
            type: ProviderTypes.HTTP
        },
        abi: abi1056,
        address: address1056
    })

    const deviceDocuments = []
    for ([user, userDevices] of Object.entries(devices)) {
        for (device of userDevices) {
            const document = await resolver.read(device.did)
            delete device.privateKey
            deviceDocuments.push({
                user,
                ...device,
                document
            })
        }
    }
    return deviceDocuments
}

main()
    .then(documents => console.log(JSON.stringify(documents, null, 2)))