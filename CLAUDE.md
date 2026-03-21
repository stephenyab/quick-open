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

### Composables

1. **usePluginEnter.js** - Handles plugin entry point initialization
2. **useHint.js** - Manages hint/suggestion functionality for quick open entries

### Key Utilities

1. **utoolsUtil.js** - Wrapper functions for uTools database operations (getData, saveData, etc.)
2. **commonUtil.js** - Business logic functions for data handling and form operations
3. **webDavUtil.js** - WebDAV client integration for remote backup/restore
4. **messageCodec.js** - Message encoding/decoding utilities

### Services

1. **entryService.js** - Business logic for managing quick open entries (CRUD operations)
2. **backupService.js** - Backup and restore service for data synchronization

### Configuration

1. **webDavConfig.js** - WebDAV connection settings structure
2. **localConfig.js** - Local backup path configuration

### Rules

1. **formRules.js** - Form validation rules for input fields

### Constants

1. **entryTypes.js** - Entry type definitions (File/Folder, Shell Script)

### Data Types

- **Type 1**: File/Folder opening - Opens the specified path when triggered
- **Type 2**: Shell Script execution - Executes the specified command(s) when triggered

### Key Features

1. **Quick Open Entries** - Users can create keyword shortcuts for files/folders or shell commands
2. **Backup/Restore** - Supports both WebDAV remote backup and local backup
3. **Tabbed Interface** - Separate tabs for managing entries and settings

### Important Dependencies

- Vue 3.5 (Composition API)
- Vuetify 3.8 (UI Components)
- webdav 5.8 (WebDAV client library)
- uTools API (Plugin framework integration)

### Development Notes

- The application uses Vite as the build tool
- Components are organized using Vue's Single File Component structure
- Uses Vuetify for UI components with selective imports
- All data is stored using uTools built-in database
- WebDAV integration allows for cross-device synchronization of quick open entries

### uTools Plugin Integration

- Entry point is handled by `usePluginEnter` composable
- Plugin configuration is defined in `public/plugin.json`
- Preload scripts are located in `public/preload/`
