# Elia PoC

Scripts and infrastructure config for Flex, OCN components used in the Elia
PoC.

## Maintainer
 - Adam Staveley (`@adamstaveley`)
 - John Henderson (`@jrhender`)


## Usage

Clone this repository and follow the instructions below.

### Install dependencies

Run the script to clone required repositories and initial setup.
```
sh ./setup.sh
```

### Dev environment

Use the `docker-compose.yml` config to spin up a local blockchain, OCN and
Flex backend for development.

```
docker-compose up
```

This will take a while and can sometimes fail because contracts aren't deployed
in time for services that require them, if so just restart).

Once stable (i.e. ev-dashboard-backend and msp/cpo are running - not `waiting for
service up`), you can register users to the EV Dashboard in another shell:
```
sh ./register-users.sh
```

Then you can register assets. The MSP/CPO has pre-configured assets, you just
need to create DIDs for their a given device UID.

```sh
# Vehicle UIDs
# 72583848
# 11352301
# 60782358
# 69695442
# 15465960
# 18777250
# 78959199
# 59748565
# 87007039
# 46014426

sh ./scripts/register-vehicle.sh 72583848

# Charge Point UIDs
# CH-CPO-S9E100001
# CH-CPO-S9E100002
# CH-CPO-S10E100001
# CH-CPO-S10E100002
# CH-CPO-S11E100001
# CH-CPO-S11E100002
# CH-CPO-S12E100001
# CH-CPO-S12E100002
sh ./register-charge-point.sh CH-CPO-S9E100001
```

Now run the frontend:
```
cd ../ev-dashboard-frontend
npm start
```

You can now sign up for the EV Dashboard on http://localhost:4200 using any
metamask account and requesting a role claim (e.g. TSO).

To view your MSP/CPO devices, import their private key (see compose script)
into metamsk and sign up/in.

Diagram of dev setup on local machine:
```
                           +-----------------------+
                           | ev dashboard frontend |
                           +-----------+---------+-+
+-----------------------+              |
|elia-poc docker compose+<-------------+
|  ganache-cli          |
|  ocn-registry         |
|  evd-registry         |
|  ocn node             +
|  msp simulation       |
|  cpo simulation       |
|  flex backend         |
+-----------------------+
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

> Note: deprecated, remaining only for posterity

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
