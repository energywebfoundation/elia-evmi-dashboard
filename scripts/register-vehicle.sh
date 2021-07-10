#!/bin/bash

# run npm install -g @energyweb/ev-asset-operator-cli

assetDid=$(ev-cli generate-key)
echo $assetDid

didParts=(${assetDid//:/ })
echo ${didParts[2]}

# MSP TOKENS
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


mspKey=0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b

# On local GANACHE
ev-cli add-device \
 --operator-key $mspKey \
 --ev-registry-address 0x9FBDa871d559710256a2502A2517b794B482Db40 \
 --provider-url http://localhost:8544 \
 --device-address ${didParts[2]} \
 --device-uid $1

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
