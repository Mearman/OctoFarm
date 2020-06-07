#!/bin/sh
mkdir -p /data/db
nohup sh -c mongod --dbpath /data/db &

if [ -d "node_modules" ] 
then
    echo "Node modules exist, skipping install" 
    echo "Making sure node modules are up to date..."
    npm update
    npm install
else
      echo "Installing node packages"
    npm install
fi

if [ -z "$MONGO" ]
then
	pwd
	echo "" > config/db.js
	tee config/db.js <<EOF >/dev/null
module.exports = {
MongoURI: "mongodb://127.0.0.1:27017/octofarm"
};
EOF

else
        pwd
        echo "" > config/db.js
        tee config/db.js <<EOF >/dev/null
module.exports = {
MongoURI: "${MONGO}"
};
EOF

fi

if [ -d "logs" ]
then
    mkdir -p logs
else
    echo "Logs folder already exists..."
fi

cd /app/

pm2 start app.js --name OctoFarm --no-daemon