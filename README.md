# Shortcutlistener

A very simple utility to listen for keyboard shortcuts

## Quickstart

### 1. Install

```shell
npm install shortcut-listener
```

### 2. Listen for shortcuts

```typescript
import { ShortcutListener } from "shortcut-listener";

const shortcuts = new ShortcutListener({
  root: document.body, // The element to attach the keyboard events to
});

shortcuts.on("shortcutdown", ({ shortcut, keys, matches }) => {
  // Check against a match function. This checks your shortcut against aliases
  if (matches("cmd+option+j")) {
    console.log("pressed META + ALT + J");
  }

  // Check against a standardized shortcut format
  if (shortcut === "Control+Alt+j") {
    console.log("pressed CTRL + ALT + J");
  }

  // Check against individual keys
  if (keys.has("Control") && keys.has("Alt") && keys.has("j")) {
    console.log("pressed CTRL + ALT + J");
  }
});
```

## Documentation

### 1. Parameters

| Parameter | Description                                  |
| --------- | -------------------------------------------- |
| `root`    | The element to attach the keyboard events to |

### 1. Methods

| Method                                                     | Description             |
| ---------------------------------------------------------- | ----------------------- |
| `on(event: ShortcutEvent, callback: () => ShortcutEvent)`  | Add an eventListener    |
| `off(event: ShortcutEvent, callback: () => ShortcutEvent)` | Remove an eventListener |

### 2. Events

The `on` method provides the following events

| Event          | Description               |
| -------------- | ------------------------- |
| `shortcutdown` | Gets triggered on keydown |
| `shortcutup`   | Gets triggered on keyup   |

### 3. ShortcutEvent

`ShortcutEvent` is a custom event type that is returned by the `on` method. It extends `Event` but has a few extra shortcut specific values.

| Key        | Description                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `shortcut` | A `string` representation of the shortcut. Example `control+shift+j`                             |
| `keys`     | A `Set` with all the keys. Possible values: [`control`, `shift`, `meta`, `alt`, `a`, `b`, `...`] |
| `matches`  | A match function. Uses the following aliases:                                                    |

#### 3.1 Aliasses

| Key:      | Alias for:   |
| --------- | ------------ |
| `up`      | "arrowup"    |
| `down`    | "arrowdown"  |
| `left`    | "arrowleft"  |
| `right`   | "arrowright" |
| ` `       | space"       |
| `plus`    | "+"          |
| `ctrl`    | "control"    |
| `cmd`     | "meta"       |
| `command` | "meta"       |
| `option`  | "alt"        |
| `bksp`    | "backspace"  |
| `del`     | "delete"     |
| `return`  | "enter"      |
| `esc`     | "escape"     |
| `pgup`    | "pageup"     |
| `pgdn`    | "pagedown"   |
