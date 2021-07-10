#!/usr/bin/env sh

curl_opts='--output /dev/null --silent --head --fail'

until $(curl $curl_opts $OCN_NODE_URL/health); do
    printf 'waiting for node up\n'
    sleep 5
done

printf 'node is up\n'
node deploy.js
