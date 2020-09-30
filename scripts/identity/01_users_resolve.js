const { address1056, abi1056, Resolver } = require('@ew-did-registry/did-ethr-resolver');
const { ProviderTypes } = require('@ew-did-registry/did-resolver-interface');
const { users } = require('./identities.json')

const main = async () => {
    const resolver = new Resolver({
        provider: {
            uriOrInfo: 'https://volta-rpc.energyweb.org',
            type: ProviderTypes.HTTP
        },
        abi: abi1056,
        address: address1056
    })

    const userDocuments = []
    for (user of users) {
        const document = await resolver.read(user.did)
        delete user.privateKey
        userDocuments.push({
            ...user,
            document
        })
    }
    return userDocuments
}

main()
    .then(documents => console.log(JSON.stringify(documents, null, 2)))