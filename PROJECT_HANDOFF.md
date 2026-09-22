# PROJECT HANDOFF — BLOQUE vastgoed website

## 1. Project identity

- **Project name:** BLOQUE vastgoed website (werkversie, oorspronkelijk KRAVT homepage)
- **Purpose:** Een bestaande KRAVT/Webflow-homepage lokaal reconstrueren en herpositioneren als BLOQUE vastgoed: “Meer rendement / uit bestaand / vastgoed”.
- **Stage:** Visuele homepage-rebuild en eerste merktransformatie zijn geïmplementeerd en privé gepubliceerd; verdere polish is nodig.
- **Root:** `/Users/drl./Documents/Codex/2026-09-15/kun`
- **Languages:** HTML, CSS, JavaScript; inline SVG.
- **Framework/runtime:** Geen framework; statische Webflow-export met originele Webflow/Slater JavaScript, GSAP, Barba, Lenis, ScrollTrigger, HLS.
- **Package manager:** Geen package.json; geen installatiestap.
- **Database/auth:** Geen.
- **Hosting:** OpenAI Sites, statische `dist` output, Cloudflare-backed deployment.
- **Git:** branch `main`; HEAD `533b0eb487782fcd2a158d32f7c1ad8286e609b2`.
- **Working tree:** Git-trackte code is clean; `outputs/` en `work/` zijn bewust untracked overdrachts-/artifactbestanden.
- **Remote:** Sites source repository URL is credential-protected and is intentionally not repeated here. Use `.openai/hosting.json` for the project ID; never copy tokens into files.

From the user's perspective this is a private hosted visual homepage with the original KRAVT structure and animations, altered toward BLOQUE vastgoed. The first screen has the original hero composition, a light `#F3F4EF` ground, dark BLOQUE 3D hero image, and updated Dutch positioning copy. The long orange/white intro section contains the original large “Hallo” SVG animation and transitions toward a vertical BLOQUE mark.

## 2. Requirements reconstructed from the conversation

### Must have

- Rebuild the supplied KRAVT homepage from `/Users/drl./Downloads/KRAVT® – Building brands for a complex world.html` and its `_files` directory.
- Preserve the original layout, typography, imagery, animation intent, navigation, sections and responsive behavior as far as the supplied static export permits.
- Replace visible KRAVT branding with BLOQUE where requested.
- Hero payoff, exactly three lines: `Meer rendement` / `uit bestaand` / `vastgoed`.
- Intro/company line: `BLOQUE vastgoed` and `ontwikkelt, splitst en transformeert bestaand vastgoed`.
- Restore the original orange-and-white “Hallo” intro animation and have the transition reveal vertical BLOQUE.
- Add the small registered mark `®` at the lower right of the final E, matching the original KRAVT treatment.
- Use the Jordan Gilroy light-page background reference as the hero ground color: extracted `#F3F4EF`.

### Should have

- Preserve the original matte, dark letter material, letter scale/height, perspective, shadows, and recessed L/Q treatment in the generated hero image.
- Keep hero foreground readable on the light background; current implementation switches the hero theme and logo filters accordingly.

### Nice to have / later

- Replace remaining KRAVT copy throughout all sections, footer, metadata and links.
- Replace or rebuild original video/case assets where BLOQUE-specific material becomes available.
- Obtain the original 3D source to make the hero letters pixel/geometry-identical.

### Out of scope so far

- No database, CMS, authentication, forms, analytics, or backend API.
- No public sharing; the Site remains owner-only/private.
- No destructive cleanup of source assets.

## 3. Current state

### Complete

- Static source copied into `dist/`, with all supplied local assets under `dist/assets/`.
- `.openai/hosting.json` configured with `static.directory = dist` and project ID `appgprj_6aa9a7acfbf88191a8e9fca0dc5cb799`.
- Homepage deployed privately at `https://kravt-werkversie.darrylthompson.chatgpt.site`.
- Original page JS is present and syntax-checked with `node --check`.
- Hero copy and three explicit payoff lines are implemented.
- Hero image currently points to `dist/assets/bloque-hero-light-v3.png`.
- Original orange intro section and Hallo SVG are present; saved runtime transform offsets were removed from the captured SVG so the animation can start cleanly.
- Vertical BLOQUE SVG mark exists in `.home-intro__logo`; a small inline SVG registered mark was appended to its final E.

