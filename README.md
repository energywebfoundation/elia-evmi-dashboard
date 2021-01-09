# Elia PoC

Scripts and infrastructure config for Flex, OCN components used in the Elia
PoC.

## Maintainer
- Adam Staveley (`@adamstaveley`)


## Usage

### Dev environment

Use the `docker-compose.dev.yml` config to spin up a local blockchain, OCN and
Flex backend for development.

You should have a directory containing `elia-poc`, `flex-backend`, `ocn-tools` and `iam-cache-server`:
```sh
git clone git@github.com:energywebfoundation/elia-poc.git
git clone --branch ocn-bridge-component git@github.com:energywebfoundation/flex-backend.git
git clone --branch ev-dashboard-simulators git@github.com:energywebfoundation/ocn-tools.git
git clone git@github.com:energywebfoundation/iam-cache-server.git
``` 

Additionally the `ocn-tools` repository needs minor setup:
```sh
cd ocn-tools
cp src/config/config.docker.ts src/config/config.ts
```

Next, setup the `iam-cache-server` for development as per its README.

Once ready, run `docker-compose` to start up the iam-cache-server and elia-poc:

```
cd iam-cache-server
docker-compose -f docker-compose.dev.yml up
cd -
docker-compose -f docker-compose.dev.yml up
```

Diagram of dev setup on local machine:
```
                           +-----------------------+
                           | ev dashboard frontend |
                           +-----------+---------+-+
+-----------------------+              |         |
|elia-poc docker compose+<-------------+   +-----v---------------------------+
|  ganache-cli          |                  | iam-cache-server docker compose |
|  ocn-registry         |                  |   iam-cache-server app          |
|  evd-registry         |                  |   dgraph ratel                  |
|  ocn node             +----------------->+   dgraph zero                   |
|  msp simulation       |                  |   dgraph alpha                  |
|  cpo simulation       |                  |   nats                          |
|  flex backend         |                  |   redis                         |
+-----------------------+                  +---------------------------------+
```


### Registry contract

ABI and Address of contract deployed on Volta can be found in `contracts/evd-registry.json`

### Scripts

A mix of shell and nodeJS scripts are provided for interacting with the PoC
infrastructure. 

Before using the following scripts, make sure the following dependencies are 
met:
- [jq](https://stedolan.github.io/jq/download/) is installed
- node LTS is installed
- `npm install` has been run in the root of the repository

There are several environment variables needed for the scripts to work. Ask the
maintainer if you do not already have them. In the below examples they are used
per command, but it is also possible to export them on a per profile basis.

```sh
export SSH_IDENTITY=/path/to/id_rsa
```

#### Charging

These scripts allow for starting and stopping charging sessions. They can be 
found in the `scripts/charging` directory. 

- Get MSP tokens stored in the Flex backend:
```sh
SSH_IDENTITY=/path/to/id_rsa sh get_tokens.sh
```

- Get CPO locations stored in the Flex backend:
```sh
SSH_IDENTITY=/path/to/id_rsa sh get_locations.sh
```

- Get sessions stored in the Flex backend:
```sh
SSH_IDENTITY=/path/to/id_rsa sh get_sessions.sh
```

- Start a session as MSP on CPO system. We first generate a signature using the
MSP's private key, then pipe it into our start script:
```sh
MSP_PRIVATE_KEY=0x123xxx789 node signatures/generate_start.js | MSP_AUTH_TOKEN=xxx sh start_session.sh
```

- Stop a session as MSP on CPO system (same process as above):
```sh
export SESSION_ID=xxx
MSP_PRIVATE_KEY=0x123xxx789 node generate_start.js | MSP_AUTH_TOKEN=xxx sh stop_session.sh 
```

Note the environment variable "SESSION_ID" needs to be sourced from the Flex
backend. This can be done using the `get_session.sh` script, which returns an
array of session objects: find the session you wish to stop (i.e. one with an
"ACTIVE" status) and look for the the `id` field (not `_id`). We export it in
the above example as both scripts need access to it (signing and sending the 
id).

#### Identity

These scripts enable the creation of DIDs for business users and their
managed devices. They are available in the `scripts/identity` directory.
Here, operations are performed in bulk using an `identities.json` file.
An example file has been provided, which you should copy:

```
cp identities.example.json identities.json
```

Populate the users array with the business users you wish to create 
DIDs for first. Simply add the private key, party id and country code.
Note the private key should have funds to pay for the DID creation 
(transaction).

**Create business user DIDs**
```
node 00_users_create.js
```

The script will save the newly created DIDs in `identities.json` for each
entry in the "users" array. Note it will skip the operation if a DID 
already exists for the user.

**Resolve user DID documents**

To fetch the stored docuemnts, run the script:
```
node 01_users_resolve.js
```

**Create DIDs for DERs**

First we must fetch the devices over the OCN. We can do that with the 
shell scripts in the `charging` directory. We want to place our cached
data in the `identity` directory for our DID script to read it.

```
sh scripts/charging/get_tokens.sh > scripts/identity/devices_msp.json
sh scripts/charging/get_locations.sh > scripts/identity/devices_cpo.json
```

Now that we have our device data, we can create their DIDs. Simply run:

```
node 10_devices_create.js
```

The script will read the users, find their devices from our data files,
create their keypair and DID. The output can be found in `identities.json`.

**Resolve device DID documents**

To fetch the stored documents, run:
```
11_devices_resolve.js
```


### Infra

Infrastructure currently runs on two instances: web (flex) and device
(msp/cpo simulations).

Within each instance the setup is the same. We use docker-compose to manage our
OCN Node (and its database), as well as any application servers (flex-backend,
ocn-tools). We also have a deploy script to update and re-build the application
docker image.

Several parameters specific to the application and its OCN Node need to be setup
first, including:
- private keys
- database passwords
- ocpi tokens
- api keys

These need to be configured in environment variables in `docker-compose.yml` or
in the node's `application.properties`.

Once setup, general compose usage is as follows:

- Start all services:
```
docker-compose up -d
```

- Rebuild and start a service (declared in `docker-compose.yml`):
```
docker-compose build <service_name>
docker-compose up -d --no-deps <service_name>
```

- Check logs of a service:
```
docker-compose logs -f <service_name>
```
