
# Gemini Project Brief: react-deckbuilder

This document provides a summary of the react-deckbuilder project to guide development with Gemini.

## Core Technologies

- **Framework:** React (v19) with Vite
- **Language:** TypeScript
- **State Management:** XState
- **Styling:** CSS Modules, `clsx` for conditional classes
- **Testing:** Vitest, React Testing Library
- **Linting/Formatting:** ESLint, Prettier, TypeScript Compiler (`tsc`)

## Project Structure

The `src/` directory is organized by feature/domain:

- `assets/`: Static assets like images and sounds.
- `components/`: Reusable React components.
- `cards/`: Configuration and assets for individual cards.
- `character-classes/`: Configuration for character classes.
- `helpers/`: Utility functions.
- `machines/`: XState state machine definitions.
- `monsters/`: Configuration and assets for monsters.
- `types/`: TypeScript type definitions.

## Key Scripts

- `npm start`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm test`: Runs the test suite.
- `npm run lint:types`: Checks for TypeScript errors.
- `npm run prettier:write`: Formats the codebase with Prettier.

## Development Workflow

1.  **Create/modify components** in the `src/components` directory.
2.  **Update or create new cards, classes, or monsters** in their respective directories.
3.  **Write tests** for new components and logic in the `__tests__` directories.
4.  **Ensure all tests pass** by running `npm test`.
5.  **Check for type errors** with `npm run lint:types`.
6.  **Format code** with `npm run prettier:write` before committing.
