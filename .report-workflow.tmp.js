export const meta = {
  name: 'image-ai-learning-report',
  description: 'Produce a verified, multi-section developer-learning report for the image-ai Fabric.js editor',
  phases: [
    { title: 'Recon', detail: 'Read Next.js 16 shipped docs for framework-accurate claims' },
    { title: 'Bug hunt', detail: 'Four lenses sweep the codebase for defects' },
    { title: 'Bug verify', detail: 'Adversarial refuters + reproduction tracers per finding' },
    { title: 'Write', detail: '21 report sections written to docs/learning-report/' },
    { title: 'Verify', detail: 'Each section fact-checked against real source and corrected in place' },
  ],
}

const REPO = 'f:/code with antonio/image-ai'
const OUT = REPO + '/docs/learning-report'

const INVENTORY = `
COMPLETE SOURCE INVENTORY (verified via git ls-files + untracked; this is the WHOLE project):

App Router / entry:
  app/layout.tsx                                  (RootLayout, Geist fonts, metadata)
  app/page.tsx                                    (Home - stub, renders one Button)
  app/editor/[projectId]/page.tsx                 (EditorProjectIdPage - dynamic route, renders <Editor />)
  app/globals.css                                 (Tailwind v4 + shadcn theme tokens)
  app/favicon.ico

Editor feature:
  features/editor/components/editor.tsx           (Editor - the orchestrator, "use client")
  features/editor/components/navbar.tsx           (Navbar)
  features/editor/components/footer.tsx           (Footer - empty bar)
  features/editor/components/logo.tsx             (Logo)
  features/editor/components/sidebar.tsx          (Sidebar - left rail)
  features/editor/components/sidebar-item.tsx     (SidebarItem)
  features/editor/components/toolbar.tsx          (Toolbar - contextual top bar)
  features/editor/components/shape-sidebar.tsx    (ShapeSidebar)
  features/editor/components/shape-tool.tsx       (ShapeTool)
  features/editor/components/fill-color-sidebar.tsx    (FillColorSidebar)
  features/editor/components/strokecolor-sidebar.tsx   (StrokeColorSiderbar) [untracked/new]
  features/editor/components/strokewidth-sidebar.tsx   (StrokeWidthSiderbar) [untracked/new]
  features/editor/components/color-picker.tsx     (ColorPicker - next/dynamic ssr:false)
  features/editor/components/tool-sidebar-header.tsx   (ToolSidebarHeader)
  features/editor/components/tool-siderbar-close.tsx   (ToolSideBarClose)
  features/editor/hooks/use-editor.ts             (buildEditor + useEditor - THE core file)
  features/editor/hooks/use-canva-events.ts       (useCanvasEvents - Fabric -> React bridge)
  features/editor/hooks/use-auto-resize.ts        (useAutoResize - ResizeObserver + zoom)
  features/editor/types.ts                        (ActiveTool, Editor, BuildEditorProps, defaults, shape option consts, colors)
  features/editor/utilis.ts                       (isTextType, rgbaObjectTostring)  [note: filename is misspelled "utilis"]
  features/txt                                    (EMPTY FILE, zero bytes, no extension - stray)

Shared:
  components/hint.tsx                             (Hint tooltip wrapper)
  components/ui/button.tsx                        (Button - cva + forwardRef, plain <button>)
  components/ui/dropdown-menu.tsx
  components/ui/scroll-area.tsx
  components/ui/separator.tsx
  components/ui/tooltip.tsx
  components/ui/input.tsx      [untracked]
  components/ui/label.tsx      [untracked]
  components/ui/sheet.tsx      [untracked]
  components/ui/sidebar.tsx    [untracked]
  components/ui/skeleton.tsx   [untracked]
  components/ui/slider.tsx     [untracked - wraps @base-ui/react/slider]
  hooks/use-mobile.ts          [untracked - useIsMobile]
  lib/utils.ts                 (cn = twMerge(clsx(...)))

Config:
  package.json, tsconfig.json, next.config.ts, components.json,
  postcss.config.mjs, eslint.config.mjs, .gitignore, README.md,
  AGENTS.md, CLAUDE.md, bun.lock, package-lock.json

VERIFIED VERSIONS (from node_modules): next 16.2.11, react 19.2.4, react-dom 19.2.4, fabric 7.4.0, typescript 5.9.3, tailwindcss 4.x

CRITICAL GROUND TRUTH — do not get these wrong:
- shadcn style is "base-nova": the UI primitives wrap @base-ui/react, NOT Radix. base-ui uses a \`render={<El/>}\` prop where Radix used \`asChild\`. You can see this in components/hint.tsx (<TooltipTrigger render={children} />) and navbar.tsx (<DropdownMenuTrigger render={<Button .../>}>).
- There is NO database, NO API route, NO server action, NO middleware, NO .env file in this project. @clerk/nextjs and drizzle-kit are INSTALLED in package.json but ZERO source files import them. Say so plainly; do not invent auth or persistence.
- The [projectId] dynamic route param is NEVER read. app/editor/[projectId]/page.tsx ignores params entirely.
- Undo, Redo, Save, Load, Export, and Delete are NOT implemented. navbar.tsx wires those buttons to empty \`onClick={() => {}}\` handlers. The "Saved" cloud indicator is static text.
- Only "shapes", "fill", "stroke-color", "stroke-width" tool sidebars exist. "templates", "images", "text", "ai", "settings", "draw", "font", "opacity", "filter", "remove-bg" are members of the ActiveTool union with NO corresponding sidebar component rendered.
- A bug was ALREADY FIXED in this working tree earlier today: getActiveSTROKEWIDTH in use-editor.ts previously read selectedObject.get("stroke-width") (hyphenated, always undefined) and now correctly reads get("strokeWidth"). The file on disk is the FIXED version. When you discuss it, describe it as a fixed historical bug and use it as a teaching example of stale-fallback bugs.

RULES FOR EVERY AGENT:
- READ the real files with the Read tool before writing a single claim about them. Never rely on this summary alone for code detail.
- NEVER invent a file, component, hook, function, prop, or import that you have not seen with your own Read call.
- Quote code VERBATIM. Copy it exactly, typos and all (this codebase has many: "utilis", "Siderbar", "strokeWIDTH", "rbga", "canva").
- Use forward-slash paths relative to repo root, e.g. features/editor/hooks/use-editor.ts
- Cite line numbers only when you have actually read that line; format as file.ts:42.
- DO NOT MODIFY ANY SOURCE CODE. You may only Write/Edit your own assigned markdown file under docs/learning-report/. Touching anything in app/, features/, components/, hooks/, or lib/ is a hard failure.
- Do not run npm/bun install, build, or dev.
- Separate CONFIRMED (provable from code you read) from ASSUMPTION (needs runtime check). Label them.
- Teach the reader how to THINK about the code, not how to memorize it. Always answer WHY the developer wrote it this way, and how it connects to other files.
- This is a learning-by-reverse-engineering report for a developer who wants to become independent. Be generous and concrete. Long is fine. Shallow is failure.
- Write in complete prose sentences. Avoid arrow-chain shorthand except inside explicit flow-trace diagrams.
`

const BUGS_SCHEMA = {
  type: 'object',
  properties: {
    bugs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          file: { type: 'string' },
          line: { type: 'number' },
          severity: { type: 'string' },
          category: { type: 'string' },
          codeQuote: { type: 'string' },
          evidence: { type: 'string' },
          failureScenario: { type: 'string' },
          confirmed: { type: 'boolean' },
        },
        required: ['title', 'file', 'line', 'severity', 'category', 'codeQuote', 'evidence', 'failureScenario', 'confirmed'],
      },
    },
  },
  required: ['bugs'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    refuted: { type: 'boolean' },
    reasoning: { type: 'string' },
    correctedClaim: { type: 'string' },
  },
  required: ['refuted', 'reasoning'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    errorsFound: { type: 'number' },
    fixesApplied: { type: 'array', items: { type: 'string' } },
    remainingConcerns: { type: 'array', items: { type: 'string' } },
    approxWords: { type: 'number' },
  },
  required: ['errorsFound', 'fixesApplied', 'remainingConcerns'],
}

// ---------------------------------------------------------------- Phase 1: Recon
phase('Recon')

// Hardcoded from a first-hand read of the SHIPPED docs in node_modules/next/dist/docs/
// (the agent that originally produced this was interrupted mid-run and returned null).
const nextDocs = [
  '# Next.js 16.2.11 ground truth — read first-hand from node_modules/next/dist/docs/',
  '',
  'Every claim below was verified by reading the shipped docs in this repo. The project AGENTS.md',
  'warns that this version differs from training data, so PREFER THIS BRIEFING over prior knowledge.',
  'If you need more, read the docs yourself at node_modules/next/dist/docs/01-app/.',
  '',
  '## 1. params is a PROMISE in v16 (the single biggest breaking change)',
  '',
  'Source: 01-app/03-api-reference/03-file-conventions/page.md and .../dynamic-routes.md',
  '',
  'The doc\'s own canonical example:',
  '',
  '    export default async function Page({',
  '      params,',
  '    }: {',
  '      params: Promise<{ slug: string }>',
  '    }) {',
  '      const { slug } = await params',
  '    }',
  '',
  'page.md states verbatim: "A promise that resolves to an object containing the dynamic route',
  'parameters from the root segment down to that page." And: "Since the params prop is a promise,',
  'you must use async/await or React\'s use function to access the values. In version 14 and earlier,',
  'params was a synchronous prop. To help with backwards compatibility, you can still access it',
  'synchronously in Next.js 15, but this behavior will be deprecated in the future."',
  '',
  'searchParams is likewise Promise<{ [key: string]: string | string[] | undefined }>.',
  '',
  'IN A CLIENT COMPONENT page, dynamic segments are unwrapped with React\'s use() hook, not await:',
  '',
  '    "use client"',
  '    import { use } from "react"',
  '    export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {',
  '      const { slug } = use(params)',
  '    }',
  '',
  'RELEVANCE TO THIS PROJECT: app/editor/[projectId]/page.tsx currently declares no props at all and',
  'never reads params. That is why it does not break — it simply ignores the promise. If the developer',
  'later wants projectId, the correct v16 signature is the async/await form above (the page is a Server',
  'Component today), NOT the synchronous { params: { projectId: string } } shape that Next 13/14',
  'tutorials and most training data will suggest. Say this explicitly; it is the most actionable',
  'framework fact in the whole report.',
  '',
  'params is passed to layout, page, route, and generateMetadata.',
  '',
  '## 2. Server vs Client Components',
  '',
  'Source: 01-app/03-api-reference/01-directives/use-client.md',
  '',
  'Pages are Server Components by default (page.md: "Pages are Server Components by default, but can',
  'be set to a Client Component").',
  '',
  'use-client.md states verbatim: "The use client directive declares an entry point for the components',
  'to be rendered on the client side... You do not need to add the use client directive to every file',
  'that contains Client Components. You only need to add it to the files whose components you want to',
  'render directly within Server Components. The use client directive defines the client-server',
  'boundary, and the components exported from such a file serve as entry points to the client."',
  '',
  'It must be at the TOP of the file, before any imports.',
  '',
  'Props crossing the boundary must be SERIALIZABLE — the doc explicitly flags a function prop as',
  '"Function is not serializable".',
  '',
  'RELEVANCE: this is why features/editor/components/editor.tsx needs "use client" but its children',
  '(toolbar.tsx, shape-sidebar.tsx, fill-color-sidebar.tsx, strokecolor-sidebar.tsx,',
  'strokewidth-sidebar.tsx, sidebar-item.tsx, shape-tool.tsx, footer.tsx, logo.tsx, hint.tsx,',
  'tool-sidebar-header.tsx, tool-siderbar-close.tsx) do NOT — they inherit client-ness by being',
  'imported from a module that is already past the boundary. Note the serialization rule and observe',
  'that editor.tsx passes function props (onChangeActiveTool, the editor facade) DOWNWARD entirely',
  'within the client tree, which is allowed; the rule only constrains the server-to-client hop.',
  '',
  '## 3. next/dynamic with ssr:false',
  '',
  'Source: 01-app/02-guides/lazy-loading.md',
  '',
  'Verbatim, lines 94-95: "ssr: false option is not supported in Server Components. You will see an',
  'error if you try to use it in Server Components. ssr: false is not allowed with next/dynamic in',
  'Server Components. Please move it into a Client Component."',
  '',
  'And line 66: "ssr: false option will only work for Client Components, move it into Client',
  'Components ensure the client code-splitting working properly."',
  '',
  'RELEVANCE: features/editor/components/color-picker.tsx uses ssr:false for both ChromePicker and',
  'CirclePicker. It has "use client" on line 1, so this is CORRECT and would be a build error without',
  'that directive. Present this as the author getting it right, and explain the causal link between',
  'the directive and the legality of the ssr:false option.',
  '',
  '## 4. Other conventions this project touches',
  '',
  '- Root layout: must define html and body tags. Sources: 01-app/03-api-reference/03-file-conventions/layout.md',
  '- metadata export: a static Metadata object is valid; generateMetadata is the dynamic form.',
  '  app/layout.tsx still exports the create-next-app default title/description.',
  '- next/font: 01-app/01-getting-started/13-fonts.md and 03-api-reference/02-components/font.md.',
  '  The variable option emits a CSS custom property instead of a class, which is what lets',
  '  app/globals.css consume --font-geist-sans inside its @theme inline block.',
  '- next/image: 03-api-reference/02-components/image.md. The fill prop makes the image absolutely',
  '  fill its nearest positioned ancestor, which is why logo.tsx wraps it in a div with "relative".',
  '- File conventions that DO NOT exist in this project: loading.tsx, error.tsx, not-found.tsx,',
  '  generateStaticParams, route.ts handlers, middleware.ts. None are required for the app to run;',
  '  say what each would buy and note that a dynamic [projectId] route with no generateStaticParams',
  '  is rendered dynamically at request time.',
  '',
  '## 5. Migration hazards to flag for a reader coming from Next 13/14',
  '',
  '- params and searchParams are now promises (see section 1). This is the one that will bite.',
  '- ssr:false is illegal in Server Components (see section 3).',
  '- Tailwind v4 in this project has NO tailwind.config file; configuration moved into CSS',
  '  (@import "tailwindcss", @theme inline). components.json records "config": "" accordingly.',
  '',
  'If any section needs a v16 detail not covered here, READ THE SHIPPED DOCS rather than guessing.',
].join('\n')

