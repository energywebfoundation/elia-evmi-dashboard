const ethers = require('ethers')
const registry = require('./evd-registry.json')

const provider = ethers.getDefaultProvider(process.env.JSON_RPC_URL)
const wallet = new ethers.Wallet(process.env.DEPLOYER_KEY).connect(provider)

const interface = new ethers.utils.Interface(registry.abi)
const contract = new ethers.ContractFactory(interface, registry.bytecode, wallet)

contract.deploy(process.env.OCN_REGISTRY_ADDRESS)
    .then(deployed => console.log('deployed EV Dashboard Registry @', deployed.address))
