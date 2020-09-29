const { writeFileSync } = require('fs')
const { join } = require('path')
const { address1056, abi1056, Operator } = require('@ew-did-registry/did-ethr-resolver')
const { DIDDocumentFull } = require('@ew-did-registry/did-document')
const { ProviderTypes } = require('@ew-did-registry/did-resolver-interface')
const { Keys } = require('@ew-did-registry/keys')
const { users, devices } = require('./identities.json')
const locations = require('./devices_cpo.json')
const tokens = require('./devices_msp.json')

const main = async () => {
    // const updatedDevices = [...devices]
    for (user of users) {
    
        if (!user.did || !user.did.startsWith('did:ethr:')) {
            console.log(`did for user ${user.country_code}:${user.party_id} not yet created, skipping...`)
            continue
        }

        // get and filter owned devices
        const belongsToMe = (device => 
            device.country_code === user.country_code 
            && device.party_id === user.party_id)

        const userDevices = user.role === 'MSP'
            ? tokens.filter(belongsToMe)
            : locations.filter(belongsToMe)

        console.log(`creating did for user ${user.country_code}:${user.party_id} devices:`)
        console.log(userDevices.map(device => device.id || device.uid))


        
        const userKeys = new Keys({ privateKey: user.privateKey })
        const operator = new Operator(userKeys, {
            provider: {
                uriOrInfo: 'https://volta-rpc.energyweb.org',
                type: ProviderTypes.HTTP
            },
            abi: abi1056,
            address: address1056
        })
        
        for (device of userDevices) {
            
            // check device not already created
            const existent = devices[`did:ethr:${userKeys.getAddress()}`].find(registeredDevice => 
                registeredDevice.id === device.id 
                || registeredDevice.uid === device.id)

            if (existent && existent.did && existent.did.startsWith('did:ethr:')) {
                console.log('device already registered, skipping...')
                continue
            }
            
            // create did
            const deviceKeys = new Keys(Keys.generateKeyPair())
            const addr = deviceKeys.getAddress()
            const did = `did:ethr:${addr}`
            
            console.log(`creating did ${did} for ${device.id || device.uid} owned by did:ethr:${userKeys.getAddress()}`)

            
            // create did document
            const document = new DIDDocumentFull(did, operator)
            console.log(document)
            // const created = await document.create()
            // if (created) {
            //     console.log(`did created for device of ${user.country_code}:${user.party_id} ${addr}`)
            //     updatedUsers[index].did = did
            // } else {
            //     console.log(`unable to create ${did}`)
            // }
        }
        
        
    }
    return
}

main()
    // .then(updatedDevices => writeFileSync(
    //         join(__dirname, './identities.json'), 
    //         JSON.stringify({ users, devices: updatedDevices }, null, 2)
    //     )
    // )
    