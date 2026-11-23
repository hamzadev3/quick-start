# Quick-Start CLI

![CI](https://github.com/hamzadev3/quick-start/actions/workflows/ci.yml/badge.svg)

Scaffold new Node projects from reusable templates with interactive prompts.

## Install (dev)

```bash
npm install
npm link        # makes the `quickstart` command available globally
```

## Usage

```bash
quickstart
```

You'll be asked for a project name, a description and a template (currently `basic`).

## How it works

1. `src/prompts.js` asks for the project name (validated so it can't contain spaces, slashes or `..`), a description and a template.
2. `lib/templateEngine.js` walks `templates/<template>/` recursively. For each file it:
   - strips `.tmpl` and turns a leading `_` into `.` (`_gitignore.tmpl` → `.gitignore`; npm strips `.gitignore` files when publishing a package, so templates can't ship one directly)
   - replaces `{{APP_NAME}}`, `__APP_NAME__` and `__DESCRIPTION__` in text files; other files are copied byte-for-byte.

## Tests

```bash
npm test
```

## Known limitations

- Only one template (`basic`) so far.
- The description is inserted as-is, so a description containing `"` would break the generated `package.json`.

## Uninstall

```bash
npm unlink -g quickstart-cli
```
