# Quick-Start CLI

Scaffold projects from reusable templates with interactive prompts.

## Install (dev)

```
npm install
npm link
```

## Usage

```
quickstart
```

## choose a template (e.g., "basic")

## enter your app name (e.g., "my-app")

## What it does

- Prompts for basic metadata (app name, template).
- Copies files from templates/<template> into <appName>.
- Token-replaces placeholders like {{APP_NAME}}.
- Renames \_gitignore.tmpl → .gitignore, strips .tmpl extensions.

## Development

```
npm test
```

## Uninstall (unlink)

```
npm unlink -g quickstart-cli || true
```