const configRecon = await agent(
  `Establish exact configuration and dependency ground truth for a report about the project at ${REPO}.

Read these files completely: package.json, tsconfig.json, next.config.ts, components.json, postcss.config.mjs, eslint.config.mjs, .gitignore, README.md, AGENTS.md, CLAUDE.md, app/globals.css.

Then, for EVERY dependency and devDependency in package.json, determine whether it is ACTUALLY IMPORTED anywhere in the project source (app/, features/, components/, hooks/, lib/). Use Grep to prove it. Report per package:
- package name and version range
- ACTUALLY USED: yes/no
- if yes: the exact file paths that import it and what they import
- if no: state plainly that it is installed but unreferenced

Pay special attention to: @base-ui/react, @clerk/nextjs, fabric, jsdom, lucide-react, material-colors, react-color, react-icons, shadcn, class-variance-authority, clsx, tailwind-merge, tw-animate-css, drizzle-kit, @types/bcryptjs, @types/material-colors, @types/react-color.

Also report:
- the exact tsconfig compilerOptions that shape how this code type-checks (strict, moduleResolution, jsx, paths alias @/*)
- what app/globals.css actually sets up (Tailwind v4 @import syntax, @theme inline, CSS custom properties, @custom-variant dark) and how it differs from Tailwind v3 config-file style
- what components.json tells you about how UI primitives were generated (style "base-nova", rsc, aliases)
- whether there is any .env, .env.local, middleware.ts, or app/api/ directory anywhere (prove with Glob)

Return a dense factual briefing in markdown. This will be handed to the agents writing the dependencies, TypeScript, and UI-primitives sections.`,
  { label: 'recon:config-deps', phase: 'Recon' }
)

// ---------------------------------------------------------------- Phase 2: Bug hunt
phase('Bug hunt')

const FINDERS = [
  {
    key: 'react-state',
    prompt: `Hunt for REACT and STATE bugs in ${REPO}.

Read every file under features/editor/ (components and hooks), plus features/editor/components/editor.tsx and components/hint.tsx.

Look specifically for:
- stale state / state that shadows the real source of truth (React state vs Fabric object properties)
- getters that fall back to shared module or hook state instead of reading the selected object
- \`||\` used where \`??\` is needed (a legitimate 0 / "" / false being swallowed by the falsy fallback)
- useEffect dependency arrays that are wrong, missing, or that cause remount/teardown churn
- useCallback/useMemo dependencies that defeat memoization or cause the Fabric canvas to be re-created
- components that read \`editor?.something\` where \`editor\` is undefined on first render and the undefined value silently renders wrong UI
- \`key={...}\` props used to force remounts and what that costs or breaks
- event handler wiring that is dead (onClick={() => {}}) vs intentionally-stubbed
- conditional early returns placed after or before hook calls (rules-of-hooks violations)
- props that are declared but never used, or used inconsistently

Report ONLY defects you can prove by quoting the actual code. For each, give the exact file, line, verbatim code quote, why it is wrong, and a concrete failure scenario (specific user actions leading to specific wrong output). Set confirmed:true only if the code alone proves it; confirmed:false if it needs a runtime check.`,
  },
  {
    key: 'fabric-api',
    prompt: `Hunt for FABRIC.JS API MISUSE bugs in ${REPO}. The installed version is fabric 7.4.0 — verify API shape against ${REPO}/node_modules/fabric/ (read its .d.ts type definitions; do not rely on memory of fabric v5).

Read: features/editor/hooks/use-editor.ts, features/editor/hooks/use-canva-events.ts, features/editor/hooks/use-auto-resize.ts, features/editor/types.ts, features/editor/components/editor.tsx, features/editor/components/strokewidth-sidebar.tsx.

Look specifically for:
- property names that are not real Fabric properties (camelCase vs kebab-case vs invented names). Check EVERY string passed to .get() and every key in a .set({...}) or constructor options object against the fabric type definitions.
- the shape option constants in features/editor/types.ts — check every key name against what Fabric actually accepts for Circle, Rect, Triangle, Polygon. Are any keys silently ignored? Are any geometrically contradictory?
- \`name\` used as a workspace marker on a Fabric object — is \`name\` a real property in fabric 7? How does the code cast around it, and is that cast safe?
- canvas lifecycle: creation, dispose, re-creation, and whether a canvas can leak or be double-initialized
- event registration and teardown in use-canva-events.ts: is canvas.off(eventName) with no handler correct in fabric 7? Check the type definitions.
- selection events: are selection:created, selection:updated, selection:cleared sufficient to cover every way selection can change in fabric 7? What about object:modified, object:removed, programmatic setActiveObject, or discardActiveObject?
- e.selected vs canvas.getActiveObjects() — do they agree for multi-select and for ActiveSelection?
- render calls: renderAll vs requestRenderAll, and whether any mutation path forgets to render
- clipPath, viewportTransform, zoomToPoint, findScaleToFit usage in use-auto-resize.ts — any mutation of shared/borrowed objects, any async ordering hazard with the awaited clone()
- whether changes to objects are ever persisted or whether they exist only in the live canvas

Report ONLY defects you can prove by quoting actual code and, where relevant, the fabric type definition that contradicts it. Exact file, line, verbatim quote, why wrong, concrete failure scenario.`,
  },
  {
    key: 'typescript',
    prompt: `Hunt for TYPESCRIPT and TYPE-SAFETY bugs in ${REPO}. tsconfig has strict:true — read ${REPO}/tsconfig.json to confirm.

Read every .ts and .tsx file under features/, components/, hooks/, lib/, app/.

Look specifically for:
- types that lie: a declared type that does not match what the value can actually be at runtime
- \`as\` assertions that paper over a real mismatch (find every \`as\` in the codebase and judge each one)
- implicit \`never[]\` from an empty array literal export, and what that does to consumers
- interface/type members that are optional when they should be required, or vice versa
- the Editor interface in features/editor/types.ts vs what buildEditor in use-editor.ts actually returns — do they match exactly? Is anything in the interface unimplemented, or implemented but not declared?
- BuildEditorProps vs the destructured params in buildEditor — any drift?
- union types (ActiveTool) vs the plain string[] in selectionDependTools — is the .includes() call type-safe and is the array's content actually a subset of the union?
- function signatures typed as returning a value that can actually be undefined
- React props typing: children, ReactElement vs ReactNode, event handler types
- anything that would break if noUncheckedIndexedAccess or a stricter flag were turned on
- typos in property names that TypeScript CANNOT catch (e.g. keys in an untyped object literal spread into a library call)

Report ONLY defects you can prove by quoting actual code. Exact file, line, verbatim quote, why wrong, concrete failure scenario. Include type-level smells that are not yet runtime bugs but will become one — mark those confirmed:false and explain the trigger.`,
  },
  {
    key: 'nextjs-runtime',
    prompt: `Hunt for NEXT.JS / RUNTIME / RENDERING bugs in ${REPO}. Next version is 16.2.11 — consult the SHIPPED docs at ${REPO}/node_modules/next/dist/docs/ (per the project's AGENTS.md, do not trust memory of older Next versions).

Read: app/layout.tsx, app/page.tsx, app/editor/[projectId]/page.tsx, app/globals.css, next.config.ts, and every file under features/editor/components/ and components/.

Look specifically for:
- Server/Client Component boundary errors: which files have "use client" and which do not, and whether any file that needs it is missing it. Trace the boundary precisely — which components are client components by import inheritance?
- hydration hazards: anything that renders differently on server vs client (Date, random, window/document access, canvas painting, browser-only libraries). Note that color-picker.tsx already works around one such hazard — evaluate whether the workaround is complete and whether the same hazard exists elsewhere unguarded.
- SSR safety of fabric: is fabric imported at module scope in a file that renders on the server? What happens? Does jsdom in package.json relate?
- the dynamic route app/editor/[projectId]/page.tsx: is params typed/awaited correctly for v16? Is the segment used at all? What are the consequences?
- missing App Router files the v16 docs expect (loading.tsx, error.tsx, not-found.tsx, generateStaticParams, generateMetadata) and whether their absence is a real problem here
- layout/CSS correctness: app/layout.tsx sets h-full and min-h-full; editor.tsx uses \`absolute h-[calc(100%-68px)] w-full top-[68px]\` — is the containing block correct for that absolute positioning? Will the Toolbar/Footer/canvas sizing actually work?
- Tailwind class strings that are invalid or won't compile (e.g. h-[56] with no unit, typo'd class names like tex-xs, border-Slate-800). Check EVERY className in features/editor/components/ and components/ for malformed arbitrary values and typos.
- the root metadata still saying "Create Next App"
- accessibility/interaction issues that would surface at runtime (buttons without type, missing alt, focus traps)

Report ONLY defects you can prove by quoting actual code and, where framework behavior is at issue, the shipped doc that governs it. Exact file, line, verbatim quote, why wrong, concrete failure scenario.`,
  },
]

const rawBugs = (await parallel(FINDERS.map((f) => () =>
  agent(f.prompt + '\n\n' + INVENTORY, { label: 'find:' + f.key, phase: 'Bug hunt', schema: BUGS_SCHEMA })
))).filter(Boolean).flatMap((r) => (r.bugs || []).map((b) => ({ ...b })))

log('Bug hunt returned ' + rawBugs.length + ' raw findings across 4 lenses')

// Dedup across all finders — genuinely needs the full set at once.
const seen = new Set()
const deduped = []
for (const b of rawBugs) {
  const k = (b.file || '') + ':' + (b.line || 0) + ':' + String(b.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 28)
  if (seen.has(k)) continue
  seen.add(k)
  deduped.push(b)
}
const SEVERITY_RANK = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
deduped.sort((a, b) => (SEVERITY_RANK[String(a.severity).toLowerCase()] ?? 5) - (SEVERITY_RANK[String(b.severity).toLowerCase()] ?? 5))
const toVerify = deduped.slice(0, 16)
if (deduped.length > toVerify.length) {
  log('CAP APPLIED: verifying top ' + toVerify.length + ' of ' + deduped.length + ' deduped findings by severity; ' + (deduped.length - toVerify.length) + ' lower-severity findings were dropped and will NOT appear in the report')
} else {
  log('Verifying all ' + toVerify.length + ' deduped findings')
}

// ---------------------------------------------------------------- Phase 3: Adversarial verify
phase('Bug verify')

const LENSES = [
  {
    key: 'refute',
    build: (b) => `You are an ADVERSARIAL REFUTER. Your job is to KILL this claimed bug, not to confirm it. Default to refuted:true when uncertain.

Claimed bug: "${b.title}"
File: ${b.file}  Line: ${b.line}
Quoted code: ${b.codeQuote}
Claimed evidence: ${b.evidence}
Claimed failure: ${b.failureScenario}

Go read ${REPO}/${b.file} yourself right now, plus every file that imports or is imported by it. If the claim concerns a library API, read the actual type definitions or docs under ${REPO}/node_modules/ to check it.

Try hard to refute. Consider: Is the quoted code accurate, or was it misquoted? Does some other line already compensate for it? Is the "wrong" property actually valid in this library version? Is the code path even reachable (is the object selectable, is the branch dead)? Is this just a style preference dressed up as a bug? Is the claimed failure scenario actually achievable through the real UI?

Set refuted:true if the bug is not real, not reachable, or already compensated for. Set refuted:false ONLY if you personally verified the defect in the source and can state the exact reachable path to it. In correctedClaim, give the precise, accurate one-sentence statement of the defect (or, if refuted, state what is actually true instead).`,
  },
  {
    key: 'repro',
    build: (b) => `You are a REPRODUCTION TRACER. Determine whether a real user of this running app can actually reach this defect, and what they would observe.

Claimed bug: "${b.title}"
File: ${b.file}  Line: ${b.line}
Quoted code: ${b.codeQuote}
Claimed failure: ${b.failureScenario}

Read ${REPO}/${b.file} and then trace the FULL call path backwards from that line to a user gesture: which DOM element the user clicks or drags, which component renders it, which handler fires, which editor method or hook runs, and how the result reaches the screen. Read every file on that path.

Answer concretely: (a) Is there a real UI affordance that reaches this code? Remember that several tools in the ActiveTool union have NO sidebar rendered, and several navbar buttons have empty handlers, so some code may be unreachable today. (b) What exact sequence of clicks reproduces it? (c) What does the user SEE go wrong? (d) Does it corrupt state permanently or only display wrong?

Set refuted:true if no reachable user path exists today or the user would observe nothing wrong. Set refuted:false if you can write the exact click-by-click repro. Put the step-by-step repro in correctedClaim.`,
  },
]

const verified = (await parallel(toVerify.map((b) => () =>
  parallel(LENSES.map((l) => () =>
    agent(l.build(b), { label: 'verify:' + l.key + ':' + b.file.split('/').pop() + ':' + b.line, phase: 'Bug verify', schema: VERDICT_SCHEMA })
  )).then((votes) => {
    const good = votes.filter(Boolean)
    const survivors = good.filter((v) => !v.refuted)
    return {
      ...b,
      survived: survivors.length >= 1 && good.length > 0,
      unanimous: good.length > 0 && survivors.length === good.length,
      refuterVerdict: good[0] || null,
      reproVerdict: good[1] || null,
      votes: good,
    }
  })
))).filter(Boolean)

const confirmedBugs = verified.filter((v) => v.survived)
const refutedBugs = verified.filter((v) => !v.survived)
log('Bug verify: ' + confirmedBugs.length + ' survived adversarial review (' + verified.filter((v) => v.unanimous).length + ' unanimously), ' + refutedBugs.length + ' refuted and dropped')

