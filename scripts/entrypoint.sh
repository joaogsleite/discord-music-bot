#!/usr/bin/env bash

pkill Xvfb
Xvfb :1 -ac &
sleep 30
unzip -d adblockplus AdblockPlus.zip
#x11vnc -create -forever -display :1 &
npm start
