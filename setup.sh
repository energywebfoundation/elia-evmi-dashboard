#/usr/bin/env sh


cd ..
git clone git@github.com:energywebfoundation/ev-dashboard-backend.git
git clone git@github.com:energywebfoundation/ev-dashboard-frontend.git
git clone --branch separate-did git@github.com:energywebfoundation/ocn-tools.git

cd ocn-tools
cp src/config/config.docker.ts src/config/config.ts
cd ..

cd ev-dashboard-backend
npm i
cd ..

cd ev-dashboard-frontend
npm i
cd ../elia-poc

npm install -g @energyweb/ev-asset-operator-cli
