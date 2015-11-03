!include "MUI2.nsh"

Name "Sup For WhatsApp"
BrandingText " "

# set the icon
!define MUI_ICON "icon.ico"

# define the resulting installer's name:
OutFile "..\dist\SupForWhatsApp.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\Sup For WhatsApp\"

# app dialogs
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN_TEXT "Start Sup For WhatsApp"
!define MUI_FINISHPAGE_RUN "$INSTDIR\SupForWhatsApp.exe"

!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

# default section start
Section

  # delete the installed files
  RMDir /r $INSTDIR

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  File /r ..\build\SupForWhatsApp\win32\*

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall Sup For WhatsApp.exe"

  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\Sup For WhatsApp.lnk" "$INSTDIR\SupForWhatsApp.exe"
  CreateShortCut "$SMPROGRAMS\Uninstall Sup For WhatsApp.lnk" "$INSTDIR\Uninstall Sup For WhatsApp.exe"
  CreateShortCut "$DESKTOP\Sup For WhatsApp.lnk" "$INSTDIR\SupForWhatsApp.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  # delete the installed files
  RMDir /r $INSTDIR

  # delete the shortcuts
  Delete "$SMPROGRAMS\Sup For WhatsApp.lnk"
  Delete "$SMPROGRAMS\Uninstall Sup For WhatsApp.lnk"
  Delete "$DESKTOP\Sup For WhatsApp.lnk"

SectionEnd
