const { writeFileSync } = require('fs')
const { join } = require('path')
const { address1056, abi1056, Operator } = require('@ew-did-registry/did-ethr-resolver');
const { DIDDocumentFull } = require('@ew-did-registry/did-document')
const { ProviderTypes } = require('@ew-did-registry/did-resolver-interface');
const { Keys } = require('@ew-did-registry/keys')
const { users } = require('./identities.json');


const main = async () => {
    const updatedUsers = [...users]
    for ([index, user] of users.entries()) {
    
        if (user.did && user.did.startsWith('did:ethr:')) {
            console.log(`Found ${user.did}, skipping...`)
            continue
        }
        
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
            console.log(`did created for ${user.role} ${addr}`)
            updatedUsers[index].did = did
        } else {
            console.log(`unable to create ${did}`)
        }
    }
    return updatedUsers
}

main()
    .then(updatedUsers => writeFileSync(
            join(__dirname, './identities.json'), 
            JSON.stringify({ users: updatedUsers }, null, 2)
        )
    )
    