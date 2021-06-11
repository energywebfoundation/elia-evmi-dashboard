#!/bin/bash

# run npm install -g @energyweb/ev-asset-operator-cli

# Register mock MSP in EV Registry
mspKey=0xc88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c
ev-cli add-user \
 --operator-key $mspKey \
 --ev-registry-address 0x9FBDa871d559710256a2502A2517b794B482Db40 \
 --provider-url http://localhost:8544

