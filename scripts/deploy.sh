#!/usr/bin/env bash

cd $(dirname "$0")

source ../.env

cd ..

ssh $SSH_SERVER "mkdir -p $SSH_FOLDER"
scp -r tsconfig.json package.json docker-compose.yml .env src/ $SSH_SERVER:$SSH_FOLDER/
ssh $SSH_SERVER "cd $SSH_FOLDER && docker-compose down && docker-compose up -d"
