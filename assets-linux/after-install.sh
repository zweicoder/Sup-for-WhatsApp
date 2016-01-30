#!/bin/bash

# Link to the binary
ln -sf /opt/supforwhatsapp/supforwhatsapp /usr/local/bin/supforwhatsapp

# REMEMBER TO CHOWN /OPT/SUPFORWHATSAPP AND CHMOD +X FOR PERMISSION ERRORS

# Launcher icon
desktop-file-install /opt/supforwhatsapp/supforwhatsapp.desktop
