rm -rf dist
git reset --hard HEAD
git pull
yarn install
yarn build
yarn setup

supervisorctl restart kult.cash
