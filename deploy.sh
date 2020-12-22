#!/bin/sh

rm -rf dist .next
git reset --hard HEAD
git pull
yarn install
yarn build

supervisorctl restart kult.cash
