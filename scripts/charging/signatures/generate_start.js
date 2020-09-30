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
                "uid": "0102030405",
                "type": "APP_USER",
                "contract_id": "XX-12345",
                "issuer": "Test MSP",
                "valid": true,
                "whitelist": "ALWAYS",
                "last_updated": "2019-08-13T14:44:25.561Z"
            },
            "location_id": "Loc1",
            "evse_uid": "CH-CPO-S1E100001"
        },
    }, 
    process.env.MSP_PRIVATE_KEY)
    .then(() => notary.serialize())
    .then(console.log)