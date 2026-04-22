# Testing Guide

## Overview

We use Vitest for unit testing. Tests focus on **server actions and utilities**, not React components.

## What to Test

**Test:**
- Server actions (`src/actions/*.ts`)
- Database utilities (`src/lib/db/*.ts`)
- Utility functions (`src/lib/*.ts`)
- Input validation (Zod schemas)
- Error handling logic

**Don't Test:**
- React components
- Next.js pages/app routes
- UI rendering

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

## Test File Location

Place test files next to the files they test:

```
src/
├── actions/
│   └── auth.ts
│   └── auth.test.ts      # Test alongside the file
├── lib/
│   └── db/
│       └── items.ts
│       └── items.test.ts
```

## Test Pattern

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "./myFunction";

describe("myFunction", () => {
  it("should return expected result", () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });

  it("should handle error cases", () => {
    expect(() => myFunction(invalidInput)).toThrow();
  });
});
```

## Coverage

Coverage reports are generated in `coverage/` when running with `--coverage`. We aim for meaningful coverage on utility and action functions, not arbitrary percentage targets.