const BUG_DOSSIER = JSON.stringify(
  confirmedBugs.map((b) => ({
    title: b.title,
    file: b.file,
    line: b.line,
    severity: b.severity,
    category: b.category,
    codeQuote: b.codeQuote,
    evidence: b.evidence,
    failureScenario: b.failureScenario,
    unanimous: b.unanimous,
    refuterCorrectedClaim: b.refuterVerdict ? b.refuterVerdict.correctedClaim : null,
    reproSteps: b.reproVerdict ? b.reproVerdict.correctedClaim : null,
  })),
  null,
  1
)
const REFUTED_DOSSIER = JSON.stringify(
  refutedBugs.map((b) => ({ title: b.title, file: b.file, line: b.line, whyRefuted: (b.votes[0] || {}).reasoning })),
  null,
  1
)

// ---------------------------------------------------------------- Phase 4/5: sections
const TEMPLATE = `
When a section covers individual files, use EXACTLY this heading structure per file, in this order:

# File: path/to/file.tsx

## Purpose
## Used by
## Dependencies
## Exports
## State
## Functions
## JSX/UI
## Runtime flow
## Important concepts
## Possible bugs   (split into "Confirmed" and "Potential risks")

Under ## Functions, for each meaningful function state: what it receives, what it returns, what it changes, who calls it, and what happens after it runs.
If a heading genuinely does not apply (e.g. a component with no state), write the heading and say "None — and here is why that matters:" followed by the reason. Never silently omit a heading.

LINE-BY-LINE REQUIREMENT: for every meaningful line of logic, show the real code in a fenced block, then explain it token by token. The user's own example of the depth they want:

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

must be explained as: what \`const\` means and why not let; what the array-destructuring pattern is doing; what \`canvas\` holds; what \`setCanvas\` is and why calling it re-renders; what \`useState\` returns; what the \`<fabric.Canvas | null>\` generic tells the compiler; WHY the initial value is null rather than undefined or a canvas; and WHY this specific project needs the canvas in React state at all rather than in a ref. That is the bar. Do not write "this creates state" and move on.

You may skip closing brackets, imports of obvious things, and pure formatting lines. Never skip logic.
`

