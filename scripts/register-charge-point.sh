#!/bin/bash

# run npm install -g @energyweb/ev-asset-operator-cli

assetDid=$(ev-cli generate-key)
echo $assetDid

didParts=(${assetDid//:/ })
echo ${didParts[2]}

# CPO LOCATIONS
# CH-CPO-S9E100001
# CH-CPO-S9E100002
# CH-CPO-S10E100001
# CH-CPO-S10E100002
# CH-CPO-S11E100001
# CH-CPO-S11E100002
# CH-CPO-S12E100001
# CH-CPO-S12E100002


cpoKey=0x737f5c61de545d32059ce6d5bc72f7d34b9963310adde62ef0f26621266b65dc

# On local GANACHE
ev-cli add-device \
 --operator-key $cpoKey \
 --ev-registry-address 0x9FBDa871d559710256a2502A2517b794B482Db40 \
 --provider-url http://localhost:8544 \
 --device-address ${didParts[2]} \
 --device-uid $1

# On the VOLTA chain
ev-cli create-document \
 --operator-key $cpoKey \
 --did-registry-address 0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af \
 --provider-url https://volta-rpc.energyweb.org \
 --transfer-amount 0.001 \
 --device-did $assetDid

ev-cli add-claim \
 --operator-key $cpoKey \
 --did-registry-address 0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af \
 --provider-url https://volta-rpc.energyweb.org \
 --data-endpoint http://3.122.9.116:5150/vehicle/0123456789ABC \
 --device-did $assetDid
