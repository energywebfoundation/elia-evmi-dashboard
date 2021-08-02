#!/usr/bin/env bash

read signature
echo $signature

docker exec -i flex-backend curl --location --request GET 'http://172.16.238.20:8080/ocpi/sender/2.2/locations' \
    --header "authorization: Token c23ed9fc-bc10-449c-a3ba-57182402af4d" \
    --header 'x-request-id: 0' \
    --header 'x-correlation-id: 0' \
    --header 'ocpi-from-country-code: DE' \
    --header 'ocpi-from-party-id: EVM' \
    --header 'ocpi-to-country-code: DE' \
    --header 'ocpi-to-party-id: EVC' \
    --header "ocn-signature: $signature"