#!/bin/bash

# run npm install -g @energyweb/ev-asset-operator-cli

# Register mock MSP in EV Registry
mspKey=0x388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418
ev-cli add-user \
 --operator-key $mspKey \
 --ev-registry-address 0x9FBDa871d559710256a2502A2517b794B482Db40 \
 --provider-url http://localhost:8544