const SECTIONS = [
  {
    file: '01-project-map.md',
    title: 'Project Map, File Inventory, and Why the Architecture Looks Like This',
    brief: `Deliver the complete structural picture.

1. A rendered directory tree of the ENTIRE project (source only; exclude node_modules, .next, .git). Annotate each entry with a one-line purpose.
2. A table with a row for EVERY source file listed in the inventory: | Path | Kind | Exports | Purpose in one sentence | Imported by |. Every single file must appear, including features/txt (an empty stray file), the untracked components/ui/* primitives, and hooks/use-mobile.ts. Prove the "Imported by" column with Grep.
3. The import/dependency graph. Render it as a mermaid \`graph TD\` fenced block AND as an indented ASCII tree, because the reader may view this in a plain editor. Show the real edges: which file imports which. Highlight the three hub files (features/editor/types.ts, features/editor/hooks/use-editor.ts, features/editor/components/editor.tsx) and explain why hubs form where they do.
4. Layering: identify the layers actually present (Next.js route layer, feature shell, feature components, feature hooks, feature types, shared UI primitives, shared utils) and state the dependency direction rule each layer obeys — and any place the code violates its own rule.
5. WHY this architecture. Explain feature-folder / colocation architecture ("features/editor/*" owning its own components, hooks, and types) versus a type-first layout ("components/", "hooks/", "types/" at root). Explain what this project gains from it, what the split between components/ui (generic, app-agnostic, generated by shadcn) and features/editor/components (app-specific) buys, and what would happen to this structure if a second feature (say features/projects/) were added.
6. Naming and consistency audit: catalogue the real inconsistencies (utilis.ts vs utils, use-canva-events vs canvas, Siderbar vs Sidebar, getActiveSTROKEWIDTH screaming case vs changeStrokeWidth camelCase, Fill_COl vs stroke_WIDTH vs Circle_Options casing). Explain why naming consistency is a real engineering concern and not pedantry, using this codebase's own grep-ability as the argument.
7. Where a newcomer should start reading, in order, and why that order.

Use the Next.js briefing below for anything you say about the app/ directory.`,
    extra: () => 'NEXT.JS 16 BRIEFING (authoritative, from shipped docs):\n' + nextDocs,
  },
  {
    file: '02-deep-dive-use-editor.md',
    title: 'Deep Dive: features/editor/hooks/use-editor.ts — the heart of the application',
    brief: `This is the single most important file in the project and deserves the longest treatment in the whole report. Cover features/editor/hooks/use-editor.ts exhaustively with the full template.

Then go far beyond the template:
- Explain the TWO-PART structure of this file: the plain function buildEditor (not a hook, no React inside it) and the hook useEditor. Explain WHY the author separated them: buildEditor is a pure factory that closes over values handed to it, so it is trivially testable and has no hook rules; useEditor owns React state and lifecycle. This is the "factory + hook" pattern.
- Walk the WorkspaceObject type alias and getWorkspace(). Why is a cast needed? What is the "clip" magic string and where else does it appear (grep for it — it is also in use-auto-resize.ts and in init)? Explain the coupling risk of a magic string shared across files.
- Walk center() and addToCanvas() line by line. Explain canvas._centerObject — an UNDERSCORE-PREFIXED private Fabric API. Explain what depending on a private API means for upgrades. Explain the ordering in addToCanvas: center, then add, then setActiveObject — and what would break if the order changed.
- Walk EVERY method returned in the object literal. For the four change* methods, explain the identical two-step shape they all share (set React state, then loop canvas.getActiveObjects() and mutate each Fabric object, then renderAll) and explain precisely WHY both steps exist and what each one is for. This dual-write is the central architectural idea of the whole app and the source of its subtlest bugs — make the reader understand it deeply.
- Explain changeStrokeColor's special case for text (isTextType -> set fill instead of stroke) and why text is different.
- Walk EVERY getActive* getter. Explain the shared shape: read selectedObjects[0], fall back to hook state. Explain WHY the fallback exists (nothing selected -> show the value that a NEW shape would get) and why the same fallback becomes a bug when the property read is wrong. Use the already-fixed get("stroke-width") -> get("strokeWidth") incident as the worked example: show why a wrong key produced "the slider remembers the last element's value", and teach the general lesson about silent fallbacks masking read failures.
- Walk the six add* shape factories. Note that each spreads a *_Options constant from types.ts and THEN overrides fill/stroke/strokeWidth/strokeDashArray from the live hook state — explain why the explicit override after the spread is what makes the option constants' strokeWIDTH typo harmless, and what would happen if the spread came second.
- Walk useEditor: every useState with its generic and its initial value, the useAutoResize and useCanvasEvents calls, the useMemo that builds the editor and its full dependency array, and the init useCallback with its empty dependency array.
- Analyse the useMemo dependency array in detail: what re-runs when, what a new editor object identity means for every consumer, and why setFillColor/setStrokeColor/setStrokeWidth are listed even though React guarantees setState identity is stable.
- Walk init() line by line: the FabricObject.ownDefaults mutations (GLOBAL mutation of a library default — explain the implications), the workspace Rect with name/fill/selectable/hasControls/shadow, setDimensions, add, centerObject, clipPath assignment, and the two setState calls that finally wake the rest of the app up.
- Explain why init is a useCallback with [] deps and how that interlocks with the useEffect in editor.tsx that depends on [init]. Trace what would happen if init were NOT memoized: infinite canvas re-creation. Make the reader feel this.
- End with a "if you understand only one thing about this file" paragraph.`,
  },
  {
    file: '03-deep-dive-hooks.md',
    title: 'Deep Dive: the supporting hooks (use-canva-events, use-auto-resize, use-mobile)',
    brief: `Full template treatment for each of:
- features/editor/hooks/use-canva-events.ts
- features/editor/hooks/use-auto-resize.ts
- hooks/use-mobile.ts (note: this one is currently imported by nothing in the app except possibly components/ui/sidebar.tsx — prove it with Grep)

For use-canva-events.ts specifically:
- This is THE bridge from Fabric's imperative event world into React's declarative state world. Make that framing explicit and central.
- Walk the useEffect: the canvas null guard, each of the three canvas.on registrations, e.selected and the \`|| []\` fallback, the clearSelectionCallback optional call with ?.(), and the cleanup function's three canvas.off calls.
- Explain the dependency array [canvas, clearSelectionCallback, setSelectedObjects] and trace what happens on every re-run: handlers are torn down and re-registered. Then trace where clearSelectionCallback comes from (editor.tsx's onClearSelection useCallback, which depends on [activeTool]) and reason carefully about how often this effect actually re-runs in practice. State whether that is a real problem or merely wasteful, and show your reasoning.
- Explain why setSelectedObjects (a setState function) is a stable identity and therefore harmless in the deps.
- Explain what events are NOT listened for and what functionality that absence blocks (e.g. no object:modified means no dirty-tracking, no undo/redo history, no autosave trigger). Connect this to why Undo/Redo/Save are unimplemented.

For use-auto-resize.ts specifically:
- Explain ResizeObserver: what it is, why a resize listener on window would be insufficient here, and how observe/disconnect pair up with the effect lifecycle.
- Walk autoZoom line by line: the guard, reading container.offsetWidth/offsetHeight, canvas.setDimensions, getVpCenter, the hardcoded 0.85 zoomRatio (explain the "breathing room" intent), the getObjects().find for the "clip" workspace (note the duplication with getWorkspace in use-editor.ts and discuss whether it should be shared), fabric.util.findScaleToFit, setViewportTransform with [...fabric.iMatrix] as a reset, zoomToPoint, then the manual viewport matrix maths.
- Explain the viewport transform matrix itself: what a TMat2D [a,b,c,d,e,f] means, why indices 4 and 5 are translation, and derive why \`canvas.width / 2 - workspaceCenter.x * nextTransform[0]\` centres the workspace. Do the algebra for the reader.
- Explain the existing comment about copying the matrix before editing it, and why mutating canvas.viewportTransform in place would be a bug. This is a real lesson about aliasing.
- Explain the \`await localWorkSpace.clone()\` — why clone at all, why it is async in fabric 7, and what the async gap means if a resize fires again mid-await (interleaving hazard). Label this as a risk with the reasoning.
- Explain why autoZoom is a useCallback and how its identity feeds the effect's dependency array.

For use-mobile.ts: the matchMedia pattern, the undefined initial state and why (SSR-safe: no window on the server), the double bookkeeping (listener + immediate set), and the \`!!isMobile\` coercion at the end. Explain the hydration reasoning even though this hook is barely used here.`,
  },
  {
    file: '04-deep-dive-types-and-utils.md',
    title: 'Deep Dive: features/editor/types.ts, features/editor/utilis.ts, lib/utils.ts',
    brief: `Full template treatment for features/editor/types.ts, features/editor/utilis.ts, and lib/utils.ts.

For features/editor/types.ts — treat it as the project's CONTRACT FILE and explain why a shared types module becomes the hub of a codebase:
- selectionDependTools: what it is for, who reads it (editor.tsx's onClearSelection), why these particular tools depend on a selection, and why it is typed as string[] rather than ActiveTool[]. Explain the consequence: a typo in this array would not be caught by the compiler. Show what typing it as ActiveTool[] would buy.
- colors: the material-colors import, the "500" index, and the "transparent" entry. Connect it to color-picker.tsx's CirclePicker and to rgbaObjectTostring's dead "transparent " branch.
- The ActiveTool union: enumerate all 15 members, mark which ones have a real sidebar and which are declared-but-unbuilt, and explain what a string-literal union buys over \`string\` (exhaustive checking, autocomplete, refactor safety).
- EditorHookProps: a one-member interface with an optional callback. Explain why optional, and how the ?. call site in use-canva-events.ts pairs with it.
- BuildEditorProps: explain why this is a \`type\` while Editor is an \`interface\` — is there a reason, or is it inconsistency? Explain the general type-vs-interface guidance and judge this case honestly.
- The Editor interface: this is the PUBLIC API that every sidebar programs against. Go member by member. Explain that the sidebars depend on this interface and not on Fabric directly, and why that is the single best architectural decision in the project.
- Cross-check the Editor interface against what buildEditor actually returns. Report any drift exactly.
- The default constants (Fill_COl, Stroke_COl, stroke_WIDTH, stroke_Dashed_Array) — note the naming inconsistency, and note that stroke_Dashed_Array = [] infers as never[]. Explain what never[] means, why \`useState<number[]>(stroke_Dashed_Array)\` still compiles, and where an explicit \`: number[]\` annotation would be better.
- The four *_Options constants. CAREFULLY compare their keys against real Fabric options. Point out \`strokeWIDTH\` (which is not a Fabric property) in all four, and explain precisely why this is currently harmless (buildEditor overrides strokeWidth after the spread) while still being latent debt. Also examine Circle_Options having both height:100 and radius:225 and explain which one Fabric honours for a circle.

For features/editor/utilis.ts:
- isTextType: the union parameter \`string | undefined\`, why undefined is allowed (Fabric's object.type can be undefined in the type defs), the three type strings, and who calls it (changeStrokeColor).
- rgbaObjectTostring: the RGBColor type imported from react-color, the \`"transparent "\` literal WITH A TRAILING SPACE in both the type union and the comparison, the \`rbga(\` typo in the returned string, and the alpha-undefined guard. Establish carefully whether this branch is dead code by tracing what color-picker.tsx actually passes in (color.rgb, always an object). Then explain the general lesson: a bug in unreachable code is still a bug, because the code becomes reachable the moment someone wires up the transparent swatch.

For lib/utils.ts: the cn helper, what clsx does, what twMerge does and the specific conflict-resolution problem it solves (later Tailwind class wins even when the strings come from different sources), the ClassValue type, the rest parameter, and why nearly every component in the project imports this one function.`,
  },
  {
    file: '05-deep-dive-editor-shell.md',
    title: 'Deep Dive: features/editor/components/editor.tsx and the app/ route layer',
    brief: `Full template treatment for features/editor/components/editor.tsx, app/layout.tsx, app/page.tsx, and app/editor/[projectId]/page.tsx.

features/editor/components/editor.tsx is the ORCHESTRATOR — the component that owns the tool state, creates the Fabric canvas, and wires every sidebar to the editor object. Give it the deepest treatment in this section:
- The "use client" directive on line 1: what it does, where the client boundary now falls, and which of its children therefore become client components automatically. Enumerate them.
- activeTool useState with the ActiveTool generic and "select" initial value.
- onChangeActiveTool useCallback: walk every branch, including the toggle-off behaviour (\`if (tool === activeTool) return setActiveTool("select")\`) — explain the \`return setState(...)\` idiom returning void, and explain the two empty draw-mode TODO branches. Explain the [activeTool] dependency and what a new function identity means for children.
- onClearSelection useCallback: how it reads selectionDependTools, why it exists (if you deselect everything while the Fill sidebar is open, that sidebar has nothing to act on), and how it is passed DOWN into useEditor and then further down into useCanvasEvents to be invoked by a Fabric event. Trace this full loop explicitly: React -> hook -> hook -> Fabric event registration -> Fabric fires -> React state changes. It is the clearest example of the callback-down / event-up pattern in the project.
- The useEditor call and destructuring of { init, editor }.
- canvasRef and containerRef: useRef<HTMLCanvasElement>(null) and useRef<HTMLDivElement>(null). Explain refs vs state in depth: why a DOM node must not live in state, what .current means, when it is populated relative to render and effects, and why the null generic is required.
- The useEffect that creates the Fabric canvas: the guard on both refs, \`new fabric.Canvas(canvasRef.current, { controlsAboveOverlay: true, preserveObjectStacking: true })\` — explain BOTH options and what visibly changes without them. The init() call. The cleanup returning canvas.dispose() and why disposal matters (React 19 StrictMode double-invokes effects in dev, so without dispose you would leak a canvas and get duplicated event handlers). The [init] dependency and its interlock with init's useCallback([]).
- The non-null assertion \`containerRef.current!\` and why it is redundant given the guard above it — a small but real teaching moment about ! versus narrowing.
- The JSX tree: explain the full layout structure, the h-full flex column, the absolutely-positioned h-[calc(100%-68px)] top-[68px] row and how it relates to the 68px Navbar, the five sidebars all rendered ALWAYS and hidden via CSS (explain this design choice versus conditional rendering — the tradeoff is DOM weight and mounted state versus mount/unmount cost and state loss), the <main> region, and the container div whose ref drives useAutoResize.
- The Toolbar's \`key={JSON.stringify(editor?.canvas.getActiveObject())}\` — analyse this carefully. Explain what a changing key does (full unmount + remount of Toolbar), why the author reached for it, that it runs JSON.stringify on a Fabric object on EVERY render of Editor, and what Fabric's own toJSON does that keeps it from throwing on circular references. Judge whether this is a good idea and describe the cheaper alternative.

For app/layout.tsx: the Metadata type import and export, next/font/google Geist and Geist_Mono with the variable option and how those CSS variables connect to app/globals.css's @theme inline, the Readonly<{children: React.ReactNode}> props type, and the html/body requirement.
For app/page.tsx: it is a stub. Say so and explain what it means that the real app lives only at /editor/[projectId].
For app/editor/[projectId]/page.tsx: five lines. Explain the dynamic segment, that params is never read, what URL actually loads the editor, and — using the Next 16 briefing below — what the correct v16 typing of page props would be if the developer wanted the projectId.`,
    extra: () => 'NEXT.JS 16 BRIEFING (authoritative, from shipped docs):\n' + nextDocs,
  },
  {
    file: '06-deep-dive-chrome.md',
    title: 'Deep Dive: the app chrome (navbar, toolbar, sidebar, sidebar-item, footer, logo, hint)',
    brief: `Full template treatment for each of:
- features/editor/components/navbar.tsx
- features/editor/components/toolbar.tsx
- features/editor/components/sidebar.tsx
- features/editor/components/sidebar-item.tsx
- features/editor/components/footer.tsx
- features/editor/components/logo.tsx
- components/hint.tsx

For toolbar.tsx give the most depth — it is the contextual property bar and it is where several real defects live:
- The commented-out selectedObject/getProperty block at the top and the commented-out useState at the bottom: read them as archaeology. Explain what the author was reaching for (local mirrored property state) and why they backed off.
- \`const FILLCOLOR = editor?.getActiveFillCOLOR();\` — optional chaining, the undefined case, and what a \`backgroundColor: undefined\` inline style renders as.
- The early return when \`editor?.selectedObjects.length === 0\`. Reason carefully about the case where editor itself is undefined (first render, before init runs): \`undefined === 0\` is false, so the full toolbar renders with undefined colors. Explain the difference between \`editor?.x === 0\` and \`editor === undefined || editor.x === 0\` and why the distinction matters here.
- Note that this early return sits AFTER the two getter calls but there are no hooks in this component, so it is not a rules-of-hooks violation — explain why, and explain what WOULD make it one.
- The three Hint+Button groups. For the stroke-width button, note its active-highlight condition is \`activeTool === "stroke-color"\` — the same condition as the button above it. Explain the visible symptom precisely.
- The \`h-[56]\` arbitrary Tailwind value with no unit, and what Tailwind does with it.
- How the Toolbar receives a brand-new \`editor\` object on every relevant state change, and how the \`key\` prop from editor.tsx forces it to remount.

For navbar.tsx: enumerate every control, mark each as wired or stubbed (\`onClick={() => {}}\`), explain the base-ui DropdownMenu with its \`render={<Button/>}\` prop (contrast with Radix's asChild), the \`modal={false}\` prop, the static "Saved" indicator with BsCloudCheck, the \`tex-xs\` class typo, and the Export menu that exports nothing. Be clear that this is a UI shell awaiting features — that is a legitimate build order, not necessarily a defect — but the user-visible consequence is buttons that do nothing.

For sidebar.tsx and sidebar-item.tsx: the six SidebarItem instances, the \`icon: Icon\` destructuring-with-rename that turns a prop into a JSX-renderable component (explain WHY the capital letter is required by JSX), the LucideIcon type, the isActive optional prop and the cn() conditional class, and the fact that four of the six items open nothing.

For components/hint.tsx: the HintProps interface, \`children: React.ReactElement\` (why ReactElement and not ReactNode here, given the render prop), the lowercase \`sideoffset\`/\`alignoffset\` props being mapped onto base-ui's camelCase \`sideOffset\`/\`alignOffset\` (explain why the author had to rename and what would break if they had spread props blindly), the TooltipProvider being instantiated per-hint rather than once at the root (explain the cost), and the \`border-Slate-800\` capital-S class typo.

For footer.tsx and logo.tsx: short but complete. For logo.tsx explain next/image with \`fill\` and why the parent needs \`relative\`.`,
  },
  {
    file: '07-deep-dive-tool-sidebars.md',
    title: 'Deep Dive: the tool sidebars (shapes, fill, stroke color, stroke width, color picker)',
    brief: `Full template treatment for each of:
- features/editor/components/shape-sidebar.tsx
- features/editor/components/shape-tool.tsx
- features/editor/components/fill-color-sidebar.tsx
- features/editor/components/strokecolor-sidebar.tsx
- features/editor/components/strokewidth-sidebar.tsx
- features/editor/components/color-picker.tsx
- features/editor/components/tool-sidebar-header.tsx
- features/editor/components/tool-siderbar-close.tsx

Open with the SHARED SHAPE all four sidebars follow, because recognising a repeated pattern is the core skill this section teaches. Every one of them: takes the identical three props (activeTool, editor, onChangeActiveTool); computes a current value from an editor getter with a default fallback; defines onClose that sets the tool back to "select"; defines an onChange that calls an editor mutator; and renders <aside> + ToolSidebarHeader + ScrollArea + ToolSideBarClose with a cn() visibility toggle keyed to activeTool. Draw that skeleton once, then explain each file as a variation on it. Then argue both sides of whether this repetition should be extracted into a shared <ToolSidebar> wrapper.

For strokewidth-sidebar.tsx go deepest — this is the file the user was just debugging:
- \`const widthValue = editor?.getActiveSTROKEWIDTH() || stroke_WIDTH;\` — walk the optional chaining, then dissect the \`||\` versus \`??\` distinction concretely: a legitimate strokeWidth of 0 would be replaced by 2. Explain that today the Slider's min={1} hides this, and that the bug becomes live the moment someone lowers min to 0. This is exactly the class of bug that just bit this file, so make the lesson land.
- The controlled Slider: \`value={[widthValue]}\` wrapping a number in an array (explain why base-ui sliders take arrays — multi-thumb range support), min/max/step, and the onValueChange handler with its \`Array.isArray(values) ? values[0] : values\` defensive normalisation. Read components/ui/slider.tsx and explain what the wrapper actually passes through and what SliderPrimitive.Root.Props typing gives you.
- Explain the full controlled-component loop for this slider: the value comes from the Fabric object via the editor getter, the user drags, onValueChange fires, the editor mutator writes to both React state and the Fabric object, the editor object identity changes, this component re-renders, the getter re-reads the Fabric object, and the thumb lands. Emphasise that the slider's position is NOT stored locally — it is derived from the canvas every render. That is why a broken getter looked like "the slider remembers the old value".
- The stroke-type buttons: the \`JSON.stringify(typeValue) === "[]"\` and \`=== "[5,5]"\` comparisons. Point out that JSON.stringify([5,5]) produces "[5,5]" with no spaces so this happens to work, and explain why comparing arrays by stringifying them is fragile (spacing, ordering, number formatting) and what a real comparison would look like.
- The leftover \`console.log("button clicked")\` in onChangeStrokeType.
- The dashed-array default \`stroke_Dashed_Array = []\` and how the "solid" button's active highlight behaves for a fresh shape.

For color-picker.tsx: this is the most sophisticated file in the components layer. Explain the next/dynamic imports with ssr:false, read the existing code comment about react-color's Checkboard emitting url(null) on the server, and explain hydration mismatch as a concept from first principles — what the server renders, what the client renders, why React complains, and why ssr:false is the correct fix rather than suppressHydrationWarning. Explain the \`loading:\` placeholder and why its dimensions matter (layout shift). Explain \`.then((mod) => mod.ChromePicker)\` and why a named export needs that mapping. Explain onChange versus onChangeComplete and why ChromePicker uses the continuous one while CirclePicker uses the completed one. Explain how color.rgb flows into rgbaObjectTostring and out as a CSS string that Fabric can consume.

For shape-sidebar.tsx and shape-tool.tsx: the six ShapeTool instances, the \`icon: LucideIcon | IconType\` union prop that lets both lucide and react-icons components be passed, the iconClassName escape hatch and its use for rotate-180 on the inverse triangle, and the fact that ShapeTool renders a bare <button> rather than the project's own Button component (note the inconsistency).

For tool-sidebar-header.tsx: the optional description and the \`{description && (...)}\` conditional-render idiom — explain the && rendering trap with falsy values like 0.
For tool-siderbar-close.tsx: the absolute-positioned tab, the \`group\` / \`group-hover:\` Tailwind pattern.`,
  },
  {
    file: '08-deep-dive-ui-primitives.md',
    title: 'Deep Dive: the shared UI layer (components/ui/*, globals.css, components.json)',
    brief: `Explain the shared, app-agnostic UI layer and — crucially — WHY it is separate from features/editor/components.

Read and cover every file in components/ui/: button.tsx, dropdown-menu.tsx, scroll-area.tsx, separator.tsx, tooltip.tsx, input.tsx, label.tsx, sheet.tsx, sidebar.tsx, skeleton.tsx, slider.tsx. For each: what it wraps, what it exports, and whether the project actually uses it (prove with Grep — several are unused scaffolding, and saying which ones is useful to the reader).

Give button.tsx the full file template, because it teaches the most:
- \`cva\` from class-variance-authority: what a variant system is, walk the base class string, the variants object with variant and size, and defaultVariants. Explain why this beats a pile of conditional className logic.
- \`VariantProps<typeof buttonVariants>\` — a genuinely advanced TypeScript idiom. Explain \`typeof\` on a value to get its type, and how VariantProps extracts the union of allowed variant/size strings so that \`variant="ghost"\` autocompletes and \`variant="ghsot"\` fails to compile. This is one of the best generics lessons available in this codebase.
- \`interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<...>\` — interface extension from two sources, and why extending the native button attributes is what makes \`onClick\`, \`disabled\`, \`type\` all work for free.
- \`React.forwardRef<HTMLButtonElement, ButtonProps>\` — what forwarding a ref means, why base-ui's \`render={<Button/>}\` pattern REQUIRES it, and what breaks without it. Note that React 19 no longer requires forwardRef for function components and discuss whether this file is written in the older style.
- \`{...props}\` spread and \`displayName\`.

Give slider.tsx the full template too, since it drives the stroke-width feature: the \`SliderPrimitive.Root.Props\` namespaced type, the \`_values\` fallback chain, and the \`Array.from({length: _values.length}, ...)\` thumb generation that makes multi-thumb work.

Then explain the shadcn/base-ui architecture generally:
- Read components.json. Explain that \`"style": "base-nova"\` means these were generated against @base-ui/react, not Radix. Explain the practical difference the reader will hit constantly: base-ui uses a \`render={<El/>}\` prop where Radix used \`asChild\`, which is why components/hint.tsx says \`<TooltipTrigger render={children} />\` and navbar.tsx says \`<DropdownMenuTrigger render={<Button size="sm" variant="ghost" />}>\`. Warn that most shadcn tutorials and most training data assume Radix, so copy-pasted snippets will not work here.
- Explain the copy-in (not npm-dependency) philosophy of shadcn: these files are YOURS to edit, which is why they sit in the repo and are diffable, and what that costs (no upgrades).

Finally, app/globals.css: Tailwind v4's \`@import "tailwindcss"\` replacing the v3 directives, \`@import "shadcn/tailwind.css"\`, \`@custom-variant dark\`, the \`@theme inline\` block mapping --color-* design tokens onto CSS custom properties, the oklch() color values in :root (explain oklch briefly and why it is used over hex), and how --font-geist-sans set by next/font in app/layout.tsx lands in --font-sans here. Also cover postcss.config.mjs. Explain that there is NO tailwind.config file and why that is correct for v4 — connect it to components.json's empty \`"config": ""\`.`,
    extra: () => 'CONFIG & DEPENDENCY BRIEFING (authoritative):\n' + configRecon,
  },
  {
    file: '09-execution-flow.md',
    title: 'Complete Execution Flow: from URL to painted canvas',
    brief: `Trace the REAL boot sequence of this application, discovered from the code, not assumed.

Produce a numbered, ordered trace. For EVERY step give exactly these fields:
- Step number and a short name
- File path
- Component / hook / function name
- What enters (inputs, props, arguments — be concrete)
- What happens (the actual work)
- What leaves (return value, side effect, state written)
- What runs next, and why

The trace must cover, in true order:
1. The browser requesting a URL. State the exact URL that loads the editor and note what / renders instead.
2. Next.js App Router resolving app/layout.tsx then app/editor/[projectId]/page.tsx on the SERVER. Say explicitly which components render on the server and which do not, and why.
3. The "use client" boundary at features/editor/components/editor.tsx and what the server actually sends for that subtree.
4. Hydration on the client.
5. Editor's FIRST render: activeTool = "select"; useEditor called; canvas state is null so the useMemo returns undefined; therefore \`editor\` is undefined. Walk through what every child renders while editor is undefined — this is a real and often-missed phase, and Toolbar's behaviour during it is worth dwelling on.
6. Refs attach as the DOM commits.
7. The useEffect in editor.tsx fires: new fabric.Canvas(...) constructed over the <canvas> element.
8. init() runs inside use-editor.ts: global FabricObject.ownDefaults mutations, the workspace Rect created with name "clip", setDimensions, add, centerObject, clipPath, then setCanvas and setContainer.
9. Those two setState calls trigger Editor's SECOND render. Now the useMemo has a canvas, so buildEditor runs and \`editor\` becomes a real object for the first time.
10. useAutoResize's effect attaches a ResizeObserver, which fires immediately on observe, running autoZoom and producing the first correctly zoomed, centred view.
11. useCanvasEvents' effect registers the three selection handlers on the canvas.
12. Steady state: what is now true, what is listening, and what the user sees.

Then add a second trace: the STEADY-STATE UPDATE CYCLE. Pick a concrete change (the user drags the stroke-width slider) and trace one full turn of the loop through every file, showing precisely where React re-renders, where Fabric re-renders, and why both are needed.

Then add a third trace: TEARDOWN. What happens on unmount / navigation away — the effect cleanups in reverse order, canvas.dispose(), ResizeObserver.disconnect(), canvas.off(). Explain why order matters and what leaks if any of these is skipped.

Include a mermaid sequenceDiagram for the boot sequence AND an ASCII version of the same. Then state plainly, in a short list, the three or four non-obvious things about this boot order that would surprise a developer reading the code for the first time.`,
    extra: () => 'NEXT.JS 16 BRIEFING (authoritative, from shipped docs):\n' + nextDocs,
  },
  {
    file: '10-user-action-traces.md',
    title: 'User Action Traces: thirteen features, followed end to end',
    brief: `Trace each user action below through the REAL code. Use exact file paths, exact component names, exact function names, and exact line references you have personally read.

Use this consistent format for each: a header, a one-line summary of what the user does, then a numbered hop-by-hop trace where each hop names the file, the function, what data moves, and what the next hop is. Finish each with "What the user sees" and "What is now true in memory (React state and Fabric objects)".

IMPLEMENTED — trace fully:
1. Creating an element (click Shapes in the left rail, then click the circle tile). Trace from SidebarItem's onClick through onChangeActiveTool, the activeTool state change, ShapeSidebar becoming visible via cn(), ShapeTool's onClick, editor.addCircle, the new fabric.Circle with the spread options and the live-state overrides, center(), canvas.add, canvas.setActiveObject, and then the selection:created event firing back into React. Emphasise that adding a shape also SELECTS it, so the Toolbar appears — a two-effect single click.
2. Selecting an element (click on a shape on the canvas). Trace Fabric's internal hit-testing to selection:created, the handler in use-canva-events.ts, setSelectedObjects, Editor re-render, the useMemo rebuilding the editor with a new selectedObjects array, and every getter in every sidebar now reading the new object.
3. Changing fill color. FillColorSidebar -> ColorPicker -> ChromePicker onChange -> rgbaObjectTostring -> onChange -> editor.changeFillColor -> setFillColor + getActiveObjects().forEach(set fill) -> renderAll.
4. Changing stroke color. Same path via StrokeColorSiderbar and changeStrokeColor, but include the isTextType branch that writes fill instead of stroke for text objects, and note the resulting asymmetry with getActiveSTROKECOLOR which always reads stroke.
5. Changing stroke width. Full trace through StrokeWidthSiderbar's Slider. Include the historical bug: getActiveSTROKEWIDTH used to read get("stroke-width") which is not a Fabric property, so it always returned the hook-state fallback, which made the slider show the previously-set value when a different element was selected. It now reads get("strokeWidth"). Present this as a worked debugging case study — it is the single best teaching example in the codebase.
6. Changing stroke/dash type. The two buttons, changeStrokeDashedArray, the strokeDashArray property, and the JSON.stringify comparison used for the active highlight.
7. Deselecting everything (click empty canvas). selection:cleared -> setSelectedObjects([]) -> clearSelectionCallback -> onClearSelection in editor.tsx -> selectionDependTools.includes(activeTool) -> possibly setActiveTool("select") -> the open sidebar closes itself. This is the most interesting round trip in the app; give it full depth.
8. Resizing the browser window. ResizeObserver -> autoZoom -> viewport transform recomputed -> requestRenderAll.
9. Toggling a tool that is already active (clicking Shapes twice). The toggle-off branch in onChangeActiveTool.

NOT IMPLEMENTED — for each, state plainly that it does not exist, show the exact stub code that proves it, name the file and line, explain what the UI currently does when clicked, and then sketch concretely where the implementation would have to go (which file, which function, what state, which Fabric API). Be specific enough to be actionable:
10. Deleting an element — there is no delete handler and no keyboard listener anywhere. Prove it with Grep.
11. Undo — navbar.tsx Undo2 button, onClick={() => {}}. Explain what a history stack would need (a canvas:object:modified listener, JSON snapshots, an index pointer) and why use-canva-events.ts currently listens to no mutation events at all.
12. Redo — same.
13. Export (PNG / JPG / SVG / JSON) — navbar.tsx Export menu, four items all with empty handlers. Explain which Fabric APIs would serve each format and why the workspace clipPath complicates a clean export.
14. Saving and Loading — the "Saved" indicator is static text; the File > Open item does nothing. There is no API route, no database, no localStorage. Prove it.
15. API / backend / auth — none. @clerk/nextjs is installed and imported by zero files; drizzle-kit is a devDependency with no schema, no drizzle config, and no db directory. Prove all of this with Glob and Grep and state it unambiguously so the reader is not left wondering.

Close with a short table: | Feature | Status | Where it lives (or would live) |.`,
  },
  {
    file: '11-fabric-architecture.md',
    title: 'The Fabric.js Editor Architecture',
    brief: `Explain the complete canvas architecture. Assume the reader has never used Fabric.js. Fabric version is 7.4.0 — verify API claims against ${REPO}/node_modules/fabric/ type definitions rather than memory.

Cover, in order, each as a real section:
1. What Fabric.js IS and what problem it solves. A raw HTML <canvas> is an immediate-mode pixel surface with no notion of objects: once you draw a rectangle you cannot select it, move it, or ask what colour it is. Fabric adds a retained-mode object model on top — a scene graph, hit testing, selection handles, transforms, serialisation. Make the reader understand why this project could not reasonably be built on raw canvas.
2. How the canvas is created: the <canvas ref={canvasRef}/> element in editor.tsx, the useEffect, and \`new fabric.Canvas(el, { controlsAboveOverlay: true, preserveObjectStacking: true })\`. Explain both options concretely — what visibly changes if each is false.
3. How it is initialised: init() in use-editor.ts. The FabricObject.ownDefaults block, and why mutating a library's global defaults is both convenient and dangerous. Every option set on the workspace Rect. setDimensions vs the element's intrinsic size.
4. The WORKSPACE concept. This is the idea a newcomer will not guess: the white "page" is not a canvas background, it is an ordinary Fabric Rect that is marked with name:"clip", made non-selectable and control-less, and then ALSO assigned as canvas.clipPath so everything outside it is clipped away. Explain the double duty this one object performs. Explain how it is found again later (getObjects().find(o => o.name === "clip")) in TWO different files and why that duplicated lookup and shared magic string is a coupling risk. Explain why it must be excluded from selection.
5. How objects are added: the six add* factories, the option-spread-then-override pattern, center() using canvas._centerObject (a private API) against the workspace's centre rather than the viewport's, and addToCanvas's ordering.
6. How objects are selected: Fabric's own pointer handling and hit testing, single vs shift-multi-select, what an ActiveSelection is, and getActiveObject vs getActiveObjects (singular returns the ActiveSelection wrapper for a multi-select; plural returns the members). Explain why every mutator in buildEditor uses the PLURAL form.
7. How selectedObjects is maintained in React: the three event handlers in use-canva-events.ts, e.selected, and the fact that React never polls Fabric — it is told.
8. How Fabric events reach React and what happens next: the setSelectedObjects call, the re-render, the useMemo rebuild, and the fact that a NEW editor object identity is what actually propagates the change to every sidebar.
9. THE DUAL-STATE MODEL — the central idea of the whole report. Fabric objects are the real source of truth for what is on the canvas. React state (fillColor, strokeColor, strokeWidth, strokeDashedArray) is a separate store that serves two jobs: it holds the defaults for the NEXT shape created, and it acts as the fallback when nothing is selected. Every change* method writes to BOTH. Draw this out. Then explain, with total clarity, the class of bug this design invites: if a getter fails to read the Fabric object it silently returns the React fallback, and the UI shows a plausible-but-wrong value instead of an obvious error. Name the already-fixed stroke-width bug as the worked example.
10. The Editor abstraction: why buildEditor exists at all. Explain that without it, every sidebar would import fabric, call canvas.getActiveObjects(), and remember to call renderAll — the canvas API would leak into a dozen files. buildEditor is a facade: one place that knows Fabric, presenting a small vocabulary (changeFillColor, addCircle, getActiveSTROKEWIDTH) to everything else. Explain why the sidebars import the Editor INTERFACE from types.ts and never import fabric, and why that is the project's best architectural decision. Then explain the cost: the editor object is rebuilt on every relevant state change, so it is never referentially stable.
11. Why buildEditor is a plain function and not a hook: no hook rules, trivially unit-testable, and it makes the closure over current state explicit.
12. How changes reach the pixels: canvas.renderAll() versus canvas.requestRenderAll() (which one batches to an animation frame), where each is used in this codebase, and why a mutation without a render call would appear to do nothing.

DIAGRAMS — produce all three:
(a) A mermaid \`graph TD\` of the architecture: React component tree on one side, the editor facade in the middle, the Fabric canvas and its object graph on the other, with labelled arrows for "calls", "mutates", "emits event", "sets state", "reads".
(b) The same diagram as ASCII box art, so it is readable in a plain text editor.
(c) A mermaid \`sequenceDiagram\` for one complete round trip: user clicks a shape on the canvas, Fabric fires selection:created, React state updates, the editor is rebuilt, and every sidebar re-reads its value.

Close with the five sentences a developer should be able to say from memory about how this editor works.`,
  },
  {
    file: '12-state-flow.md',
    title: 'State Flow and the Stale-State Problem',
    brief: `Map every piece of state in the application and how it moves.

1. THE MAIN TABLE. A row for every piece of state, with columns exactly: | State | Type | Defined in | Initial value | Updated by (file + function) | Read by (all consumers) | Purpose |.
Cover at minimum: activeTool, canvas, container, selectedObjects, fillColor, strokeColor, strokeWidth, strokeDashedArray, the editor useMemo value, canvasRef, containerRef, and isMobile in hooks/use-mobile.ts. Distinguish clearly between useState, useMemo, and useRef rows — say which category each is and why the author chose that category.

2. THE OTHER STATE STORE. Explain that Fabric objects hold their own properties (fill, stroke, strokeWidth, strokeDashArray, left, top, angle, scaleX, scaleY) and that this is a SECOND, larger state store that React knows nothing about until an event tells it. Give a table of the Fabric-side properties this app actually reads or writes and which editor method touches each.

3. DIRECTION OF FLOW. Three separate diagrams or clear narratives:
   (a) Downward: activeTool flows from Editor into Navbar, Sidebar, and all four tool sidebars as props.
   (b) Upward: user gestures on the canvas flow from Fabric events into setSelectedObjects and out again as a rebuilt editor object.
   (c) Sideways: the editor object is the conduit through which a sidebar writes to Fabric and reads back from it.
   Explain why there is no Context, no reducer, and no state library here, whether that is appropriate at this size, and what the first symptom of outgrowing it would be (prop drilling through more levels, or two components needing the same derived value).

4. THE REBUILD CASCADE. Explain precisely what happens on any single state change: setState -> Editor re-renders -> useMemo dependency array compares -> buildEditor runs -> a NEW editor object with new function identities -> every child that received editor re-renders -> every getter is called again -> fresh values read from Fabric. Note that no child is wrapped in React.memo, so this cascade is total. Judge the performance cost honestly at this app's size and say what would change that judgement.

5. STALE STATE — the heart of this section. Be thorough and concrete:
   - Define what stale state means here specifically: the UI displaying a value that came from React's default store rather than from the object the user has selected.
   - THE WORKED EXAMPLE: the getActiveSTROKEWIDTH bug that was just fixed. Show the before code \`selectedObject.get("stroke-width") ?? strokeWidth\` and the after \`selectedObject.get("strokeWidth") ?? strokeWidth\`. Walk the exact four-step failure: select A (fallback happens to match, looks fine), drag the slider (A changes AND the shared strokeWidth state changes), select B (fallback returns A's value), user sees B's slider showing A's width. Explain why this bug is so hard to spot: the fallback makes a READ FAILURE look like a WORKING FEATURE.
   - Then systematically audit EVERY other getter and default in the codebase for the same shape. Check getActiveFillCOLOR, getActiveSTROKECOLOR (note it also tries a non-Fabric \`strokeColor\` key), getActiveSTROKEDashArray, and the \`|| default\` fallbacks in all four sidebar components. State for each whether it is currently correct, and what specific input would make it wrong.
   - Explain the \`||\` vs \`??\` hazard as a general rule with the concrete cases in this codebase where a falsy-but-valid value (0 width, empty dash array, "" colour) could be swallowed.
   - Give the reader a REPEATABLE TEST for this class of bug: select two elements with genuinely different values for the property, switch between them, and confirm the control moves. Explain why testing with only one element can never catch it.

6. WHERE ELSE STALENESS CAN ENTER. Fabric mutations that React never hears about (dragging, resizing, rotating an object fires object:modified, which nothing listens to — so the Toolbar's key-based remount is the only thing that refreshes it). Multi-selection where only selectedObjects[0] is read by the getters but all objects are written by the setters — explain the resulting asymmetry precisely and what the user sees when they select two shapes with different fills.`,
    extra: () => 'ADVERSARIALLY-VERIFIED DEFECT DOSSIER (only findings that survived two independent verifiers; use these where relevant and do not contradict them):\n' + BUG_DOSSIER,
  },
  {
    file: '13-typescript.md',
    title: 'TypeScript, Taught Through This Codebase',
    brief: `Teach TypeScript entirely through real examples found in THIS repository. Every single example must be code you have read here, quoted verbatim, with its file path. Do not invent illustrative examples; this codebase has a real instance of nearly everything.

Structure it as: concept -> real code from this repo -> what the compiler does with it -> WHY the author needed it here -> what breaks without it -> a small exercise the reader can try in this repo.

Cover at minimum, and find the best real example for each:
- interface: EditorHookProps, Editor, ButtonProps, HintProps, ToolbarProps, SidebaritemProps, ShapeToolProps, ToolSidebarHeaderProps, ToolSideBarCloseProps, useCanvasEventsProps, useAutoResizProps, and the four *SidebarProps. Use Editor as the flagship example of an interface as a CONTRACT between modules.
- type alias vs interface: BuildEditorProps is a \`type\` while Editor is an \`interface\`. Explain the real differences (declaration merging, extends vs intersection, what can be aliased) and judge whether the inconsistency here is meaningful.
- union of string literals: ActiveTool. Explain exhaustiveness, autocomplete, and refactor safety. Show what \`setActiveTool("shpes")\` does at compile time.
- union of types: \`LucideIcon | IconType\` in shape-tool.tsx, and \`string | undefined\` in isTextType.
- generics: useState<ActiveTool>, useState<fabric.Canvas | null>, useState<fabric.Object[]>, useState<number[]>, useRef<HTMLCanvasElement>(null), React.forwardRef<HTMLButtonElement, ButtonProps>, VariantProps<typeof buttonVariants>, React.ButtonHTMLAttributes<HTMLButtonElement>, Readonly<{children: React.ReactNode}>. Explain what a generic parameter actually DOES for each.
- \`typeof\` used on a value to obtain a type: \`VariantProps<typeof buttonVariants>\` in components/ui/button.tsx. This is the most advanced idiom present; explain it carefully.
- function types as properties: every member of the Editor interface, e.g. \`changeFillColor: (value: string) => void\`, and the props like \`onChangeActiveTool: (tool: ActiveTool) => void\`. Explain reading a function type left to right.
- optional properties: \`description?: string\`, \`isActive?: boolean\`, \`clearSelectionCallback?: () => void\`, \`iconClassName?: string\`, \`side?: "top" | "bottom" | "left" | "right"\`. Explain the difference between optional and \`| undefined\`.
- nullable values and narrowing: \`fabric.Canvas | null\`, the \`if (!canvas || !container) return\` guard, and how control-flow narrowing removes null from the type after the guard.
- optional chaining and nullish coalescing: \`editor?.addCircle()\`, \`clearSelectionCallback?.()\`, \`selectedObject.get("strokeWidth") ?? strokeWidth\`. Contrast \`??\` with \`||\` using the real \`|| stroke_WIDTH\` line in strokewidth-sidebar.tsx.
- type assertions with \`as\`: find EVERY \`as\` in the codebase — \`(object as WorkspaceObject).name === "clip"\` in both use-editor.ts and use-auto-resize.ts, \`value as string\`, \`value as number\`, \`value as number[]\`. For each, explain what the compiler was complaining about, what the assertion silences, and whether it is safe. Explain that \`as\` is a promise you make to the compiler that it cannot verify, and that the number-returning getters are exactly where a wrong promise turned into a runtime bug.
- intersection types: \`type WorkspaceObject = fabric.FabricObject & { name?: string }\` — explain why the author had to invent this and what it says about Fabric 7 dropping \`name\`.
- non-null assertion: \`containerRef.current!\` in editor.tsx. Explain why it is redundant there and when \`!\` is genuinely unavoidable.
- React props typing patterns: destructuring with rename (\`icon: Icon\`), \`React.ReactElement\` vs \`React.ReactNode\` (hint.tsx vs layout.tsx — explain why each chose what it chose), spreading \`...props\`, and extending native element attributes.
- imported types: \`import type { Metadata } from "next"\`, \`import type { LucideIcon }\`, \`import type { IconType }\`, \`import { RGBColor } from "react-color"\`, \`import { clsx, type ClassValue }\`. Explain the \`import type\` / inline \`type\` modifier and why it matters for bundling (type-only imports are erased).
- inference and its limits: \`export const stroke_Dashed_Array = []\` inferring \`never[]\`. Explain what never[] is, why pushing a number into it would fail, why \`useState<number[]>(stroke_Dashed_Array)\` still compiles, and what annotation would fix it.
- library-typed props: \`SliderPrimitive.Root.Props\` in components/ui/slider.tsx — a namespaced type from a library.
- tsconfig: read it and explain how \`strict: true\`, \`moduleResolution: "bundler"\`, \`jsx: "react-jsx"\`, \`isolatedModules\`, and \`paths: {"@/*": ["./*"]}\` each shape the code you have been reading. The path alias in particular explains every \`@/\` import in the project.
- WHAT TYPESCRIPT CANNOT SAVE YOU FROM. This is the most valuable subsection. Show \`strokeWIDTH\` in the *_Options constants and \`get("stroke-width")\` in the old getter: both are strings or keys in loosely-typed positions, so the compiler stayed silent while the code was wrong. Explain the general principle — types check the shape of your program, not the meaning of your strings — and what techniques (keyof, const objects, stricter library typings) would have caught these.`,
    extra: () => 'CONFIG & DEPENDENCY BRIEFING (authoritative):\n' + configRecon,
  },
  {
    file: '14-react.md',
    title: 'React, Taught Through This Codebase',
    brief: `Teach React entirely through real examples found in THIS repository. Every example must be verbatim code from this repo with its file path. Never substitute a textbook example where the project has a real one.

Structure each topic as: concept -> real code here -> what React actually does -> WHY it was needed in this file -> what breaks without it -> an exercise in this repo.

Cover at minimum:
- Components as functions returning JSX: contrast the arrow-function-const style used almost everywhere (\`export const Sidebar = ({...}) => ...\`) with the \`export default function RootLayout\` in app/layout.tsx and the mixed \`export const Editor\` + \`export default Editor\` in editor.tsx. Explain named vs default exports and why editor.tsx does both.
- Props: SidebarItem receives icon/label/isActive/onClick. Show destructuring in the parameter list, the rename \`icon: Icon\`, and WHY the capital letter is mandatory for JSX to treat it as a component rather than an HTML tag. This is a rule beginners get bitten by.
- Component composition and the children prop: RootLayout's children, Hint wrapping arbitrary children, and the sidebars composing ToolSidebarHeader + ScrollArea + ToolSideBarClose.
- useState: every real instance. \`useState<ActiveTool>("select")\` in editor.tsx and the four in use-editor.ts. Explain the array destructuring, that setState is asynchronous and batched, that calling it schedules a re-render, and why \`canvas\` must be in STATE rather than a ref (because the whole app must re-render once it exists — a ref change would not trigger that). Use this comparison to teach state vs ref properly.
- useRef: canvasRef and containerRef in editor.tsx. Explain the two distinct uses of refs (DOM handles and mutable boxes), \`.current\`, when it is populated relative to render, and why putting a DOM node in state would cause an infinite loop.
- Controlled components: the Slider in strokewidth-sidebar.tsx is the best example — its \`value\` comes from the Fabric object via an editor getter and its \`onValueChange\` writes back. Draw the full loop. Contrast with the ColorPicker's \`color\`/\`onChange\` pair. Explain what "uncontrolled" would mean here and why it would break the sync.
- Event handlers: onClick on Buttons and ShapeTool, onValueChange on the Slider, onChange/onChangeComplete on the pickers. Explain inline arrow functions creating a new function each render, and when that matters.
- useEffect: the canvas-creation effect in editor.tsx, the event-registration effect in use-canva-events.ts, the ResizeObserver effect in use-auto-resize.ts, and the matchMedia effect in hooks/use-mobile.ts. For each: what it synchronises with, its dependency array, its cleanup, and what would break with no deps array or with the wrong deps. Explain cleanup functions properly, including React 19 StrictMode double-invocation in development and why canvas.dispose() is what makes that survivable.
- useCallback: onChangeActiveTool, onClearSelection, init, autoZoom. Explain that useCallback preserves function IDENTITY across renders, and that identity only matters when the function is in a dependency array or passed to a memoized child. Then trace the real chain in this app: init is useCallback([]) -> editor.tsx's effect depends on [init] -> a stable init means the canvas is created exactly once. Show what a non-memoized init would do: new identity every render, effect re-runs, canvas disposed and recreated, forever. This is the single clearest useCallback lesson available and it is right here in the code.
- useMemo: the editor object in use-editor.ts. Explain that it is memoizing an OBJECT, not a computation, and that the real purpose is controlling identity: a new editor object is precisely the signal that tells every consumer to re-read. Walk the whole dependency array and explain what each entry triggers.
- Conditional rendering: \`{description && (...)}\` in tool-sidebar-header.tsx (and the && falsy trap), the early return in toolbar.tsx, and the CSS-based \`cn(..., activeTool === "shapes" ? "visible" : "hidden")\` approach in all four sidebars. Compare CSS hiding against conditional mounting: what state survives, what the DOM cost is, and why the author's choice makes reopening a sidebar instant.
- Lifting state up: activeTool lives in Editor, not in Sidebar or Navbar, because several siblings need it. Explain the reasoning and where the state would have to move if a sixth consumer appeared.
- The callback-down / event-up pattern: onClearSelection defined in editor.tsx, passed into useEditor, passed into useCanvasEvents, registered on a Fabric event, and called from outside React entirely. Trace it hop by hop — it is the most sophisticated data flow in the project.
- Keys and remounting: \`key={JSON.stringify(editor?.canvas.getActiveObject())}\` on Toolbar. Explain what keys normally do in lists, what a changing key does to a single element (unmount + remount, losing all internal state), why the author used it as a blunt refresh mechanism, and what the idiomatic alternative would be.
- Custom hooks: useEditor, useCanvasEvents, useAutoResize, useIsMobile. Explain the "use" naming rule, that a custom hook is just a function that may call other hooks, the rules of hooks and where this codebase could violate them, and what each of these four hooks encapsulates. Explain why useCanvasEvents returns nothing at all — a hook can exist purely for its side effect.
- Client vs server components: "use client" in editor.tsx, sidebar.tsx, navbar.tsx, color-picker.tsx and the boundary it draws.

End with "five React habits this codebase will teach you if you read it carefully" and "two things this codebase does that you should not copy".`,
  },
  {
    file: '15-nextjs.md',
    title: 'Next.js 16 in This Project (and only what actually exists)',
    brief: `Explain the Next.js architecture ACTUALLY used here. Do not describe features the project does not use except in a clearly-marked "not used here" list.

Base every framework claim on the SHIPPED docs briefing provided below, and verify anything doubtful yourself by reading ${REPO}/node_modules/next/dist/docs/. The project's AGENTS.md warns explicitly that this version has breaking changes versus older Next.js and that memory is not trustworthy. Where the shipped docs contradict what a developer would expect from Next 13/14/15, call that out loudly in its own subsection, because that is exactly where the reader will get burned.

Cover:
1. App Router, confirmed by the presence of app/ with layout.tsx and page.tsx and the absence of pages/. State how you proved it.
2. The route table: enumerate every route this project actually serves, the file that serves it, and what renders. Include the exact URL shape needed to reach the editor.
3. app/layout.tsx as the root layout: the html and body requirement, the Metadata export (still the default "Create Next App" — a real, if cosmetic, defect), next/font/google with Geist and Geist_Mono, the \`variable\` option, and how those CSS variables reach app/globals.css's @theme inline block. Explain what next/font does at build time and what problem it solves (no layout shift, no external request).
4. The dynamic segment app/editor/[projectId]/page.tsx: what [param] means, how params are passed in v16 specifically (say clearly whether params is a Promise that must be awaited in this version, citing the doc), and the fact that this page ignores params entirely. Then show what the correct v16 signature would look like if the developer wanted projectId — this is the most useful thing in the section.
5. Server Components vs Client Components: the default, what "use client" actually does (marks a module and everything it imports as client), and a precise map of this project's boundary. List which files are server components and which are client, and explain how a client component can be rendered by a server page.
6. next/dynamic with ssr:false in color-picker.tsx: what it does, why it was needed (read the code comment about react-color's Checkboard and url(null)), and — per the v16 docs — any restriction on where ssr:false may be used. Explain the loading placeholder.
7. next/image with the \`fill\` prop and next/link in logo.tsx. Explain why the parent div needs \`relative\` and \`size-8\`, and what next/image does that a plain <img> does not.
8. Styling pipeline: Tailwind v4 via app/globals.css and postcss.config.mjs, with NO tailwind.config file — explain that this is correct for v4 and how it differs from v3.
9. The @/ path alias from tsconfig.json and how Next resolves it.
10. NOT PRESENT — state each plainly and prove it with Glob or Grep: no app/api routes, no route handlers, no server actions ("use server" appears nowhere), no middleware.ts, no .env or .env.local, no loading.tsx, no error.tsx, no not-found.tsx, no generateStaticParams, no generateMetadata, no Image domain config in next.config.ts, no i18n. For each, say in one line what it would be for and whether this project will eventually need it (the [projectId] route strongly implies a future data fetch — say so).
11. next.config.ts: it is empty apart from a comment. Say what that means and when it would need to change.
12. A short "if you came from Next 13/14" migration-hazard list drawn from the shipped docs.`,
    extra: () => 'NEXT.JS 16 BRIEFING (authoritative, from shipped docs — prefer this over any prior knowledge):\n' + nextDocs,
  },
  {
    file: '16-dependencies.md',
    title: 'Dependencies: what is installed, what is actually used, and why',
    brief: `Audit package.json against the real imports in the codebase. Use the authoritative briefing below, but verify the import sites yourself with Grep.

Produce two clearly separated parts.

PART A — ACTUALLY USED. For each package that is genuinely imported somewhere in app/, features/, components/, hooks/ or lib/, write a full subsection: what the package does; what problem it solves; WHY this project needs it specifically; the exact files that import it and what they import; and one concrete example from this codebase. Cover at least: next, react, react-dom, fabric, @base-ui/react, lucide-react, react-icons, react-color, material-colors, clsx, tailwind-merge, class-variance-authority, tailwindcss, tw-animate-css, typescript, and the @types packages that matter.
- For fabric, note the version (7.4.0) and warn that most tutorials and most model training data describe fabric v5/v6, whose API differs (this is directly relevant: the project already tripped over a property-name issue). Say how to check the real API — read the bundled type definitions.
- For @base-ui/react, explain that this is what shadcn's "base-nova" style generates against, and that it is NOT Radix, and that the \`render\` prop replaces \`asChild\`.
- For react-color, note it is an older library, that its types come from @types/react-color, and connect it to the SSR workaround in color-picker.tsx.
- For clsx + tailwind-merge + class-variance-authority, explain the trio together: they solve three different parts of the same problem, and lib/utils.ts's \`cn\` is where two of them meet.
- For lucide-react AND react-icons both being present, explain the overlap and where each is used, and note that shape-tool.tsx's \`LucideIcon | IconType\` union exists precisely because the project uses both.

PART B — INSTALLED BUT UNUSED. For each, prove with Grep that zero source files import it, then explain what it is FOR and what its presence tells you about the developer's intent:
- @clerk/nextjs — authentication. Its presence means auth is planned; nothing is wired.
- drizzle-kit and @types/bcryptjs — a SQL ORM toolkit and password-hashing types. Together with the [projectId] route these strongly signal a planned database and user accounts.
- jsdom — a DOM implementation for Node. Speculate carefully and label it as an assumption: it is often pulled in for server-side canvas/fabric work or for tests; there are no tests here.
- shadcn — note whether it is a runtime dependency or should be a devDependency, and that app/globals.css imports "shadcn/tailwind.css" from it.
Explain the real cost of unused dependencies: install time, supply-chain surface, and — most importantly — the false impression they give a new developer about what the app does.

PART C — a short table: | Package | Version | Used? | Where | One-line reason.
Also note the package.json oddities: both bun.lock and package-lock.json exist (two lockfiles, two package managers — explain why that is a hazard), and the \`ignoreScripts\`/\`trustedDependencies\` fields for sharp and unrs-resolver.`,
    extra: () => 'CONFIG & DEPENDENCY BRIEFING (authoritative):\n' + configRecon,
  },
  {
    file: '17-debugging.md',
    title: 'How to Debug This Project Like a Developer',
    brief: `Teach a repeatable debugging METHOD using this codebase, not a list of tips. The goal is that the reader stops changing code at random and starts forming and testing hypotheses.

1. THE METHOD. State it as explicit steps: reproduce reliably; state the expected value and the observed value in one sentence each; identify the full chain the value travels; then BISECT that chain — check the value at the midpoint first, so each observation halves the search space; when you find the first point where the value is wrong, you have the root cause. Stress that reading the code at the failure site is usually less efficient than bisecting the data path, because the failure site is often correct and merely displaying someone else's mistake.

2. THE FULLY WORKED CASE STUDY: the stroke-width bug. Do this as a narrative the reader can follow and imitate.
   - The symptom, in the user's own words: "I select element B and the slider still shows element A's width."
   - Write out the complete chain, file by file: the Slider in features/editor/components/strokewidth-sidebar.tsx, its \`value={[widthValue]}\`, widthValue from \`editor?.getActiveSTROKEWIDTH()\`, that method in features/editor/hooks/use-editor.ts, its read of selectedObjects[0], selectedObjects from useState in useEditor, set by the handlers in features/editor/hooks/use-canva-events.ts, fed by Fabric's selection events, and finally the Fabric object's own strokeWidth property.
   - Now bisect. The midpoint is: is selectedObjects even updating on selection change? Show the exact console.log to add and where. Give the actual expected output.
   - Show that selectedObjects IS correct, which eliminates the entire event half of the chain in one observation. Emphasise how much work that one check saved.
   - Move to the getter. Show the log that prints both \`selectedObject.get("stroke-width")\` and \`selectedObject.strokeWidth\` side by side, and explain that seeing \`undefined\` next to \`14\` is the moment the root cause is found.
   - Name the root cause precisely and explain why the \`?? strokeWidth\` fallback hid it: a read failure was silently converted into a plausible value. Generalise: any fallback can mask a failure, so when a value is "wrong but reasonable", suspect a silent fallback first.
   - Show the one-word fix and the verification: two elements with genuinely different widths, switch between them, watch the thumb move.

3. TOOLS AND WHERE TO PUT THEM.
   - console.log with labels and object literals: \`console.log({ selectedObjects, widthValue })\` and why the object-literal form is better than bare values.
   - React DevTools: inspecting the Editor component's hooks to watch activeTool and the useEditor state directly, without adding a single line of code.
   - Chrome DevTools breakpoints: conditional breakpoints and how to set one that only fires when a value is undefined.
   - INSPECTING FABRIC AT RUNTIME — the highest-value trick in this project. Because \`canvas\` is not on window, teach the reader to grab it from the editor via a temporary \`window.__c = editor.canvas\` line, or via React DevTools, and then run in the console: \`__c.getObjects()\`, \`__c.getActiveObject()\`, \`__c.getActiveObjects()\`, \`__c.getActiveObject().strokeWidth\`, \`__c.toJSON()\`. Explain that this lets you compare what React THINKS against what Fabric ACTUALLY holds, which is the central question in every bug in this app.
   - The Elements panel for the CSS-hidden sidebars: because all four sidebars are always mounted and hidden with a class, "my sidebar is not showing" is a class problem, not a mount problem. Show how to check.

4. FIVE SPECIFIC FAILURE SCENARIOS, each with a full diagnostic script — what to check, in what order, and what each result eliminates:
   (a) Nothing renders on the canvas at all. (Check refs, check the effect ran, check canvas dimensions are non-zero, check the workspace clipPath, check zoom.)
   (b) A sidebar will not open. (Check activeTool in DevTools, check the cn() condition string, check the toggle-off branch in onChangeActiveTool.)
   (c) A colour change does nothing visually. (Check getActiveObjects() is non-empty, check the property was set on the object, check renderAll was called, check whether the object is a text type taking the fill branch.)
   (d) The canvas is blank after a window resize. (autoZoom, container offsetWidth being 0, the clipPath clone timing.)
   (e) A control shows the wrong value after switching selection. (This is the stale-fallback family — give the general recipe derived from the case study.)

5. HOW TO READ AN UNFAMILIAR FILE IN THIS PROJECT, as a repeatable procedure: read its props/params type first to learn its contract, then find who imports it with Grep, then follow the data it receives backwards to its source, then follow what it emits forwards.

6. WHAT TO DO WHEN YOU CANNOT REPRODUCE — checking whether the code path is even reachable, since several features in this app are stubbed and several ActiveTool values render no sidebar at all.

Every code snippet must be real code from this repo, and every console.log you propose must name the exact file and the exact line to put it on.`,
    extra: () => 'ADVERSARIALLY-VERIFIED DEFECT DOSSIER (use for realistic scenarios):\n' + BUG_DOSSIER,
  },
  {
    file: '18-code-quality.md',
    title: 'Code Quality Review: bugs, risks, architecture, and debt',
    brief: `Write the code-quality review. THIS IS AN ANALYSIS ONLY — do not modify any source file.

You are given a defect dossier below containing findings that already survived two independent adversarial verifiers (a refuter whose job was to kill each finding, and a reproduction tracer who had to produce a click-by-click repro). You are ALSO given the list of findings that were refuted and dropped.

Your job:
- Present the surviving findings, organised and explained for a learner. Do NOT simply dump the JSON.
- Independently spot-check each surviving finding by reading the cited file yourself. If you disagree with one, say so explicitly and explain why; your judgement is the final gate. It is entirely acceptable to demote a finding.
- You may ADD findings the hunt missed, but only ones you can prove by quoting code you have read.

Structure:

## Confirmed bugs
Things provably wrong from the code alone. For each: a clear title; severity with a justification; the file and line; the verbatim code; what is wrong; the exact user-visible symptom; a click-by-click reproduction; the root cause in one sentence; and the shape of the fix described in prose (NOT applied). Order by severity. Where a finding was unanimous across both verifiers versus split, say so — it tells the reader how confident to be.

## Potential risks
Things that need a runtime check or a future condition to become real bugs. State the exact trigger that would make each one live. Include at minimum: the \`|| default\` fallbacks that would swallow a legitimate 0 or empty value if a control's minimum changed; the async gap around \`await localWorkSpace.clone()\` in use-auto-resize.ts if a resize interleaves; the global \`FabricObject.ownDefaults\` mutation in init(); reliance on the private \`canvas._centerObject\` API across a Fabric upgrade; the \`JSON.stringify(getActiveObject())\` key running on every render; and the shared \`"clip"\` magic string duplicated across two files.

## Architecture concerns
Maintainability, not correctness. Cover: the dual source of truth between React state and Fabric objects and the read/write asymmetry it creates (setters write to ALL active objects, getters read only selectedObjects[0]); the four near-identical sidebar components; the duplicated workspace lookup; buildEditor's growth trajectory as a single object literal that will hold thirty methods; the Editor interface needing a manual edit for every new capability; naming inconsistency actively harming grep-ability; and the absence of any test at all.

## Good decisions
Be genuinely appreciative and specific, because a learner needs to know what to imitate. Cover at minimum: the Editor interface as a facade that keeps \`fabric\` out of every component (grep proves the sidebars never import fabric — verify and state this); the feature-folder colocation; buildEditor being a plain testable function rather than a hook; useCallback on init being exactly right and load-bearing; the ssr:false workaround in color-picker.tsx being a correct and well-commented fix for a real hydration bug; the existing explanatory comment about copying the viewport matrix before mutating it; the canvas.dispose() cleanup; and the workspace-as-clipPath idea, which is elegant.

## Technical debt
Ordered by (impact / effort). For each: what it is, what it costs today, what it will cost later, and roughly how big the fix is. Include the misspelled filename utilis.ts and hook file use-canva-events.ts, the \`strokeWIDTH\` keys in the option constants, the empty stray \`features/txt\` file, the leftover \`console.log("button clicked")\`, the commented-out code blocks in toolbar.tsx, the default "Create Next App" metadata, the two lockfiles, the unused dependencies, and the malformed Tailwind classes.

Close with a prioritised "if you had one afternoon, fix these five things, in this order" list with a one-line justification each.`,
    extra: () => 'ADVERSARIALLY-VERIFIED DEFECT DOSSIER (survived two independent verifiers):\n' + BUG_DOSSIER + '\n\nREFUTED AND DROPPED (do NOT present these as bugs; they were investigated and disproven — but you may mention one or two as instructive near-misses if useful):\n' + REFUTED_DOSSIER,
  },
  {
    file: '19-learning-roadmap.md',
    title: 'Your Learning Roadmap Through This Codebase',
    brief: `Build a personalised roadmap for a developer who wants to become able to read, debug, and extend THIS codebase independently. It must be a reverse-engineering path through these actual files, in a deliberate order — never a generic "learn JS then React then Next" curriculum.

Order the stages so each one gives the reader the vocabulary needed for the next. Justify the ordering explicitly at the start.

For EVERY topic use exactly this structure:
### Topic
**Why you need this here:** (tie it to something concrete in this project that you cannot understand without it)
**Files that demonstrate it:** (exact paths, and the specific lines or functions to look at)
**Read them in this order:** (a short reading path)
**After studying it you should be able to explain, without looking:** (3-5 specific questions about THIS codebase that the reader should be able to answer aloud — make them real questions with real answers, e.g. "why is canvas in useState rather than useRef?")
**Exercise:** (a small, concrete, verifiable change to make in this repo, with the expected observable result)

Suggested stages, which you should refine:
Stage 0 — Orient: read the folder structure, the route, and follow one prop from Editor to a leaf component.
Stage 1 — Component and props mechanics: sidebar-item.tsx, shape-tool.tsx, tool-sidebar-header.tsx. The smallest files, read first on purpose.
Stage 2 — State and the tool system: activeTool in editor.tsx, onChangeActiveTool, the cn() visibility pattern, lifting state up.
Stage 3 — The Editor interface as a contract: read features/editor/types.ts before ever opening use-editor.ts. Explain why reading the contract first is the professional habit.
Stage 4 — Fabric fundamentals: what a retained-mode object model is, the canvas, objects, the workspace and clipPath idea.
Stage 5 — The dual-state model: buildEditor's change*/getActive* pairs and the two stores.
Stage 6 — Effects and lifecycle: the canvas-creation effect, cleanup, useCallback identity, and the init interlock.
Stage 7 — The Fabric-to-React event bridge: use-canva-events.ts and the full onClearSelection round trip.
Stage 8 — Rendering and the viewport: use-auto-resize.ts and the transform matrix maths.
Stage 9 — TypeScript as it is actually used here, including what it failed to catch.
Stage 10 — The framework layer: Next 16 App Router, the client boundary, hydration and the ssr:false fix.
Stage 11 — Debugging methodology, using the stroke-width case study.
Stage 12 — Extending the system: adding a property end to end, then a feature that needs new state, then a feature that needs new Fabric events (undo/redo).

Add a realistic time estimate per stage for someone studying part-time, and a short "you are ready to move on when..." checkpoint for each. Finish with a list of the eight questions that, if the reader can answer all of them from memory, mean they genuinely own this codebase.`,
  },
  {
    file: '20-exercises.md',
    title: 'Practical Exercises: seven levels, no solutions given',
    brief: `Write graded exercises using THIS codebase. CRITICAL RULE: do NOT give solutions, do not give the final code, and do not name the exact line to change when finding it is the point of the exercise. Guide the investigation instead.

For every exercise use exactly this structure:
**Goal:** (what should be true when you are done)
**Concept under test:** (the one idea this exercise proves you understand)
**Where to investigate:** (which files to open and what to look for in them — direction, not answers)
**Questions to answer before you write any code:** (3-4 questions that force understanding first; this is the most important field)
**Expected behaviour when correct:** (precisely observable)
**How to verify:** (the exact clicks to perform, including the two-element switch test where a property is involved)
**Common traps:** (what will go wrong, phrased as a hint, never as the answer)
**Stretch:** (a harder variant)

Levels and coverage:

LEVEL 1 — Reading and tiny changes. Change a sidebar's title text. Change the default stroke width and predict what it affects BEFORE running (it affects new shapes and the no-selection fallback — but do not say that; ask them what it affects). Change the material colour palette. Change the 0.85 zoom ratio and explain what you observe.

LEVEL 2 — UI wiring. Add a seventh item to the left rail that maps to an existing ActiveTool value and observe what happens when nothing is registered to render for it. Add a "Duplicate" button to the Toolbar that is visually correct but not yet functional. Fix the stroke-width button's active-state highlight in toolbar.tsx (this is a real bug — make them find it, do not name the line).

LEVEL 3 — A new shape. Add a hexagon or a star to ShapeSidebar and the editor. This crosses four files: an options constant in types.ts, an add method in use-editor.ts, a member on the Editor interface, and a ShapeTool in shape-sidebar.tsx. Ask them to work out the four touchpoints themselves by tracing how addDiamond exists.

LEVEL 4 — A new sidebar control. Add an Opacity sidebar. The "opacity" value already exists in the ActiveTool union and in selectionDependTools, which is a deliberate hint they should discover. This requires a getter, a setter, an interface member, a new component, and registration in editor.tsx. Ask them to enumerate all five before writing anything.

LEVEL 5 — A new Fabric object property. Add corner-radius control for rectangles (rx/ry), which forces them to confront that the control only applies to some object types — the same problem changeStrokeColor solves with isTextType. Or add rotation. Require them to handle the "wrong object type is selected" case.

LEVEL 6 — A complete feature. Pick two: (a) Delete selected object, including a keyboard listener, which raises a genuinely new question — where does a global key handler belong, and how do you avoid deleting while typing in an input; (b) Export to PNG, which forces them to deal with the workspace clipPath and viewport zoom so the export is not a screenshot of the zoomed view; (c) Undo/Redo, the hardest, requiring new Fabric event listeners, a history stack, an index pointer, and care to avoid recording your own restores as new history entries. For each, list the design questions to answer before coding.

LEVEL 7 — Debugging drills. Give three bugs to INTRODUCE deliberately and then find by bisecting the data path, without looking at the diff: (a) change a getter to read a slightly wrong property name and observe how the fallback disguises it; (b) remove a dependency from the useMemo array in use-editor.ts and find which UI stops updating and why; (c) remove the canvas.dispose() cleanup and observe what StrictMode does in development. For each, ask them to WRITE DOWN the symptom, the hypothesis, and the bisection point before investigating. Then have them re-derive the original stroke-width bug from scratch.

Close with a self-assessment checklist: if you completed Levels 1-4 you can maintain this codebase; 5-6 you can extend it; 7 you can own it.`,
  },
  {
    file: '21-mental-model.md',
    title: 'The Developer Mental Model: what to hold in your head',
    brief: `This is the capstone. Answer the question: "If I open this project tomorrow as a developer, what should I understand first?" Assume the reader has read the rest of the report and now needs the compressed, durable version — the thing they would carry in their head into a code review.

Open with a single-paragraph elevator description of what this application is and is not, honestly: a Canva-style graphic editor, currently a working shape-editing canvas with colour and stroke controls, wrapped in a UI shell whose save, export, undo, and auth affordances are present but unwired.

Then deliver eight numbered mental models. Each must be a short, memorable core statement followed by the detail that makes it usable, and each must name the real files it maps onto.

1. ARCHITECTURE MENTAL MODEL. The one-sentence version: "a Next.js page mounts one client component that owns a Fabric canvas and hands every control a single editor facade." Then the layer stack and the dependency direction rule. Include a compact ASCII diagram they could redraw from memory.

2. COMPONENT MENTAL MODEL. There are exactly three kinds of component here and knowing which kind you are looking at tells you what it may do: generic primitives in components/ui (know nothing about the app), chrome and tool sidebars in features/editor/components (know the Editor interface but never import fabric), and one orchestrator, editor.tsx (knows everything and owns the tool state). Give the rule: if you find yourself importing fabric into a sidebar, you are in the wrong layer.

3. STATE MENTAL MODEL. There are two stores, not one. Fabric objects are the truth about what is on the canvas; React state holds the defaults for the next shape and the fallback when nothing is selected. Every change* writes to both; every getActive* reads Fabric first and falls back to React. Then the warning that follows from it: a plausible-but-wrong value in the UI almost always means a failed read silently replaced by the fallback.

4. EDITOR / FABRIC MENTAL MODEL. The editor object is a rebuilt-on-every-change facade over the canvas. The workspace is a Rect named "clip" that doubles as the clipPath. Nothing appears until a render call. Objects are the unit, not pixels.

5. EVENT-FLOW MENTAL MODEL. Two directions and they are asymmetric. Downward: React props carry activeTool and the editor facade to the controls. Upward: Fabric emits selection events, three handlers in use-canva-events.ts push them into React state, and the resulting rebuild of the editor object is the signal that makes every control re-read. Give the memorable form: "React tells Fabric what to change; Fabric tells React what got selected."

6. DEBUGGING MENTAL MODEL. Compare what React thinks against what Fabric holds, and bisect the path between them. The four questions to ask in order, every time: is the handler firing; is selectedObjects right; did the Fabric object actually change; was renderAll called.

7. HOW TO SAFELY ADD A NEW FEATURE. A concrete, ordered checklist derived from how existing features are built: decide whether it is a new property, a new object, or new behaviour; add the option constant or default to types.ts; add the method to buildEditor; declare it on the Editor interface (the compiler will now tell you what is missing); build the sidebar or control; register it in editor.tsx; add its tool name to the ActiveTool union and, if it needs a selection, to selectionDependTools; then verify with the two-element switch test. Explain WHY the interface should be edited early — it turns a feature into a compiler-guided task.

8. HOW TO SAFELY MODIFY AN EXISTING FEATURE. Find every reader and writer of the value first with Grep before changing anything; check whether a getter and a setter disagree about which property they touch; watch for || versus ?? when changing a control's range; re-run the two-element switch test; and confirm a render call still happens on every mutation path.

Close with three short lists:
- "The five files that matter most, in order" with one line each on why.
- "Ten sentences that mean you understand this codebase" — each a claim the reader should be able to make and defend.
- "The three traps this codebase will set for you" — the silent fallback, the dual state store, and the base-ui-is-not-Radix surprise.`,
  },
]

