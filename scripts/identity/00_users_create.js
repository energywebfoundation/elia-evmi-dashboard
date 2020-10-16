const { writeFileSync } = require('fs')
const { join } = require('path')
const { address1056, abi1056, Operator } = require('@ew-did-registry/did-ethr-resolver');
const { ProviderTypes } = require('@ew-did-registry/did-resolver-interface');
const { Keys } = require('@ew-did-registry/keys')
const { default: DIDRegistry } = require('@ew-did-registry/did-registry')
const { users, devices } = require('./identities.json');
const { DidStore } = require('@ew-did-registry/did-ipfs-store');

const main = async () => {
    const resolver = {
        provider: {
            uriOrInfo: 'https://volta-rpc.energyweb.org',
            type: ProviderTypes.HTTP
        },
        abi: abi1056,
        address: address1056
    }
    const store = new DidStore('https://bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m.ipfs.infura-ipfs.io/')
    
    const updatedUsers = JSON.parse(JSON.stringify(users))

    for ([index, user] of users.entries()) {
        const logId = `${user.countryCode}:${user.partyId}`
    
        if (user.did && user.did.startsWith('did:ethr:')) {
            console.log(`Found ${logId} (${user.did}), skipping...`)
            continue
        }

        console.log(`Creating did for ${logId}`)
        
        const userKeys = new Keys({ privateKey: user.privateKey })
        const did = `did:ethr:${userKeys.getAddress()}`

        const userOperator = new Operator(userKeys, resolver)
        const userRegistry = new DIDRegistry(userKeys, did, userOperator, store)
        
        const created = await userRegistry.document.create()
        if (created) {
            console.log(`Created did for ${logId} (${did})`)
            updatedUsers[index].did = did
        } else {
            console.log(`Unable to create did for ${logId}`)
        }
    }
    return updatedUsers
}

main()
    .then(updatedUsers => writeFileSync(
            join(__dirname, './identities.json'), 
            JSON.stringify({ users: updatedUsers, devices }, null, 2)
        )
    )
    