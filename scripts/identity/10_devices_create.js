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
    const devicesCopy = JSON.parse(JSON.stringify(devices || {}))
    for (user of users) {
        const logPrefix = `${user.countryCode}:${user.partyId}`
    
        if (!user.did || !user.did.startsWith('did:ethr:')) {
            console.log(`No did found for ${logPrefix}, skipping...`)
            continue
        }

        // get and filter owned devices
        const belongsToMe = (device => 
            device.country_code === user.countryCode 
            && device.party_id === user.partyId)

        const userDevices = user.role === 'MSP'
            ? tokens.filter(belongsToMe)
            : locations.filter(belongsToMe)

        console.log(`Creating device dids for ${logPrefix}`)
        
        const userKeys = new Keys({ privateKey: user.privateKey })
        const operator = new Operator(userKeys, {
            provider: {
                uriOrInfo: 'https://volta-rpc.energyweb.org',
                type: ProviderTypes.HTTP
            },
            abi: abi1056,
            address: address1056
        })

        const userDid = `did:ethr:${userKeys.getAddress()}`
        if (!devicesCopy[userDid]) {
            devicesCopy[userDid] = []
        }
        
        for (device of userDevices) {
            const deviceId = device.id || device.uid
            
            // check device not already created
            const existent = devicesCopy[userDid]
                .find(registeredDevice => registeredDevice.id === deviceId)

            if (existent && existent.did && existent.did.startsWith('did:ethr:')) {
                console.log(`Device ${deviceId} already registered, skipping...`)
                continue
            }
            
            // create did
            const deviceKeys = new Keys(Keys.generateKeyPair())
            const addr = deviceKeys.getAddress()
            const did = `did:ethr:${addr}`
            
            console.log(`Creating did for ${deviceId} owned by ${logPrefix}`)
            
            // create did document
            const document = new DIDDocumentFull(did, operator)
            const created = await document.create()
            if (created) {
                console.log(`Created did for ${deviceId} (${did})`)
                devicesCopy[userDid].push({
                    id: deviceId,
                    privateKey: deviceKeys.privateKey,
                    did
                })
            } else {
                console.log(`Unable to create did for ${deviceId}`)
            }
        }
    }
    return devicesCopy
}

main()
    .then(updatedDevices => writeFileSync(
            join(__dirname, './identities.json'), 
            JSON.stringify({ users, devices: updatedDevices }, null, 2)
        )
    )
    