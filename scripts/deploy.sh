#!/bin/bash

cd $(dirname "$0")

cd ..

source .env

ssh -p $SSH_PORT $SSH_SERVER "
  mkdir -p $SSH_FOLDER
  cd $SSH_FOLDER
  touch state.json
  rm -rf src/
"

FILES_TO_SEND="scripts/ src/ .dockerignore docker-compose.yml Dockerfile package-lock.json package.json tsconfig.json"
tar czf - $FILES_TO_SEND | ssh -p $SSH_PORT $SSH_SERVER "cd $SSH_FOLDER && tar xvzf -"
ssh -p $SSH_PORT $SSH_SERVER "cd $SSH_FOLDER && docker-compose down && docker-compose up -d --build"
