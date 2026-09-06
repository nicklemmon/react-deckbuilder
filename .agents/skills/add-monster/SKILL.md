---
name: add-monster
description:
  Design and add a monster to this game, including an approved stat proposal, mode-specific artwork
  generation, and guarded file scaffolding. Use for new standard or rainbow monsters; do not use for
  balancing the existing roster or generating audio files.
---

# Add a Monster

Create one monster at a time. Keep unfinished work in `.monster-drafts/`; only the final scaffold
enters `src/monsters/`.

## Draft

Run `npm run monster -- draft` for an interactive interview. When conducting the interview in
conversation, gather the same information and pass a partial JSON file with
`npm run monster -- draft --input <answers.json>`.

Support either a supplied concept or open ideation. For open ideation, propose one concept for
approval before continuing. If level is omitted, inspect same-mode monsters and recommend a sparse
level band; describe this as roster coverage, not balance.

Users may delegate creative answers with “decide for me.” Replace every delegated value before
validation. Inspect same-mode monsters at nearby levels, then propose stats and gold bounty with a
short rationale. The project has no balance formula: do not claim the proposal is balanced.

Update the draft JSON directly with the refined concept, final creative fields, proposed stats, and
rationale. Then render the exact prompt from the appropriate template in `prompts/monster-art/`:

```bash
npm run monster -- prompt <draft.json>
```

Present the concept, level, stats, rationale, and rendered artwork prompt for review before image
generation. The scaffold command recomputes this prompt and records it in the finalized manifest.

## Artwork

Generate exactly one candidate at a time. Use the local image-generation capability when available;
otherwise return the final prompt and explain that artwork must be supplied before scaffolding.

Immediately after generation, copy the candidate into
`.monster-drafts/<slug>/artwork-candidate.png`; do not leave a reviewable project asset only in an
agent- or provider-specific output directory. Show the candidate inline when supported, and give the
user both a clickable repository file link and a short, single-line command using the path relative
to the repository root, for example `open .monster-drafts/<slug>/artwork-candidate.png`. Keep the
command short enough that chat clients will not insert a newline while copying it, and identify that
it must be run from the repository root. Use the platform-appropriate image-opening command when it
is not `open`. This candidate remains ignored working state and may be replaced only when the user
explicitly requests another image. Verify the copied PNG's actual dimensions before presenting it.
If the generator did not return 1024×1024, normalize the draft copy to exactly 1024×1024 with the
project's existing image tooling; do not alter or delete the generator's original output.

When supported, attach the prompt template’s `reference-image` as style guidance. State that it
defines visual language only and must not be copied. Generate an original 1024×1024 PNG. Preserve
these invariants:

- The image is square and full bleed.
- Framing may vary from close portrait to full-body or group scene.
- The subject faces or directs its energy toward screen-left, the viewer’s left, or remains neutral
  and centered. It never faces, looks, attacks, or moves toward screen-right.
- The image contains no text, logos, frame, card treatment, UI, watermark, or signature.

Ask the user to approve the candidate. Do not automatically generate alternatives. After approval,
rename it to `.monster-drafts/<slug>/artwork.png` and set `artworkSource` to its repository-relative
path. Set `status` to `approved` only after the user has approved the concept, stats, exact prompt,
and artwork.

Audio generation is out of scope. If requested during drafting, preserve optional `audioDirection`
notes for a future ElevenLabs integration; do not create placeholder WAV files.

## Scaffold and verify

Run:

```bash
npm run monster -- validate <draft.json>
npm run monster -- scaffold <draft.json>
npm run qa
```

The scaffold command creates `config.ts`, finalized `manifest.json`, `artwork.png`, and
`artwork.webp`. It may complete a partial directory but never overwrites an existing target file.
Vite discovers the new monster automatically; do not add a registry entry.

Treat the monster as complete only when QA passes. Report optional audio assets as deferred, not
missing requirements.
