# install
copy config.example.js to config.js
npm install

# start server js
npm start

# start app
react-native run-android

# open menu dev
adb shell input keyevent 82

adb logcat | grep ReactNative

# firebase functions
firebase deploy --only functions

# build apk
cd android
./gradlew assembleRelease

# clear cache
./gradlew cleanBuildCache

