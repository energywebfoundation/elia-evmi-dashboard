#!/usr/bin/env bash

signature=$(node signatures/generate_start.js)

curl --location --request POST 'https://device-ev-dashboard.energyweb.org/ocpi/receiver/2.2/commands/START_SESSION' \
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
            "uid": "65658986",
            "type": "APP_USER",
            "contract_id": "XX-12345",
            "issuer": "Test MSP",
            "valid": true,
            "whitelist": "ALWAYS",
            "last_updated": "2019-08-13T14:44:25.561Z"
        },
        "location_id": "Loc13",
        "evse_uid": "CH-CPO-S13E100001"
    }'
