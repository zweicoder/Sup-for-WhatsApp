!include "MUI2.nsh"

Name "WhatsApp"
BrandingText "aluxian.com"

# set the icon
!define MUI_ICON "icon.ico"

# define the resulting installer's name:
OutFile "..\dist\WhatsAppSetup.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\WhatsApp for Desktop\"

# app dialogs
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN_TEXT "Start WhatsApp"
!define MUI_FINISHPAGE_RUN $INSTDIR\WhatsApp.exe

!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

# default section start
Section

  # delete the installed files
  RMDir /r $INSTDIR

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  File /r ..\build\WhatsApp\win32\*

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall WhatsApp for Desktop.exe"

  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\WhatsApp.lnk" "$INSTDIR\WhatsApp.exe"
  CreateShortCut "$SMPROGRAMS\Uninstall WhatsApp for Desktop.lnk" "$INSTDIR\Uninstall WhatsApp for Desktop.exe"
  CreateShortCut "$DESKTOP\WhatsApp.lnk" "$INSTDIR\WhatsApp.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  # delete the installed files
  RMDir /r $INSTDIR

  # delete the shortcuts
  Delete "$SMPROGRAMS\WhatsApp.lnk"
  Delete "$SMPROGRAMS\Uninstall WhatsApp for Desktop.lnk"
  Delete "$DESKTOP\WhatsApp.lnk"

SectionEnd
