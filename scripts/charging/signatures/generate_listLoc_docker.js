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
        },
    }, 
    process.env.MSP_PRIVATE_KEY)
    .then(() => notary.serialize())
    .then(console.log)