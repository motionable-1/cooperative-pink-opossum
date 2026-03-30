import { AbsoluteFill, Sequence } from "remotion";
import { GettingTrafficScene } from "./scenes/GettingTrafficScene";
import { IsHaardScene } from "./scenes/IsHaardScene";
import { InsanelyHardScene } from "./scenes/InsanelyHardScene";
import { PurpleMorphTransition } from "./scenes/PurpleMorphTransition";
import { WhatIfScene } from "./scenes/WhatIfScene";
import { SpotScene } from "./scenes/SpotScene";
import { ExactlyWhatScene } from "./scenes/ExactlyWhatScene";
import { AreSearchingScene } from "./scenes/AreSearchingScene";
import { SearchBarScene } from "./scenes/SearchBarScene";
import { ExclamationScene } from "./scenes/ExclamationScene";
import { MeetScene } from "./scenes/MeetScene";
import { MeetWhiteScene } from "./scenes/MeetWhiteScene";
import { NeonPillScene } from "./scenes/NeonPillScene";
import { OutrankScene } from "./scenes/OutrankScene";
import { ScaleYourScene } from "./scenes/ScaleYourScene";

/*
 * Full animation sequence:
 *
 * Scene 1  (ref 001-034): "Getting traffic" - black bg, purple graph line
 * Scene 2  (ref 035-050): "IS HAAARD!" - black bg, bouncy text
 * Scene 3  (ref 051-072): "INSANELY HARD." - white bg → perspective zoom
 * Scene 4  (ref 073-093): Purple morph (square → fills frame + "What if you could" appears)
 * Scene 5  (ref 094-105): "What if you could" hold
 * Scene 6  (ref 106-136): "spot" - white text on black with purple arrows
 * Scene 7  (ref 137-169): "exactly what your customers" - word-by-word on purple gradient
 * Scene 8  (ref 170-175): "are searching for," - centered on purple gradient
 * Scene 9  (ref 176-211): Search bar typing + zoom (white bg)
 * Scene 10 (ref 212-213): Transition to black
 * Scene 11 (ref 214-225): Purple "!" rotating on black
 * Scene 12 (ref 226-234): "meet!" bouncy purple text on black
 * Scene 13 (ref 235-240): "Meet !" white centered text on black
 * Scene 14 (ref 241-249): Neon pill outline drawing on black
 * Scene 15 (ref 250-279): "OUTRANK" in neon pill with rotating glow
 * Scene 16 (ref 280-282): Neon pill fading (text gone, outline fades)
 * Scene 17 (ref 283+):   "Scale your" on purple gradient with sparkles
 */

// Timing: each ref frame ≈ 1.5 output frames at 30fps
const SCENE_1_DURATION = 51;   // "Getting traffic" + graph
const SCENE_2_DURATION = 24;   // "IS HAAARD!"
const SCENE_3_DURATION = 39;   // "INSANELY HARD." perspective zoom (+ breathing room)
const SCENE_4_DURATION = 32;   // Purple morph + "What if you could" overlap
const SCENE_5_DURATION = 18;   // "What if you could" hold
const SCENE_6_DURATION = 47;   // "spot" with arrows
const SCENE_7_DURATION = 50;   // "exactly what your customers"
const SCENE_8_DURATION = 13;   // "are searching for,"
const SCENE_9_DURATION = 54;   // Search bar typing + zoom
const SCENE_10_DURATION = 3;   // Transition to black
const SCENE_11_DURATION = 18;  // Purple "!" rotating
const SCENE_12_DURATION = 14;  // "meet!" bouncy purple
const SCENE_13_DURATION = 9;   // "Meet !" white
const SCENE_14_DURATION = 14;  // Neon pill drawing
const SCENE_15_DURATION = 45;  // "OUTRANK" in neon pill
const SCENE_16_DURATION = 5;   // Neon pill fade
const SCENE_17_DURATION = 30;  // "Scale your" on purple gradient + buffer

