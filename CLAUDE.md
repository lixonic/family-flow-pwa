# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Family Flow is a privacy-first Progressive Web App (PWA) for family digital wellness and reflection. It's a single-page React application that stores all data locally in localStorage - no server, no accounts, no data collection.

## Architecture

- **Single Page App**: Uses screen-based navigation via `currentScreen` state in App.tsx
- **Local Data Storage**: All data persists in localStorage using `familyFlowData` key
- **Component Structure**: Main screens are in `/components/` with shared UI components in `/components/ui/`
- **PWA Features**: Service worker, manifest.json, offline capability

### Core Data Types (App.tsx:11-47)
- `FamilyMember`: User profiles with avatar, name, color
- `MoodEntry`: Daily mood tracking with emoji and notes  
- `ReflectionEntry`: Screen time reflection responses
- `GratitudeEntry`: Gratitude journal entries
- `AppData`: Container for all family data

### Screen Navigation
The app uses string-based routing in `currentScreen` state:
- `loader` → `day-glow` → `screen-time` → `gratitude` → `breathe` → `memory` → `about`

## Development Commands

This project appears to be a static React app without a traditional build system visible in the current structure. No package.json was found in the root directory.

## Key Constraints

- **Family Limit**: Maximum 6 family members (App.tsx:154)
- **Minimum Members**: At least 1 family member must remain (App.tsx:177)
- **Data Privacy**: All data stays local - never add external APIs or data collection
- **PWA Requirements**: Maintain offline functionality and installability

## Component Patterns

- Screen components receive `familyMembers`, relevant entries, and `onAdd*Entry` callbacks
- Family member management functions: `addFamilyMember`, `updateFamilyMember`, `deleteFamilyMember`
- All state changes go through `updateAppData()` which syncs to localStorage

## PWA Configuration

- Manifest: `/public/manifest.json` with offline shortcuts
- Service Worker: `/public/sw.js` 
- Icons: Expects 192x192 and 512x512 PNG icons
- Theme: Orange/pink gradient design system