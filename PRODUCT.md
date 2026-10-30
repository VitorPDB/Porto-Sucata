# Porto Sucata

Single player web game, mobile-first, Brazilian Portuguese. The player explores a cozy harbor and uses code to restore its machines and help its inhabitants. The canonical product memory is `CONTEXTO_DO_PROJETO.md`; read it with `AGENTS.md` before changes.

## First playable slice

One complete original mission, OF-02, Uma luz para a feira. Player can move within the courtyard, talk to the mechanic/merchant, inspect four pieces, execute read-only SQLite, inspect the returned selection, send the drone and illuminate the stall. Draft, inspection state, player location, delivery checkpoint and completion persist locally. No account, backend, cross-device sync or guaranteed offline support.

## Non-negotiables

Preserve the approved pixel-art cast, muted petroleum/cream/rust palette, overhead-oblique camera, large mobile controls and meaningful selection state. Code is legible text, never a tiny pixel font. The world pauses for the terminal. Query results are real; the drone is an independent controller driven by returned IDs. Incorrect results do not destroy progress. No timers, grind, multiplayer or absence penalties.

## Success

A five-minute session provides a satisfying visible change while teaching SELECT, FROM, WHERE and AND. Equivalent valid queries work. The player understands why the broken lamp and working radio must be excluded. The manual explains the SQLite scope rather than claiming MySQL/Oracle compatibility.

## Scope boundary

The first slice is deliberately small. The other characters, locations and missions remain concept art/design proposals. No automatic expansion into those features. Publishing must use a separate Porto Sucata project and never change the user's existing "so na rede" project or the prior dados-em-curso app.