const SCENE_2_START = SCENE_1_DURATION;
const SCENE_3_START = SCENE_2_START + SCENE_2_DURATION;
const SCENE_4_START = SCENE_3_START + SCENE_3_DURATION;
const SCENE_5_START = SCENE_4_START + SCENE_4_DURATION;
const SCENE_6_START = SCENE_5_START + SCENE_5_DURATION;
const SCENE_7_START = SCENE_6_START + SCENE_6_DURATION;
const SCENE_8_START = SCENE_7_START + SCENE_7_DURATION;
const SCENE_9_START = SCENE_8_START + SCENE_8_DURATION;
const SCENE_10_START = SCENE_9_START + SCENE_9_DURATION;
const SCENE_11_START = SCENE_10_START + SCENE_10_DURATION;
const SCENE_12_START = SCENE_11_START + SCENE_11_DURATION;
const SCENE_13_START = SCENE_12_START + SCENE_12_DURATION;
const SCENE_14_START = SCENE_13_START + SCENE_13_DURATION;
const SCENE_15_START = SCENE_14_START + SCENE_14_DURATION;
const SCENE_16_START = SCENE_15_START + SCENE_15_DURATION;
const SCENE_17_START = SCENE_16_START + SCENE_16_DURATION;

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Scene 1: Getting Traffic */}
      <Sequence from={0} durationInFrames={SCENE_1_DURATION}>
        <GettingTrafficScene />
      </Sequence>

      {/* Scene 2: IS HAAARD! */}
      <Sequence from={SCENE_2_START} durationInFrames={SCENE_2_DURATION}>
        <IsHaardScene />
      </Sequence>

      {/* Scene 3: INSANELY HARD. with extreme perspective zoom */}
      <Sequence from={SCENE_3_START} durationInFrames={SCENE_3_DURATION}>
        <InsanelyHardScene />
      </Sequence>

      {/* Scene 4: Purple morph transition */}
      <Sequence from={SCENE_4_START} durationInFrames={SCENE_4_DURATION}>
        <PurpleMorphTransition />
      </Sequence>

      {/* Scene 5: "What if you could" hold */}
      <Sequence from={SCENE_5_START} durationInFrames={SCENE_5_DURATION}>
        <WhatIfScene />
      </Sequence>

      {/* Scene 6: "spot" with arrows */}
      <Sequence from={SCENE_6_START} durationInFrames={SCENE_6_DURATION}>
        <SpotScene />
      </Sequence>

      {/* Scene 7: "exactly what your customers" word-by-word */}
      <Sequence from={SCENE_7_START} durationInFrames={SCENE_7_DURATION}>
        <ExactlyWhatScene />
      </Sequence>

      {/* Scene 8: "are searching for," */}
      <Sequence from={SCENE_8_START} durationInFrames={SCENE_8_DURATION}>
        <AreSearchingScene />
      </Sequence>

      {/* Scene 9: Search bar typing */}
      <Sequence from={SCENE_9_START} durationInFrames={SCENE_9_DURATION}>
        <SearchBarScene />
      </Sequence>

      {/* Scene 10: Transition to black */}
      <Sequence from={SCENE_10_START} durationInFrames={SCENE_10_DURATION}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "#000000" }} />
      </Sequence>

      {/* Scene 11: Purple "!" rotating */}
      <Sequence from={SCENE_11_START} durationInFrames={SCENE_11_DURATION}>
        <ExclamationScene />
      </Sequence>

      {/* Scene 12: "meet!" bouncy purple */}
      <Sequence from={SCENE_12_START} durationInFrames={SCENE_12_DURATION}>
        <MeetScene />
      </Sequence>

      {/* Scene 13: "Meet !" white centered */}
      <Sequence from={SCENE_13_START} durationInFrames={SCENE_13_DURATION}>
        <MeetWhiteScene />
      </Sequence>

      {/* Scene 14: Neon pill outline drawing */}
      <Sequence from={SCENE_14_START} durationInFrames={SCENE_14_DURATION}>
        <NeonPillScene />
      </Sequence>

      {/* Scene 15: "OUTRANK" in neon pill */}
      <Sequence from={SCENE_15_START} durationInFrames={SCENE_15_DURATION}>
        <OutrankScene />
      </Sequence>

      {/* Scene 16: Neon pill fade (reuse OutrankScene — text fades at end) */}
      <Sequence from={SCENE_16_START} durationInFrames={SCENE_16_DURATION}>
        <NeonPillScene />
      </Sequence>

      {/* Scene 17: "Scale your" on purple gradient */}
      <Sequence from={SCENE_17_START} durationInFrames={SCENE_17_DURATION}>
        <ScaleYourScene />
      </Sequence>
    </AbsoluteFill>
  );
};
