#/usr/bin/env sh

cd ..
git clone

cd ocn-tools
cp src/config/config.docker.ts src/config/config.ts
cd ..

cd ev-dashboard-backend
npm i
cd ..

cd ev-dashboard-client
npm i -g @microsoft/rush
rush update
rush build
cd ..
