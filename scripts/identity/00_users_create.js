const { writeFileSync } = require('fs')
const { join } = require('path')
const { address1056, abi1056, Operator } = require('@ew-did-registry/did-ethr-resolver');
const { DIDDocumentFull } = require('@ew-did-registry/did-document')
const { ProviderTypes } = require('@ew-did-registry/did-resolver-interface');
const { Keys } = require('@ew-did-registry/keys')
const { users, devices } = require('./identities.json');


const main = async () => {
    const updatedUsers = JSON.parse(JSON.stringify(users))
    for ([index, user] of users.entries()) {
        const logId = `${user.countryCode}:${user.partyId}`
    
        if (user.did && user.did.startsWith('did:ethr:')) {
            console.log(`Found ${logId} (${user.did}), skipping...`)
            continue
        }

        console.log(`Creating did for ${logPrefix}`)
        
        const keys = new Keys({ privateKey: user.privateKey })
        const addr = keys.getAddress()
        const did = `did:ethr:${addr}`
    
        const operator = new Operator(keys, {
            provider: {
                uriOrInfo: 'https://volta-rpc.energyweb.org',
                type: ProviderTypes.HTTP
            },
            abi: abi1056,
            address: address1056
        })
    
        const document = new DIDDocumentFull(did, operator)
        const created = await document.create()
        if (created) {
            console.log(`Created did for ${logPrefix} (${did})`)
            updatedUsers[index].did = did
        } else {
            console.log(`Unable to create did for ${logPrefix}`)
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
    