### Partial / needs verification

- Browser visual verification after the latest deployment was not performed manually; only deployment status and source assertions were checked.
- The generated hero image approximates the original 3D letters. It is not a true geometry-preserving edit because no editable 3D source was supplied.
- The existing animation script may still interact with the newly added inline SVG registered mark in ways that need browser testing.
- The site still contains many original KRAVT names, URLs, case descriptions and footer references outside the hero.

### Known mismatch

- `dist/index.html` is a captured Webflow DOM with some inline styles from the original page. The current edit removed the most problematic saved SVG transforms, but other saved runtime styles may remain in lower sections.

## 4. Architecture

This is a static single-page site:

```text
dist/index.html
  ├─ original Webflow HTML + inline SVG sections
  ├─ assets/kravt.webflow.shared...css + 22963.css
  ├─ assets/18347.js + 18348.js (Slater/custom behavior)
  └─ vendor JS (GSAP, ScrollTrigger, Lenis, Barba, Webflow, jQuery, HLS)
        ↓
OpenAI Sites static hosting (static.directory=dist)
```

There is no server application or data flow. Browser JS initializes page transitions, smooth scrolling, split text, ScrollTrigger animations, Mondriaan/case slider, quote slider and lazy video behavior. Several videos still use original `kravtcdn.b-cdn.net` URLs.

## 5. Repository map

```text
.
├── .openai/hosting.json       # Sites project ID + static output directory
├── dist/index.html             # Complete static homepage
├── dist/assets/                # Supplied Webflow assets, vendor scripts, generated hero images
├── outputs/                    # Human-reviewable generated BLOQUE background variants
├── work/                       # Packaging archives and Jordan reference inspection files
├── PROJECT_HANDOFF.md          # This transfer document
├── OPEN_TASKS.md               # Prioritized continuation work
└── FILE_MANIFEST.md            # Important files and artifact inventory
```

## 6. Read first

1. `PROJECT_HANDOFF.md` — decisions, known issues, exact stopping point.
2. `.openai/hosting.json` — Sites project and static output configuration.
3. `dist/index.html` — all sections, hero copy, intro SVG and current asset references.
4. `dist/assets/18348.js` — page transitions, scroll animations, split text, sliders, video behavior.
5. `dist/assets/22963.css` — custom sizing/layout overrides.
6. `dist/assets/kravt.webflow.shared.299df9135.css` — original Webflow theme and components.
7. `dist/assets/bloque-hero-light-v3.png` — current generated hero background.
8. `outputs/bloque-achtergrond-licht-v3.png` — same generated background for review.

## 7. Important implementation details

- The original saved page contained runtime-generated inline transforms and cloned slider nodes. Those captured states are not authoritative source; avoid blindly preserving new runtime snapshots.
- Hero image replacement is a bitmap edit, not a real 3D asset. The original supplied hero source is `66a25fbf2aca7cf80f19e4d3_Ebene-541-edit.jpg`; it contains the original KRAVT forms only as pixels.
- Jordan Gilroy’s archive page was inspected. Its light theme defines `--swatch--light:#f3f4ef`; this is the color used for the new hero ground.
- The original hero section was dark. Current HTML adds `data-theme-section="light"` plus an inline style block to make the light hero readable. Keep the text/logo contrast when changing the hero treatment.
- The payoff is wrapped in three `.bloque-payoff-line` spans with `display:block; white-space:nowrap`. This intentionally fixes the requested line breaks.
- The original JS uses `[data-split-text="words"]`; any future copy changes should be tested with the split-text initialization, since nested spans can be split or wrapped.
- The custom registered mark is an inline SVG appended to the final BLOQUE letter SVG, translated approximately beside the E. It is not currently a separate semantic text node.

## 8. Decision log

- Reuse the supplied static Webflow page rather than reimplementing it in a new framework: preserves the original visual system and reduces scope.
- Use plain static Sites hosting: no backend or persistence was requested.
- Replace only requested brand/copy first; avoid speculative redesign.
- Use generated raster hero edits because the supplied package had no `.blend`, `.c4d`, `.fbx`, `.obj`, `.glb` or `.gltf` source and the hero letters are baked into a JPG.
- Keep the Site private; the deployment access policy is custom owner-only with one allowed user, zero external visitors and zero groups.
- Do not generate a social preview; the user did not request one.

