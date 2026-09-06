# OpenClaw Workspace & Multi-Layer Zoom Game — Improvement Backlog

Ranked by value. Every item was observed in the repository, not guessed.

## 1. `multi-layer-zoom-game/` contains a copy of itself

`multi-layer-zoom-game/multi-layer-zoom-game/` is a full nested duplicate,
including its own `package.json`, `src/` and `README`. Both copies are
committed. Decide which is canonical and delete the other before they
diverge.

## 2. The game has no tests

`package.json` still ships the Parcel default:
`"test": "echo \"Error: no test specified\" && exit 1"`. At 287 LOC across
`WorldMap`, `RegionLayer`, `DetailLayer`, `TownMap` and `Encounter`, the
zoom-layer transitions are simple enough to test cheaply.

## 3. `src/state/gameState.js` has no persistence

Progress is lost on refresh. `localStorage` plus a version stamp would be
a small change with obvious payoff.

## 4. Workspace identity files are unfilled templates

`IDENTITY.md`, `TOOLS.md` and most of `USER.md` are stock OpenClaw
scaffolding with the placeholders never completed. The agent is running
without the context these files exist to provide.

## 5. `HEARTBEAT.md` is inert

It holds only the "keep this empty to skip heartbeat calls" comment, while
`openclaw status` reports a 30m heartbeat on `main`. Confirm that is
intended.

## 6. Bot coordination rules live in two places

Discord mesh rules appear in both `USER.md` (Bot A/B/C protocol) and
`AGENTS.md` (mesh safety, identity `IMAC-RETINA / QA`). They overlap and
can drift apart. Keep one as the source of truth.

## 7. Discord identifiers are committed to a public repo

Guild `1473224537163305010`, channel `1473224537977126925` and Bot A's user
id are in `USER.md`. Not credentials, but they identify the server. If the
guild's Widget is enabled, the guild id alone allows member enumeration.
Verify Widget is off.

## 8. `package.json.backup.20260524-205450` is committed

A stale backup beside the real manifest. Delete it.

## 9. `build` skips optimisation

`parcel build index.html --no-optimize` ships unminified output. Drop the
flag for real builds.

## 10. `memory/` and `MEMORY.md` are gitignored but undocumented

They are excluded deliberately — `AGENTS.md` says `MEMORY.md` holds
personal context that must not leak to shared contexts. Nothing in the
README explains this to a reader, who may "helpfully" commit them.
