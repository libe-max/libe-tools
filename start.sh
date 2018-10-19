#!/bin/bash -e

mongod --dbpath data/ &
cd ./libe-tools-front &&
npm start &
cd ./libe-tools-back &&
npm start