phase('Write')

const writePrompt = (s) => `You are writing ONE section of a large, multi-file developer-learning report about the Fabric.js + React + Next.js image editor at ${REPO}.

YOUR ASSIGNMENT
Section title: ${s.title}
Write it to EXACTLY this path: ${OUT}/${s.file}
Use the Write tool. Create the file. Do not write anywhere else.

Begin the file with:
# ${s.title}
> Part of the image-ai developer learning report. See 00-INDEX.md for the full contents.

WHAT THIS SECTION MUST COVER
${s.brief}

${TEMPLATE}

AUDIENCE AND TONE
The reader is a developer who built this project by following a tutorial and now wants to genuinely understand it well enough to debug and extend it alone. They have asked, explicitly, to be taught how to THINK about the code rather than to memorize it. So:
- Always answer WHY, not only WHAT. Why did the author write it this way? What would break otherwise? What was the alternative and what does this choice cost?
- Connect every file to the files around it. A claim with no connection is a fact; a claim with a connection is understanding.
- When you find something wrong or sloppy, say so directly and explain the consequence — but do not sneer. This is someone's learning project.
- Use complete sentences and real paragraphs. Code blocks for code. Tables only for genuinely tabular facts.
- Length is not a constraint; shallowness is a failure. Write as much as the material honestly requires.

BEFORE YOU WRITE
Read every file your section covers, in full, with the Read tool. Also read the files they import and the files that import them, so your "Used by" and "Dependencies" claims are true. Use Grep to prove every claim about who imports what.

${INVENTORY}

${s.extra ? s.extra() : ''}

Now read the code and write ${OUT}/${s.file}. When done, return a 3-4 sentence summary of what you wrote and any place where you were uncertain about the code.`

