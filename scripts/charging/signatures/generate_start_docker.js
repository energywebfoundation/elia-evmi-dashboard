const Notary = require('@shareandcharge/ocn-notary').default

const notary = new Notary()

notary
    .sign({
        headers: {
            'x-correlation-id': '0',
            'ocpi-from-country-code': 'DE',
            'ocpi-from-party-id': 'EVM',
            'ocpi-to-country-code': 'DE',
            'ocpi-to-party-id': 'EVC',
        },
        body: {
            "response_url": "http://localhost:3001/ocpi/sender/2.2/commands/START_SESSION/0",
            "token": {
                "country_code": "DE",
                "party_id": "EVM",
                "uid": "72583848",
                "type": "APP_USER",
                "contract_id": "DE-EVM-VSA72583848",
                "issuer": "Test MSP b0e927ae-dc32-4ce4-b7ad-963958930898",
                "valid": true,
                "whitelist": "NEVER",
                "last_updated": "2021-08-01T21:48:57.776Z"
            },
            "location_id": "Loc11",
            "evse_uid": "CH-CPO-S11E100001"
        },
    }, 
    process.env.MSP_PRIVATE_KEY)
    .then(() => notary.serialize())
    .then(console.log)