const { writeFileSync } = require('fs')
const { join } = require('path')
const { address1056, abi1056, Operator } = require('@ew-did-registry/did-ethr-resolver')
const { ProviderTypes } = require('@ew-did-registry/did-resolver-interface')
const { Keys } = require('@ew-did-registry/keys')
const { DidStore } = require('@ew-did-registry/did-ipfs-store')
const { default: DIDRegistry } = require('@ew-did-registry/did-registry')
const { users, devices } = require('./identities.json')
const locations = require('./devices_cpo.json')
const tokens = require('./devices_msp.json')

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
    
    const devicesCopy = JSON.parse(JSON.stringify(devices || {}))

    for (user of users) {
        const logId = `${user.countryCode}:${user.partyId}`
    
        if (!user.did || !user.did.startsWith('did:ethr:')) {
            console.log(`No did found for ${logId}, skipping...`)
            continue
        }

        // get and filter owned devices
        const belongsToMe = (device => 
            device.country_code === user.countryCode 
            && device.party_id === user.partyId)

        const userDevices = user.role === 'MSP'
            ? tokens.filter(belongsToMe)
            : locations.filter(belongsToMe).map(location => location.evses).reduce((flat, toFlatten) => flat.concat(toFlatten))

        console.log(`Creating device dids for ${logId}`)

        const userKeys = new Keys({ privateKey: user.privateKey })
        const userDid = `did:ethr:${userKeys.getAddress()}`

        const userOperator = new Operator(userKeys, resolver)
        const userRegistry = new DIDRegistry(userKeys, userDid, userOperator, store)

        if (!devicesCopy[userDid]) {
            devicesCopy[userDid] = []
        }
        
        for (device of userDevices) {
            const deviceId = device.evse_id || device.uid
            
            // check device not already created
            const existent = devicesCopy[userDid]
                .find(registeredDevice => registeredDevice.id === deviceId)

            if (existent && existent.did && existent.did.startsWith('did:ethr:')) {
                console.log(`Device ${deviceId} already registered, skipping...`)
                continue
            }
            
            // create did
            const deviceKeys = new Keys(Keys.generateKeyPair())
            const did = `did:ethr:${deviceKeys.getAddress()}`
            
            console.log(`Creating did for ${deviceId} owned by ${logId}`)
            
            // create did document
            const deviceRegistry = new DIDRegistry(deviceKeys, did, userOperator, store)
            const created = await deviceRegistry.document.create()
            if (created) {
                console.log(`Created did (${did})`)
                console.log(`Updating document...`)
                // console.log(deviceKeys.publicKey)
                // const delegated = await document.update(DIDAttribute.Authenticate, {
                //     type: PubKeyType.SignatureAuthentication2018,
                //     algo: Algorithms.ED25519,
                //     encoding: Encoding.HEX,
                //     delegate: userKeys.getAddress()
                // })
                // if (!delegated) {
                //     console.log('Could not add delegate')
                //     continue
                // }
                // console.log('Added delegate')
                // const pubKeyAdded = await document.update(DIDAttribute.PublicKey, {
                //     type: PubKeyType.VerificationKey2018,
                //     algo: Algorithms.ED25519,
                //     encoding: Encoding.HEX,
                //     value: userKeys.publicKey
                // })
                // if (!pubKeyAdded) {
                //     console.log('Could not add public key')
                //     continue
                // }
                // console.log('Added public key')
                console.log('Creating claim...')

                // const subject = deviceRegistry.claims.createClaimsUser()
                // const issuer = userRegistry.claims.createClaimsIssuer()

                // const data = user.role === 'MSP'
                //     ? { capacity_kwh: 50, ac_charge_power_kwh: 11, dc_charge_power_kwh: 170  } // vehicle (model 3)
                //     : { power_type: device.power_type, max_voltage: device.max_voltage, max_amperage: device.max_amperage } // evse
                
                // const claimToken = await subject.createPublicClaim(data, { issuer: userDid })
                // const issuedToken = await issuer.issuePublicClaim(claimToken)
                // const vc = await subject.publishPublicClaim(issuedToken, data)

                devicesCopy[userDid].push({
                    id: deviceId,
                    privateKey: deviceKeys.privateKey,
                    did,
                    // vc
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
    