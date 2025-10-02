# Icon Assets

This directory contains icon assets for the Valorant Voice Recorder application.

## Required Icons:

- `icon.ico` - Windows icon (256x256)
- `icon.icns` - macOS icon (512x512) 
- `icon.png` - Linux icon (512x512)

## Creating Icons:

1. **Design**: Create a 512x512 PNG image with your app logo
2. **Convert**: Use online tools to convert to ICO and ICNS formats
3. **Replace**: Replace the placeholder files in this directory

## Current Status:

The build system will work without custom icons, but adding proper icons improves the professional appearance of your application.

For now, electron-builder will use default icons if custom ones are not provided.