const verifyPrompt = (s) => `You are the FACT-CHECKER for one section of a technical report. Your job is to find and FIX every inaccuracy. Be ruthless and skeptical — assume the writer hallucinated something, because at this length they usually did.

The section file is: ${OUT}/${s.file}
It documents this project: ${REPO}

PROCEDURE
1. Read ${OUT}/${s.file} completely.
2. Extract every checkable factual claim: file paths, component names, function names, hook names, prop names, import statements, exported symbols, line numbers, quoted code, library API names, version numbers, and "X is imported by Y" / "X calls Y" relationships.
3. Verify EACH one against the real source with Read and Grep. Do not accept a claim because it sounds right.
4. FIX every error you find by editing ${OUT}/${s.file} in place with the Edit tool. Correct it; do not merely flag it.

HUNT SPECIFICALLY FOR
- Files, components, hooks, functions, props, or exports that DO NOT EXIST. This is the worst failure mode. Grep for every name mentioned.
- Code quoted inaccurately. This codebase is full of typos that MUST be preserved verbatim in quotes: "utilis.ts" (not utils), "use-canva-events.ts" (not canvas), "StrokeColorSiderbar" and "StrokeWidthSiderbar" (Siderbar, not Sidebar), "ToolSideBarClose", "strokeWIDTH" in the option constants, "rbga(" in utilis.ts, "tex-xs" in navbar.tsx, "border-Slate-800" in hint.tsx, "Fill_COl" and "Stroke_COl", "getActiveSTROKEWIDTH"/"getActiveSTROKECOLOR"/"getActiveFillCOLOR"/"getActiveSTROKEDashArray", "TrianGle_Options", "useAutoResizProps", "SidebaritemProps". If the report silently "corrects" one of these, that is an error — fix it back to the real spelling.
- Wrong line numbers. Spot-check every file:NN reference by reading that line.
- Claims about library APIs that are wrong for the installed versions: next 16.2.11, react 19.2.4, fabric 7.4.0. For fabric especially, check ${REPO}/node_modules/fabric/ type definitions rather than trusting memory of fabric v5. For Next, check ${REPO}/node_modules/next/dist/docs/.
- Claims that this project has features it does not have. There is NO database, NO API route, NO server action, NO middleware, NO auth wiring, NO tests, NO undo/redo, NO save, NO load, NO export, NO delete. @clerk/nextjs and drizzle-kit are installed but imported by zero files. If the section implies otherwise anywhere, fix it.
- Radix-vs-base-ui confusion. The UI primitives wrap @base-ui/react and use a \`render\` prop, NOT Radix and NOT \`asChild\`. Any mention of Radix or asChild as being in this codebase is an error.
- Generic tutorial filler that is not about THIS project. The user explicitly rejected generic content. If a passage would be equally true of any React app and uses no real code from this repo, either replace it with the real example from this codebase or cut it.
- Missing required headings. If the section documents individual files, each must carry the full heading set: Purpose, Used by, Dependencies, Exports, State, Functions, JSX/UI, Runtime flow, Important concepts, Possible bugs. Add any that were dropped, with real content.
- Confirmed facts presented without hedging where they are actually assumptions, and vice versa.
- Broken markdown: unclosed code fences, broken tables, malformed mermaid.

ALSO IMPROVE
If a passage is accurate but thin where the assignment demanded depth — especially the required line-by-line explanations — expand it yourself using the real code. The bar the user set: explaining \`const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)\` must cover const, the destructuring, the setter, useState's return, the generic, why null, and why THIS project needs it. "This creates state" is a failure.

HARD CONSTRAINT
You may edit ONLY ${OUT}/${s.file}. Do not touch any file under app/, features/, components/, hooks/, or lib/. Do not run builds or installs.

Return: the number of factual errors you found, a list of the fixes you applied (be specific — "changed X to Y"), any concerns you could not resolve, and your estimate of the section's word count.`