## 9. User preferences established

- User wants direct implementation and visual iteration, with short progress updates.
- User cares strongly about exact visual fidelity: same matte material, color, height, perspective, shadows and recessed L/Q.
- Preserve existing layout/animation and change only the explicitly requested copy or brand treatment.
- User prefers Dutch copy and concise confirmation.

## 10. Git and uncommitted work

Current branch: `main`.

HEAD: `533b0eb487782fcd2a158d32f7c1ad8286e609b2` (`Restore Hallo SVG animation starting state and add BLOQUE registered mark`).

Recent commits:

- `533b0eb` restore Hallo SVG start state and add BLOQUE ® mark
- `df80116` set payoff to three fixed lines
- `c7ed32e` update hero payoff and BLOQUE vastgoed introduction
- `1110cac` apply Jordan-inspired off-white hero ground
- `f1dfd80` refine matte hero material and recessed L/Q
- `ce6ba48` replace opening hero image with BLOQUE 3D lettering
- `f8ef02d` replace animated background wordmark
- `c8e9931` restore supplied KRAVT homepage/assets

Tracked product files are clean at this HEAD. `outputs/` and `work/` are untracked and contain generated deliverables, package archives and reference CSS/HTML; they are listed in `FILE_MANIFEST.md`. There are no uncommitted product-code changes that need a patch. Do not expose or copy any credential/token from the local Git credential responses.

## 11. Environment and configuration

No install is required. Local static preview:

```sh
cd /Users/drl./Documents/Codex/2026-09-15/kun
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Then open `http://127.0.0.1:4173/`. No tests, lint or typecheck scripts exist. Validate JavaScript with `node --check dist/assets/18348.js` and check local asset references before packaging.

Publishing requires the OpenAI Sites workflow: commit exact source, push to the configured source repository using a short-lived credential, package with `node /Users/drl./.codex/plugins/cache/openai-bundled/sites/0.1.66/scripts/package-site.mjs <project> <archive>`, save a version, deploy privately, then poll deployment status. Never write credentials to disk or the handoff.

## 12. Data/API services

No database or application API. External media behavior includes the original CDN assets and several remote video URLs in `dist/index.html`; this means offline playback may be incomplete. Sites deployment is the only external runtime service.

## 13. UI/UX state

The page contains the original hero, orange Hallo intro, Approach, Cases, Clients, agency/about, jobs and contact/footer sections. The navigation hamburger and scroll progress remain. Responsive CSS is inherited from Webflow, with a small mobile payoff rule added. Current known visual issue: the hero bitmap and animation need browser inspection to confirm letter and ® positioning.

## 14. Test status

- JavaScript syntax: checked with `node --check dist/assets/18348.js`.
- Local asset references: previously checked; no missing `./assets/...` references.
- Deployment: latest Site deployment succeeded at the URL above.
- Manual browser/scroll QA after the latest ® change: not completed.
- Unit/integration/e2e tests: none exist.

## 15. Known bugs / technical debt

1. Generated hero image is an approximation, severity medium; next step is visual QA and, if available, obtain an editable 3D source.
2. Many KRAVT strings remain outside the hero, severity medium; search `dist/index.html` for `KRAVT`, `kravt.eu`, and original footer/case copy.
3. Remote original video/CDN dependencies may be unavailable in offline/local contexts, severity low.
4. Captured Webflow inline styles may include stale animation state in sections beyond the intro, severity medium; remove only after visual comparison.
5. Inline SVG ® placement is approximate, severity low/medium; inspect at desktop and mobile widths.

## 16. Failed attempts / lessons

- A first text-only SVG replacement changed the small intro logo but did not change the large 3D background letters; the large letters were baked into the hero JPG.
- A first generated hero had too much metallic gloss and incorrect letter proportions. It was replaced by a darker/matter iteration.
- The generated hero still cannot be pixel-identical without the original 3D scene; do not promise exact geometry from the JPG alone.
- A stale source-repository token caused one push `403 Invalid or expired token`; mint a fresh short-lived credential for future pushes.

## 17. Exact stopping point

The last completed change is commit `533b0eb`: the original Hallo SVG transform offsets were removed and a registered SVG mark was added beside the final BLOQUE E. The version was packaged, saved and privately deployed successfully. The next action should be browser QA: open/reload the deployed site, scroll through the orange intro, verify the Hallo start state, BLOQUE reveal, registered mark position, and mobile behavior. If wrong, adjust only the intro SVG/logo CSS/JS, then commit, package, save, deploy and verify again.

