FOLDER=../FireJS-Deploy

clr_scr() {
  tput clear
  tput bold
  tput setaf 2
  echo "AUTO PUBLISH SCRIPT"
  echo ""
  echo "      $1      "
  echo ""
  tput setaf 3
  sleep 0.5
}

error(){
  tput bold
  tput setaf 1
  echo "AUTO PUBLISH SCRIPT : ERROR ⚠ "
  echo ""
  echo "      $1      "
  echo ""
  exit
}


clr_scr "Removing folder $FOLDER"
rm -rf FOLDER || error "Error removing folder $FOLDER"
clr_scr "Running TypeScript Compiler"
tsc || error "Error compiling ts to js"
clr_scr "Copying .js Files"
rsync -vr src/*.js $FOLDER || error "Error syncing .js files to $FOLDER"
clr_scr "Copying package.json"
rsync -v package.json $FOLDER || error "Error syncing package.json files to $FOLDER"
clr_scr "Copying README.md"
rsync -v README.md $FOLDER || error "Error syncing README.md files to $FOLDER"
clr_scr "Publishing"
cd ../FireJS-Deploy || error "Error moving to $FOLDER"
if [ -z "$1" ]; then
  clr_scr "Publishing to latest branch"
  yarn publish --access public || error "Error publishing"
else
  clr_scr "Publishing to $1 branch"
  yarn publish --access public --tag "$1" || error "Error publishing"
fi
clr_scr "Installing deps"
yarn install || error "Error ReInstalling packages to $FOLDER"
clr_scr "     DONE (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧"