#!/bin/bash -e

cd ./libe-tools-front &&

echo "RUN BUILD"
echo "========================================"
echo ""
echo ""
npm run build &&
git checkout master &&

echo ""
echo "COMMIT IN MASTER/FRONT"
echo "========================================"
echo ""
echo ""
git add .
git commit -a -m "😱 automatic commit via 'npm run prod' in libe-tools repo" || echo "Nothing to commit in libe-tools-front/master" &&

echo ""
echo "PUSH IN MASTER/FRONT"
echo "========================================"
echo ""
echo ""
git push -u origin master &&
cd ../libe-tools-back &&

echo ""
echo "CHECKOUT IN MASTER/BACK"
echo "========================================"
echo ""
echo ""
git checkout master &&
rm -rf ./client &&

echo ""
echo "COMMIT IN MASTER/BACK"
echo "========================================"
echo ""
echo ""
git add .
git commit -a -m "😱 automatic commit via 'npm run prod' in libe-tools repo" || echo "Nothing to commit in ibe-tools-back/master" &&

echo ""
echo "PUSH IN MASTER/BACK"
echo "========================================"
echo ""
echo ""
git push -u origin master &&

echo ""
echo "CHECKOUT PRODUCTION/BACK"
echo "========================================"
echo ""
echo ""
git checkout production &&
rm -rf ./client &&

echo ""
echo "MERGE MASTER/BACK IN PRODUCTION/BACK"
echo "========================================"
echo ""
echo ""
git merge master -m "🍺 pouring master into production" &&
rm -rf ./client &&

echo ""
echo "COPY BUILD/FRONT TO CLIENT/BACK"
echo "========================================"
echo ""
echo ""
cp -r ../libe-tools-front/build ./client &&

echo ""
echo "COMMIT IN PRODUCTION/BACK"
echo "========================================"
echo ""
echo ""
git add .
git commit -a -m "🔥 production ready" || echo "Nothing to commit in production" &&

echo ""
echo "PUSH IN PRODUCTION/BACK"
echo "========================================"
echo ""
echo ""
git push -u origin production &&
git checkout master &&
rm -rf ./client
