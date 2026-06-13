# Contributing to Task Manager Application

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Add upstream: `git remote add upstream <original-repo-url>`
4. Create a feature branch: `git checkout -b feature/your-feature`

## Code Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Format code with Prettier: `npm run format`

### Python

- Follow PEP 8 style guide
- Use type hints where possible
- Write docstrings for functions

### Git Commits

- Use clear, descriptive commit messages
- Format: `[type]: description`
  - `feat:` new feature
  - `fix:` bug fix
  - `refactor:` code refactoring
  - `docs:` documentation
  - `test:` tests

## Testing

- Write tests for new features
- Ensure all tests pass: `npm run test`
- Maintain >80% code coverage

## Pull Request Process

1. Update your branch with latest main: `git fetch upstream && git rebase upstream/main`
2. Ensure all tests pass
3. Create pull request with clear description
4. Respond to code review feedback
5. Wait for approval and merge

## Reporting Issues

- Use GitHub Issues for bug reports
- Include:
  - Description of the issue
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Screenshots/logs if applicable

## Code Review Guidelines

- Be respectful and constructive
- Explain your suggestions
- Ask questions if unclear
- Approve with 👍 or request changes

## Project Structure Guidelines

- Keep components small and focused
- Use meaningful variable names
- Add comments for complex logic
- Follow existing patterns in the codebase

## Questions?

Feel free to open an issue or reach out to the maintainers!
