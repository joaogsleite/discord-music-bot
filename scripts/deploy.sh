#!/usr/bin/env bash

cd $(dirname "$0")

source ../.env

cd ..

ssh -p $SSH_PORT $SSH_SERVER "mkdir -p $SSH_FOLDER && touch $SSH_FOLDER/state.json"
scp -P $SSH_PORT -r tsconfig.json package.json Dockerfile docker-compose.yml .env src/ $SSH_SERVER:$SSH_FOLDER/
ssh -p $SSH_PORT $SSH_SERVER "cd $SSH_FOLDER && docker-compose down && docker-compose up -d --build"
