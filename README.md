# Discord Music Bot

A discord bot for listening to music from Youtube and Soundcloud.

It uses a Web Browser to open the links and captures the audio output into the Discord BOT.

## Features

* Play videos from Youtube and Soundcloud on your voice channel
* Search videos by title 
* Play videos directly by youtube link 
* Play Soundcloud links 
* Queue system (add, next, clear)
* Only listen to commands on specific channel
* Currently playing is displayed on Discord bot status
* Loop
* No queue limit
* No video duration limit

## Available commands

### `!play <query>` or `!play <link>`

Starts playing a Youtube video or Soundcloud audio.
If you pass a custom search string, it will first search for the video on youtube.
Then, it will play the video on your current voice channel.

### `!pause`

Pauses the current video.

### `!add <query>` or `!add <link>`

Adds the video to the queue.

Supports links from Youtube and Soundcloud.

Supports search query on Youtube.

### `!queue`

List all videos from queue.

### `!next`

Plays the next video from the queue.

### `!clear`

Clear all videos from queue.

### `!loop`

Enable or disable loop mode for queue.

### `!random`

Enable or disable random mode for queue.

### `!repeat`

Enable or disable repeat mode for current item.


### `!screenshot`

Takes a screenshot of the currently opened link.

## Deployment

You will need a linux machine (local or VPS) with:

* Docker
* docker-compose
* SSH access

Instructions:

* Create a `.env` file based on `.env.example`
* You will need to create a Discord App to get a Discord Token for `.env` file
* Point `SSH_SERVER` and `SSH_FOLDER` to your server SSH connection and deployment folder
* Run `npm run deploy` to deploy evenrything to your server


## Development

You will need:

* NodeJS 16
* Docker
* docker-compose

Folder structure:

* `src/commands`: a typescript file for each command handler
* `src/services`
  * `discord`: service to handle discord API
  * `connection`: service to save voice and text channel state
  * `player`: service to handle player/stream
  * `metadata`: service to handle Youtube and Soundcloud search
  * `stream`: service to handle download stream from Youtube and Soundcloud
  * `queue`: service to store queue state
* `src/index.ts`: entrypoint

Instructions:

* Install dependencies

```
sudo apt update
sudo apt install ffmpeg
```

* Install NodeJS packages

```
npm install
```

* Start BOT

```
npm start
```