const results = await pipeline(
  SECTIONS,
  (s) => agent(writePrompt(s), { label: 'write:' + s.file, phase: 'Write' }),
  (written, s) => agent(verifyPrompt(s), { label: 'verify:' + s.file, phase: 'Verify', schema: VERIFY_SCHEMA })
)

const report = SECTIONS.map((s, i) => ({
  file: s.file,
  title: s.title,
  verify: results[i] || null,
}))

const totalErrors = report.reduce((n, r) => n + ((r.verify && r.verify.errorsFound) || 0), 0)
const failed = report.filter((r) => !r.verify).map((r) => r.file)
log('Sections complete. ' + totalErrors + ' factual errors caught and corrected across ' + SECTIONS.length + ' sections.' + (failed.length ? ' FAILED SECTIONS: ' + failed.join(', ') : ''))

return {
  outputDir: OUT,
  sections: report,
  totalFactualErrorsCorrected: totalErrors,
  failedSections: failed,
  confirmedBugCount: confirmedBugs.length,
  refutedBugCount: refutedBugs.length,
  confirmedBugs: confirmedBugs.map((b) => ({
    title: b.title,
    file: b.file,
    line: b.line,
    severity: b.severity,
    unanimous: b.unanimous,
    failureScenario: b.failureScenario,
  })),
  droppedLowSeverityFindings: Math.max(0, deduped.length - toVerify.length),
}
