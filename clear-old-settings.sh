#!/bin/bash

rm .env
rm .firebaserc
rm -rf .firebase
rm -rf node_modules
rm -rf functions/node_modules
cp .env.example .env
git remote rm origin
