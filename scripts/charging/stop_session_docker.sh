#!/usr/bin/env bash

read signature

docker exec -i flex-backend curl --location --request POST 'http://172.16.238.20:8080/ocpi/receiver/2.2/commands/STOP_SESSION' \
    --header "authorization: Token $MSP_AUTH_TOKEN" \
    --header 'x-request-id: 0' \
    --header 'x-correlation-id: 0' \
    --header 'ocpi-from-country-code: DE' \
    --header 'ocpi-from-party-id: EVM' \
    --header 'ocpi-to-country-code: DE' \
    --header 'ocpi-to-party-id: EVC' \
    --header "ocn-signature: $signature" \
    --header 'content-type: application/json' \
    --data-raw "{
        \"response_url\": \"http://localhost:3001/ocpi/sender/2.2/commands/STOP_SESSION/0\",
        \"session_id\": \"$SESSION_ID\"
    }"