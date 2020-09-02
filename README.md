# Elia PoC

Scripts and infrastructure config for Flex, OCN components used in the Elia PoC.

## Maintainer
- Adam Staveley (`@adamstaveley`)

## Usage

### Scripts

Before using any scripts, make sure the following dependencies are met:
- [jq](https://stedolan.github.io/jq/download/) is installed
- node LTS is installed
- `npm install` has been run in the root of the repository

There are several environment variables needed for the scripts to work. Ask the maintainer if you do not already have them. In the below
examples they are used per command, but it is also possible to export them on a per profile basis:

```sh
export SSH_IDENTITY=/path/to/id_rsa
```

The following scripts are available:

- Get MSP tokens stored in the Flex backend:
```sh
SSH_IDENTITY=/path/to/id_rsa sh scripts/get_tokens.sh
```

- Get CPO locations stored in the Flex backend:
```sh
SSH_IDENTITY=/path/to/id_rsa sh scripts/get_locations.sh
```

- Get sessions stored in the Flex backend:
```sh
SSH_IDENTITY=/path/to/id_rsa sh scripts/get_sessions.sh
```

- Start a session as MSP on CPO system. We first generate a signature using the MSP's private key, then pipe it into our start script:
```sh
MSP_PRIVATE_KEY=0x123xxx789 node scripts/signatures/generate_start.js | MSP_AUTH_TOKEN=xxx sh scripts/start_session.sh
```

- Stop a session as MSP on CPO system (same process as above):
```sh
export SESSION_ID=xxx
MSP_PRIVATE_KEY=0x123xxx789 node scripts/signatures/generate_start.js | MSP_AUTH_TOKEN=xxx sh scripts/stop_session.sh.js 
```

Note the environment variable "SESSION_ID" needs to be sourced from the Flex backend. This can be done using the `get_session.sh` script, which returns an array of session objects: find the session you wish to stop and look for the the `id` field (not `_id`). We export it in the above example as both scripts need access to it (signing and sending the id).