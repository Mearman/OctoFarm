#!/bin/sh
mkdir -p /data/db
nohup sh -c mongod --dbpath /data/db &

if [ -d "logs" ]
then
    mkdir -p logs
else
    echo "Logs folder already exists..."
fi

cd /app/

pm2 start app.js --name OctoFarm --no-daemon