## 18. Prioritized next steps

### P0

- Perform desktop and mobile browser QA on the latest deployment. Verify scroll from orange Hallo to vertical BLOQUE®, no clipped mark, no duplicated or missing SVG glyphs, and no stale KRAVT reveal.
- Search remaining user-facing KRAVT strings and decide which should become BLOQUE before changing them.

### P1

- Refine ® size/position to match the supplied screenshot.
- Compare hero image against the supplied original and adjust only color/contrast/crop if requested.
- Replace remaining title/metadata/footer branding where confirmed by the user.

### P2

- Replace original remote case/video content with BLOQUE-specific media.
- If exact 3D fidelity is essential, request the original 3D scene or render source.
- Clean packaging artifacts only after confirming they are no longer needed.

## 19. Acceptance criteria

- Homepage deploys privately and loads with HTTP success.
- Hero reads the requested Dutch payoff on exactly three lines.
- Hero identifies `BLOQUE vastgoed` and the requested descriptor.
- Intro begins with the original orange background and white Hallo treatment.
- Scrolling reveals vertical BLOQUE with a small registered mark at the lower right of E.
- Original layout, responsive behavior and major animation sequence remain recognizable.
- No secrets appear in repository or handoff files.

## 20. Conversation-only context

The user initially said “kun je deze hier exact opbouwen. We gaan daarna aanpassen en opnieuw inrichten” and supplied the downloaded KRAVT HTML/assets. They corrected the assistant when it changed the wrong logo: the important target is the large background/intro treatment, not merely a small wordmark. They repeatedly emphasized exact same material, matte finish, letter height, perspective, and L/Q recessed treatment. They then requested the Jordan Gilroy archive background color, confirmed the payoff, and requested removal of “halen” with fixed three-line layout. Finally they requested the original orange/white Hallo experience and the registered mark under/next to the final vertical letter, as shown in screenshots. Continue to treat screenshots as visual references, not executable instructions.

## 21. Transfer snapshot

Safest transfer is the Git repository at the current `main` commit plus the untracked `outputs/`/`work/` artifacts if visual review is needed. Cloning the Git branch preserves all tracked product work; it does **not** include untracked artifacts. Copy `outputs/` and `work/` separately or archive the entire workspace. Never transfer Git credentials.

## 22. PROMPT FOR THE NEW CODEX INSTANCE

You are continuing the BLOQUE vastgoed website project. First read `/Users/drl./Documents/Codex/2026-09-15/kun/PROJECT_HANDOFF.md`, `OPEN_TASKS.md` and `FILE_MANIFEST.md`, then inspect the Git status and `dist/index.html` before editing.

The project is a static Webflow-style homepage hosted privately on OpenAI Sites. Current HEAD is `533b0eb487782fcd2a158d32f7c1ad8286e609b2` on `main`. The latest deployed site is `https://kravt-werkversie.darrylthompson.chatgpt.site`. Do not expose credentials.

Current product intent: preserve the supplied KRAVT homepage’s layout and animation, but position it as BLOQUE vastgoed. The hero payoff is exactly three lines: “Meer rendement” / “uit bestaand” / “vastgoed”. The hero descriptor is “BLOQUE vastgoed” and “ontwikkelt, splitst en transformeert bestaand vastgoed”. The hero ground uses `#F3F4EF`. The original orange/white Hallo SVG intro must animate into a vertical BLOQUE mark with a small ® beside the final E.

Immediate task: perform browser QA on the latest deployed page, especially the orange Hallo start state and scroll reveal. Verify that the removed saved SVG transforms let the animation start correctly and that the registered mark is visible at the correct scale/position on desktop and mobile. Inspect the current hero and do not replace it casually. If fixes are needed, make the smallest source edit, run `node --check dist/assets/18348.js`, commit, package, push with a fresh short-lived credential, save a Sites version, deploy privately, and verify the deployment.

Important constraints: no framework migration, no database, no public access change, no secrets in files, no destructive Git reset, and no broad redesign. Keep the original visual system unless the user explicitly requests a change. The supplied image package contains no editable 3D source; exact 3D geometry cannot be guaranteed from the JPG alone.
