clr_scr() {
  tput clear
  tput bold
  tput setaf 2
  if [ -z "$2" ]; then
    echo "MODULE INSTALL SCRIPT"
  else
    echo "MODULE INSTALL SCRIPT : MODE $2"
  fi
  echo ""
  echo "      $1      "
  echo ""
  tput setaf 3
  sleep .5
}

error() {
  tput bold
  tput setaf 1
  echo "MODULE INSTALL SCRIPT : ERROR ⚠ "
  echo ""
  echo "      $1      "
  echo ""
  exit
}

yarnAdd() {
  if [ -z "$2" ]; then
    yarn add "$1" || error "Failed to install $1 in root: $(pwd)"
  else
    yarn add "$1" "$2" || error "Failed to install $1 in root: $(pwd)"
  fi
}

if [ "$1" == "install" ]; then
  clr_scr "Installing packages to root"
  yarn install || error "Failed to install packages in root: $(pwd)"
  clr_scr "Moving to FireJS-Deploy"
  cd ../FireJS-Deploy || error "Failed to move to FireJS-Deploy"
  clr_scr "Installing packages to FireJS-Deploy"
  yarn install || error "Failed to install packages in root: $(pwd)"
elif [ "$1" == "add" ]; then
  if [ -z "$2" ]; then
    error "No package specified"
  fi
  clr_scr "Installing $2 to root" "$3"
  yarnAdd "$2" "$3"
  clr_scr "Moving to FireJS-Deploy" "$3"
  cd ../FireJS-Deploy || error "Failed to move to FireJS-Deploy"
  clr_scr "Installing $2 to FireJS-Deploy" "$3"
  yarnAdd "$2" "$3"
  clr_scr "     DONE (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧"
elif [ -z "$1" ]; then
  error "No command specified"
else
  error "Unknown command $1"
fi