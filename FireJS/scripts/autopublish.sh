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

sh sync.sh || error "Error Syncing to $FOLDER"
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