#!/usr/bin/env bash

Xvfb :1 -ac &
sleep 10
x11vnc -create -forever -display :1 &
npm start
