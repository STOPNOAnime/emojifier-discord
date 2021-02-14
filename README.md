# Installation:
```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm

git clone https://github.com/STOPNOAnime/emojifier-discord
cd emojifier-discord/
npm install

sudo npm install -g pm2
pm2 start index.js
pm2 save
pm2 startup systemd
```

Remember to set the correct token.
