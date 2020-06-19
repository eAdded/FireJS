FOLDER=../FireJS-Deploy

clr_scr() {
  tput clear
  tput bold
  tput setaf 2
  echo "SYNC SCRIPT"
  echo ""
  echo "      $1      "
  echo ""
  tput setaf 3
  sleep .5
}

error() {
  tput bold
  tput setaf 1
  echo "SYNC: ERROR ⚠ "
  echo ""
  echo "      $1      "
  echo ""
  exit
}

clr_scr "Removing folder $FOLDER"
rm -rf $FOLDER || error "Error removing folder $FOLDER"

clr_scr "Running TypeScript Compiler"
tsc || error "Error compiling ts to js"

clr_scr "Syncing components/*.js Files"
rsync -vr src/components/*.js $FOLDER || error "Error syncing components/*.js files to $FOLDER"

clr_scr "Syncing web/*.js Files"
rsync -vr src/web/*.js $FOLDER/web || error "Error syncing web/*.js files to $FOLDER/web"
clr_scr "Syncing web/*.html Files"
rsync -vr src/web/*.html $FOLDER/web || error "Error syncing web/*.html files to $FOLDER/web"

clr_scr "Syncing package.json"
rsync -v package.json $FOLDER || error "Error syncing package.json files to $FOLDER"
clr_scr "Copying README.md"
rsync -v README.md $FOLDER || error "Error syncing README.md files to $FOLDER"