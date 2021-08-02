#!/usr/bin/env bash

read signature

docker exec -i flex-backend curl --location --request POST 'http://172.16.238.20:8080/ocpi/receiver/2.2/commands/START_SESSION' \
    --header "authorization: Token $MSP_AUTH_TOKEN" \
    --header 'x-request-id: 0' \
    --header 'x-correlation-id: 0' \
    --header 'ocpi-from-country-code: DE' \
    --header 'ocpi-from-party-id: EVM' \
    --header 'ocpi-to-country-code: DE' \
    --header 'ocpi-to-party-id: EVC' \
    --header "ocn-signature: $signature" \
    --header 'content-type: application/json' \
    --data-raw '{
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
    }'