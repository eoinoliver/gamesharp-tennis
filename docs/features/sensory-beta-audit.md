# Sensory and beta continuation audit — 26 October 2026

Scope: the shared player used by all 38 catalogue lessons, Home and welcome,
Explore, Sharpen (including its athlete), saved cues, completion, replay and
contact inspection. Source baseline: main af4658d. No tennis content, catalogue
membership, answer ordering or progress storage format changes.

## Findings and decisions

| Surface / boundary | Evidence in previous implementation | Change |
| --- | --- | --- |
| Daily completion | No next lesson link in wrap-up; Home already offered the first unplayed daily | Add named next challenge at completion, available immediately in beta; preserve Home and replay; Explore fallback when all dailies are completed |
| Home countdown | “Next in” and “Tomorrow” sat alongside an immediately playable next lesson | Say “New day in” and “Next”; no suggestion of a time lock |
| First mobile interaction | Unlock on pointerdown/touchstart/keydown only; sound button said on before any running context; first sound tap could turn it off | Include end-of-touch/click activation; button reflects actual availability and first enables sound, with a brief contact confirmation |
| Browser interruptions | Resumed suspended context only; no interruption or page lifecycle handling | Resume non-running contexts, recreate closed contexts on interaction, handle rejected resume without blocking play; stop all voices on page hiding |
| Mute | Preference blocked new calls but did not silence scheduled audio or looping crowd | Zero master and stop/disconnect all voices, including scheduled claps; in-memory preference still works if storage is denied |
| Lesson audio | Every contact/bounce; premium crowd continuously running; up to 230 claps over three seconds | One shared restrained mix: decision contact, final player contact, incoming opponent contact, at most one lead-in bounce and authored net outcomes; 36 quiet claps over less than one second |
| Praise | Premium-only; no explicit deduplication | Short accent on a correct committed decision, once per step per page; no negative buzzer, no praise on better-option demos or replay |
| Predict | Separate answer-first, reveal-later flow | No audio hint while choosing; one accent for three correct reads after the whole point; replay cannot repeat it |
| Pause / inspection / navigation | Active voices and crowd could outlive the moment | Stop existing audio on manual pause, scene change and contact inspection; no catch-up bursts after tab hiding; held frames stay silent |
| Wrap-up / saved cue | Automatic finale replay could keep producing sound while reading | Automatic wrap-up animation is silent; deliberate replay retains contact cues; cue save retains clear visual confirmation |
| Home / welcome | Automatic cinematic shot/bounce effects | Silent presentation; Home retains an explicit sound control and its brief enable confirmation |
| Explore / Sharpen / My Game | No audio producers in these reading/reference surfaces | Keep silent; no extra click sounds or celebrations |
| Touch control | 34px lesson sound target | 44px target with truthful accessible action label |

The original mobile report has no device/version trace. These are confirmed
code defects and plausible contributors, not proof of the exact cause on Eoin's
phone. In particular, a running AudioContext does not prove a phone's speaker,
volume, output route or silent-switch behaviour.

Safari's interruption state is documented in
[MDN BaseAudioContext.state](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state).
There are also [WebKit interruption reports](https://bugs.webkit.org/show_bug.cgi?id=273511)
where resume itself is insufficient. We do not override the phone's silent
setting or claim that browser emulation establishes hardware compatibility.

## Product judgement

The primary payoff should be the user's successful read and useful takeaway.
Sound punctuates that moment; it must not compete with the explanation. The
sound density and short applause are a conservative beta judgement, not a
measured retention improvement. Every task remains usable muted.

Two remaining outcome-changing checks:

1. Listen on physical iPhone Safari and Android Chrome, both speaker and
   headphones: first visit, sound enable, device silent/volume controls, app
   switching/screen lock, return, pause and mute during applause. Check contact
   synchronisation and comfort at ordinary volume. This requires actual ears
   and devices; synthesized waveforms and browser tests cannot certify it.
2. In a small beta, inspect existing `asked_more`, `lesson_complete`, `cue_save`
   and next-day `app_open` signals together with user feedback. More challenges
   played is not itself evidence of learning. Ask whether the cue is remembered
   and useful tomorrow, and whether anyone immediately wants sound off. Avoid
   adding more sound until those observations justify it.

No notification schedule or autonomous monitoring was created.

## Verification evidence

- Build parity: 97 exact release files / 96 public files; both historical
  migration and contact-focus fingerprints retained as frozen baselines.
- Unit tests: 18 passing (10 analytics boundaries, 8 sound lifecycle cases).
- Chromium: 64 sensory/navigation assertions, including a real-time contact,
  mobile taps, three correct answers, replay, cue save, next navigation,
  catalogue exhaustion, four quiet shell/welcome surfaces and all 433 scenes.
- Offline rendering of the actual synth: all four effects produce nonzero
  unclipped signal and are silent after one second. This verifies generated
  samples, not perceived quality or hardware output.
- Final Chromium and WebKit passes each covered 76 assertions, including both
  Predict journeys and automatic finale versus deliberate replay. The complete
  regression suite and Preview, staged Production and live checks passed. See
  [the release record](sensory-beta-release-2026-10-26.md). Physical iPhone/Android
  listening is explicitly unverified.
