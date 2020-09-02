#!/usr/bin/env bash

cd flex-backend
GIT_SSH_COMMAND="ssh -i ~/.ssh/github_deploy_key" git pull
cd -
sudo docker-compose build flex_backend
sudo docker-compose up --no-deps -d flex_backend