const { Wallet } = require('@ethersproject/wallet')
const { address1056, abi1056, ProviderTypes, IResolverSettings, Resolver, IServiceEndpoint } = require('@ew-did-registry/did-ethr-resolver');
const { users, devices } = require('./identities.json')

for (user of users) {

    const wallet = new Wallet(user.privateKey)
   
}
