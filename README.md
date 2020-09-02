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

The following scripts are available (note the env vars; ask maintainer for them):

- Get MSP tokens stored in the Flex backend:
```
SSH_IDENTITY=/path/to/id_rsa sh scripts/get_tokens.sh
```

- Get CPO locations stored in the Flex backend:
```
SSH_IDENTITY=/path/to/id_rsa sh scripts/get_locations.sh
```

- Get sessions stored in the Flex backend:
```
SSH_IDENTITY=/path/to/id_rsa sh scripts/get_sessions.sh
```

- Start a session as MSP on CPO system:
```
MSP_AUTH_TOKEN=xxx MSP_PRIVATE_KEY=0x123xxx789 node scripts/signatures/generate_start.js | sh scripts/signatures/generate_stop.js 
```

- Stop a session as MSP on CPO system:
```
MSP_AUTH_TOKEN=xxx MSP_PRIVATE_KEY=0x123xxx789 SESSION_ID=xxx node scripts/signatures/generate_start.js | sh scripts/signatures/generate_stop.js 
```

Note the stop session script environment variable "SESSION_ID" needs to be sourced from the Flex backend (using the `get_session.sh` script, find the session object you wish to stop: the `id` field (not `_id`) is what you are looking for).