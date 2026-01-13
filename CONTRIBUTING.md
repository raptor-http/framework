# Contributing

## Introduction

Thanks for your interest in Raptor! Contributions of all kinds are welcome - whether you're reporting bugs, suggesting features, improving documentation, or sharing the project with others.

## Ways to Contribute

### Report Issues

Found a bug or have a suggestion? [Create an issue](https://github.com/raptor-http/framework/issues/new/choose) using one of our templates:

- **Bug Report** - Something's not working as expected
- **Feature Request** - Ideas for new features or improvements
- **Documentation Issue** - Docs that are missing, unclear, or incorrect
- **Question** - General questions or discussions

When reporting issues:

- Be specific about the runtime you're using (Deno, Node.js, or Bun)
- Include version numbers for both Raptor and your runtime
- Provide minimal reproduction code when possible
- Describe what you expected vs what actually happened

### Submit Pull Requests

We love pull requests! Here's how to contribute code:

#### Getting Started

```sh
# Fork and clone the repository.
git clone https://github.com/YOUR_USERNAME/raptor-framework.git

cd raptor-framework

# Run tests.
deno task test

# Run tests in watch mode while developing.
deno task test-watch
```

#### Pull Request Guidelines

- **Keep it focused** - One feature or fix per PR
- **Write tests** - New features should include tests
- **Follow the style** - Run `deno fmt` before committing
- **Update docs** - If you change APIs, provide documentation
- **Cross-runtime** - Ensure changes work across Deno, Node.js, and Bun when applicable

#### Code Philosophy

Raptor follows "No boilerplate, maximum clarity":

- Prefer readable code over clever code
- Smart defaults with full control
- Early returns over deep nesting
- Single responsibility methods
- TypeScript-first with proper type safety

#### Commit Messages

Keep commit messages clear and descriptive:

```txt
✅ Good:
- "Add custom error handler validation"
- "Fix processor weight bounds checking"
- "Update context detection for JSON responses"

❌ Avoid:
- "Fix bug"
- "Update stuff"
- "WIP"
```

### Star the Project

The simplest way to show support! A star on [GitHub](https://github.com/raptor-http/framework) helps others discover Raptor.

### Use the Project

The best contribution is using Raptor in your projects:

```sh
# Deno
deno add @raptor/framework

# npm
npx jsr add @raptor/framework

# Yarn
yarn dlx jsr add @raptor/framework

# pnpm
pnpm dlx jsr add @raptor/framework

# Bun
bunx jsr add @raptor/framework
```

- Build something awesome with it
- Report real-world use cases and pain points
- Share your success stories
- Provide feedback on the developer experience

## Development Setup

### Prerequisites

Raptor supports Deno, Bun & Node runtimes. However, the framework has been written with Deno in mind so we recommend using Deno when contributing.

- [Deno](https://deno.com) 2.6.4 or higher
- [Bun](https://bun.com) 1.3.5 or higher
- [Node](https://nodejs.org) 24 or higher
- Git

### Project Structure

```txt
raptor-framework/
├── src/
│   ├── response/          # HTTP handling (Context, Response Management)
│   ├── interfaces/        # TypeScript interfaces and types
│   ├── error/             # Built-in HTTP error classes
|   └── server/            # Server implementations for runtimes
├── examples/              # Example applications
├── tests/                 # Tests
└── mod.ts                 # Entry point
```

### Running Tests

```sh
# Run all tests
deno task test

# Run tests in watch mode
deno task test-watch

# Generate coverage report
deno task test-coverage
```

### Code Quality

```sh
# Format code
deno fmt

# Lint code
deno lint

# Type check
deno check mod.ts
```

## Questions?

- Check out the [documentation](https://raptorframework.com)
- Browse [existing issues](https://github.com/raptor-http/framework/issues)
- Create a [new discussion](https://github.com/raptor-http/framework/issues/new?template=question.yml)
