#!/bin/bash
# Start NeteaseCloudMusicApi on port 3000
cd /workspace/NeteaseCloudMusicApiBackup && node app.js &
sleep 3
# Start proxy server on port 8888 (8080 is occupied by system Python)
cd /workspace/gequhai && PORT=8888 node server.js
