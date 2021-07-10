#!/bin/bash

# run npm install -g @energyweb/ev-asset-operator-cli

# Register mock MSP in EV Registry
mspKey=0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b
ev-cli add-user \
 --operator-key $mspKey \
 --ev-registry-address 0x9FBDa871d559710256a2502A2517b794B482Db40 \
 --provider-url http://localhost:8544

cpoKey=0x737f5c61de545d32059ce6d5bc72f7d34b9963310adde62ef0f26621266b65dc
ev-cli add-user \
  --operator-key $cpoKey \
  --ev-registry-address 0x9FBDa871d559710256a2502A2517b794B482Db40 \
  --provider-url http://localhost:8544
