#!/usr/bin/env bash

cd ocn-tools
GIT_SSH_COMMAND="ssh -i ~/.ssh/github_deploy_key" git pull
cd -
sudo docker-compose build msp cpo
sudo docker-compose up --no-deps -d msp cpo