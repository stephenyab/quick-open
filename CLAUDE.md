# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 application designed as a uTools plugin for quick file/folder opening and shell script execution. The application allows users to create shortcuts with keywords that can either open files/folders or execute shell commands.

## Key Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production

## Architecture and Structure

### Core Components

1. **App.vue** - Main application component with tabbed interface (List and Settings)
2. **List View (src/views/list.vue)** - Manages the creation, display, and editing of quick open entries
3. **Settings View (src/views/setting.vue)** - Handles WebDAV and local backup/restore functionality

### Key Utilities

1. **utoolsUtil.js** - Wrapper functions for uTools database operations (getData, saveData, etc.)
2. **commonUtil.js** - Business logic functions for data handling and form operations
3. **webDavUtil.js** - WebDAV client integration for remote backup/restore

### Configuration

1. **webDavConfig.js** - WebDAV connection settings structure
2. **localConfig.js** - Local backup path configuration

### Data Types

- **Type 1**: File/Folder opening - Opens the specified path when triggered
- **Type 2**: Shell Script execution - Executes the specified command(s) when triggered

### Key Features

1. **Quick Open Entries** - Users can create keyword shortcuts for files/folders or shell commands
2. **Backup/Restore** - Supports both WebDAV remote backup and local backup
3. **Tabbed Interface** - Separate tabs for managing entries and settings

### Important Dependencies

- Vue 3 (Composition API)
- Vuetify 3 (UI Components)
- webdav (WebDAV client library)
- uTools API (Plugin framework integration)

### Development Notes

- The application uses Vite as the build tool
- Components are organized using Vue's Single File Component structure
- Uses Vuetify for UI components with selective imports
- All data is stored using uTools built-in database
- WebDAV integration allows for cross-device synchronization of quick open entries