#!/bin/bash

# run npm install -g @energyweb/ev-asset-operator-cli

assetDid=$(ev-cli generate-key)
echo $assetDid

didParts=(${assetDid//:/ })
echo ${didParts[2]} 

mspKey=0xc88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c

# On local GANACHE
ev-cli add-device \
 --operator-key $mspKey \
 --ev-registry-address 0x9FBDa871d559710256a2502A2517b794B482Db40 \
 --provider-url http://localhost:8544 \
 --device-address ${didParts[2]} \
 --device-uid 72583848

# On the VOLTA chain
ev-cli create-document \
 --operator-key $mspKey \
 --did-registry-address 0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af \
 --provider-url https://volta-rpc.energyweb.org \
 --transfer-amount 0.001 \
 --device-did $assetDid

ev-cli add-claim \
 --operator-key $mspKey \
 --did-registry-address 0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af \
 --provider-url https://volta-rpc.energyweb.org \
 --data-endpoint http://3.122.9.116:5150/vehicle/0123456789ABC \
 --device-did $assetDid