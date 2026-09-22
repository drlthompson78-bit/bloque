# PROJECT HANDOFF — BLOQUE vastgoed website

## Update — 22 September 2026: remove clients and vacancies

Removed the two sections identified in the user's screenshots: “Who we worked for” (`home-clients`, including the old client list) and “Working for KRAVT” (`home-jobs`, including all vacancy links). Removed their complete sticky wrappers, spacers and overlays to avoid empty scrolling intervals, plus the “Clients” navigation item. The separate “Working at KRAVT” section and the remaining content are preserved.

Validation: source comparison confirms only those two wrappers and the Clients menu item were removed. Every remaining navigation target resolves. Local browser checks confirmed both sections are absent, five menu entries remain and Contact navigation closes the menu. `git diff --check` passed.


## Update — 22 September 2026: prevent header logo overlapping copy

The transparent fixed header no longer leaves the BLOQUE wordmark over section labels and headings. `bloque-header.css?v=3` uses the existing `data-scrolling-started` state: after scrolling beyond the top threshold the logo fades out, becomes hidden and stops receiving pointer/focus input. It reappears at the page entrance and while navigation is open. The menu button remains available throughout. Logo geometry, positioning and all page content remain unchanged; reduced-motion preferences disable the fade.

Browser checks at 1280 × 720 and 390 × 844 confirmed a clear “Zes stappen” heading, logo visibility in the open menu, hiding again when that menu closes away from the top, and restoration when the logo returns the page to the start. The HTML change is only the stylesheet version; `git diff --check` passed.


## Update — 22 September 2026: six development steps

The former ten-case slider now presents six numbered steps using the user's exact titles and copy: Aankoopanalyse, Businesscase, Herindeling & ontwerp, Vergunningen, Uitvoering and Commerciële afronding. Added the heading “Zes stappen. Regie van aankoop tot afronding.” and supplied introduction above it. “Client” is now “Stap”; the section label is “Onze werkwijze”.

The first three text sub-sliders contain exactly six items, so the existing Mondriaan navigation wraps at 06. All original visual slide markup and colours are preserved for the later image revision; only the first six visual sets are reached by the six-step navigation. Hidden old case links were removed from the text panels. Previous/next controls are native buttons with Dutch accessible labels. `dist/assets/bloque-process.css` allows longer titles to wrap, reserves text space and stacks the copy above the existing visuals on smaller screens.

Validation: exact heading/introduction and six titles/paragraphs checked; media and colour groups are unchanged, as is page content outside this section. Browser testing at 1280 × 720 covered all six steps, 06→01 and 01→06, with matching titles, numbers and paragraphs. At 390 × 844 the longer “Herindeling & ontwerp” title and paragraph fit the panel; controls work by keyboard. `git diff --check` passed.


## Update — 22 September 2026: Dutch introduction and four property specialisms

Replaced the English ethos paragraph with the user's exact Dutch copy beginning “Nederland verandert.” and ending “Samen halen we meer uit wat er al staat.” Its orange button now says “Ontdek onze aanpak” with the existing down-arrow and `#approach` scroll target.

The approach introduction now begins “Elk pand vraagt om andere keuzes.” Four existing numbered cards now cover Splitsen, Transformeren, Renoveren and Herpositioneren, with the supplied taglines and summaries. Each orange “Lees verder” button opens its corresponding detailed copy in a native modal dialog. The desktop columns, thin dividers, typography and orange CTA styling are retained; buttons align at the bottom of each row. On mobile the cards remain stacked.

`dist/assets/bloque-specialisms.css` and `bloque-specialisms.js` provide the reading panels. Native dialog semantics isolate focus; closing by button or Escape restores focus to the triggering card. The close bar stays visible while scrolling. Panels use the local Helvetica Now font and support reduced motion. Dialog text deliberately contains the detailed paragraphs, while the short summaries stay on the cards.

Validation: exact supplied content checked against the implementation; all four buttons opened the matching panel and restored focus on close; Escape was checked. At 1280 × 720 the full ethos text and CTA fit the existing column and card buttons align. At 390 × 844 cards are stacked, the reading panel has no horizontal overflow, its final paragraph is reachable by scrolling and the close control stays visible. JavaScript syntax and `git diff --check` passed.

## Update — 22 September 2026: Q-tail refinement and copyright mark

The header Q's orange diagonal now begins inside its counter, is wider and crosses the bowl continuously; this replaces the narrow stroke that appeared detached below the letter. The six base letter contours are unchanged. Added a small outlined © above/right of the E, as requested (distinct from the existing ® in the vertical intro logo). The standalone wordmark and inline SVG share the updated paths. Header width reserves the extra copyright space while preserving the existing letter scale; the CSS reference is bumped to `bloque-header.css?v=2`. Checked enlarged SVG and page views at 1280 × 720 and 390 × 844: both details are sharp and the logo/copyright stay within the header without overlapping the menu.


## Update — 22 September 2026: Helvetica Now page text

All HTML headings, paragraphs, navigation, button labels and inherited body text now use Helvetica Now, the regular and medium text faces verified on monks.com. The fonts are local WOFF2 assets in `dist/assets/fonts/`, applied by `dist/assets/bloque-typography.css` and preloaded in the head. Original text sizes, weights and the three forced hero lines remain. The page initialization in `18348.js` waits for fonts to settle before measuring animated text. The SVG wordmark, Hallo artwork and 3D scene are independent of this typeface change. Browser checks at 1280 × 720 and 390 × 844 confirmed local font requests, applied Helvetica Now styles, the three hero lines and working menu navigation.


