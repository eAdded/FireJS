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

clr_scr "Removing folder $FOLDER"
rm -rf FOLDER
clr_scr "Running TypeScript Compiler"
tsc
clr_scr "Copying .js Files"
rsync -vr src/*.js $FOLDER
clr_scr "Copying package.json"
rsync -v package.json $FOLDER
clr_scr "Copying README.md"
rsync -v README.md $FOLDER
clr_scr "Publishing"
cd ../FireJS-Deploy || exit
if [ -z "$1" ]
  then
   clr_scr "Publishing to latest branch"
   yarn publish --access public
  else
    clr_scr "Publishing to $1 branch"
    yarn publish --access public --tag "$1"
fi