## Update — 22 September 2026: BLOQUE header wordmark

Added a fixed BLOQUE wordmark at the top left, aligned with the existing menu control. The broad Helvetica Now Extended 800 display face observed on monks.com provides the capital outlines; Q has a separately drawn straight diagonal in site orange `#FF4600`. The SVG remains sharp at all screen densities and needs no loaded font. Its editable master is `dist/assets/bloque-wordmark.svg`, with matching inline geometry in `dist/index.html`; see `brand/README.md`.

`dist/assets/bloque-header.css` handles size, alignment, keyboard focus and the existing section/menu themes. On orange panels the mark uses white lettering with a dark tail for contrast. Clicking it closes navigation and returns to the top. The approved hero animation, payoff and Hallo/BLOQUE® sequence are unchanged. Browser checks passed at 1280 × 720 and 390 × 844: no logo/menu overlap, correct orange Q tail, and the logo closes the open menu and returns to the start.


## Update — 22 September 2026: orange infill after sinking

The user accepted the sharper 4K scene, then requested the recessed L and Q to fill with site orange until level with the surrounding white floor. Both orange volumes share the exact floor-opening geometry, including the straight Q tail. The Q center stays white. Their un-beveled upper faces stop at z=0; B/O/U/E keep the approved graphite material and height. The orange material uses the site's `--color-primary` (`#FF4600`).

The original sinking sequence is preserved through frame 192 (8 seconds). Orange rises in both recesses over frames 192–264, then holds through frame 288 (12 seconds total, 24 fps, 3840 × 1584). The new video is `dist/assets/bloque-3d-sink-fill-orange-4k.mp4`; the reduced-motion/error still is `bloque-3d-filled-orange-4k.jpg`. The raised opening poster is unchanged. The source and rebuild commands remain in `scene/README.md`.

The initial reveal of the infill pigment eases over frames 206–220, avoiding an abrupt orange flash when its surface first covers the dark letter. The approved six letter meshes and sampled sinking positions were compared against the previous scene. Independent raised/recessed proof images matched the previous proofs within 3/255 (mean difference below 0.001/255), so the approved first 192 frames are reused exactly. Fill geometry was checked to never protrude above z=0 and to end exactly at that height for both letters.

All 288 delivery frames decode at 3840 × 1584. The 72 new moving frames passed the stationary-material audit; no dark material flicker was found. The assembled final frame matched the independent full-frame proof with mean difference 0.041/255 and zero pixels differing by more than 10/255. The MP4 explicitly tags BT.709 primaries/matrix and sRGB transfer (including H.264 VUI metadata), avoiding an unspecified browser color interpretation. Browser playback was checked at 1600 × 900 and reached the 12-second filled ending without errors.

## Update — 22 September 2026: sharper 4K hero and straight Q tail

This supersedes the older hosting and hero details below. The active owner-private Site is `appgprj_6ab244a5ea748191a4b6407688b3cc1e` at `https://bloque-vastgoed.drl-thompson78.chatgpt.site`. Use `.openai/hosting.json` and fresh Sites metadata as the authority.

The user found the first real 3D version too soft and noticed a curved Q tail. The new Q is the same round body as O joined to a straight rectangular diagonal, with matching floor geometry. Its tail side faces remain flat. Curve sampling increased from 12 to 32 subdivisions, normals preserve hard corners, and the edge bevel is 4 mm. All letters still share one matte graphite material. Stronger directional light with lower ambient fill separates top and side faces while keeping the light floor.

Production is now 3840 × 1584, 24 fps, 192 frames (8 seconds), with up to 64 Cycles samples, a minimum of 16 adaptive samples, accurate denoising and a 0.75-pixel filter. Full raised and recessed proof renders were compared before animation. The fixed camera permits reuse of stationary pixels while L/Q and nearby shadows are ray traced at full quality. The page still waits about 1.5 seconds after its entrance, lowers L followed by Q, and keeps the final video frame. Reduced motion and playback errors use the matching final still.

Delivery media are `dist/assets/bloque-3d-sinking-4k.mp4`, `bloque-3d-raised-4k.jpg` and `bloque-3d-recessed-4k.jpg`. Versioned filenames avoid stale video caches. The headline, descriptor, Hallo and vertical BLOQUE® transition are preserved.

Validation: all 192 frames decode at the delivery resolution; all 136 moving frames passed the stationary-material audit. Cycles persistent data is disabled after it caused dark material patches in three ending frames; those frames and the ending hold were rebuilt. The assembled final frame closely matches an independently rendered full-frame proof (mean difference 0.066/255). The 1.1 MB H.264 video was checked in the browser at 1600 × 900, including the corrected ending, with a straight Q tail and consistent matte surfaces.

The production authority is `scene/bloque-studio.blend` and the scripts in `scene/README.md`. The 3D Jutsu project `2892a976-6562-4b6d-a5a8-5030af396c64`, revision 2, is an older reference copy: it does not yet include this straight-tail/sharpness revision. This remains a reconstruction, not the original KRAVT model; do not claim exact photographic equivalence. Visual acceptance remains with the user.

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
