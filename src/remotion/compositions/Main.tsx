import { AbsoluteFill, Sequence } from "remotion";
import { GettingTrafficScene } from "./scenes/GettingTrafficScene";
import { IsHaardScene } from "./scenes/IsHaardScene";
import { InsanelyHardScene } from "./scenes/InsanelyHardScene";
import { PurpleMorphTransition } from "./scenes/PurpleMorphTransition";
import { WhatIfScene } from "./scenes/WhatIfScene";
import { SpotScene } from "./scenes/SpotScene";
import { ExactlyWhatScene } from "./scenes/ExactlyWhatScene";
import { AreSearchingScene } from "./scenes/AreSearchingScene";

/*
 * Full animation sequence (170 ref frames × 50ms = 8.5s at 30fps = 255 frames):
 *
 * Scene 1 (ref 001-034): "Getting traffic" - black bg, purple graph line
 * Scene 2 (ref 035-050): "IS HAAARD!" - black bg, bouncy text
 * Scene 3 (ref 051-072): "INSANELY HARD." - white bg → perspective zoom
 * Scene 4 (ref 073-093): Purple morph (square → star → fills frame + "What if you could" appears)
 * Scene 5 (ref 094-105): "What if you could" hold (fully settled, wing shapes)
 * Scene 6 (ref 106-136): "spot" - white text on black with purple arrows
 * Scene 7 (ref 137-169): "exactly what your customers" - word-by-word on purple gradient
 * Scene 8 (ref 170+):    "are searching for," - centered on purple gradient
 */

// Timing: each ref frame ≈ 1.5 output frames at 30fps
const SCENE_1_DURATION = 51;  // Ref 001-034: "Getting traffic" + graph
const SCENE_2_DURATION = 24;  // Ref 035-050: "IS HAAARD!"
const SCENE_3_DURATION = 33;  // Ref 051-072: "INSANELY HARD." perspective zoom
const SCENE_4_DURATION = 32;  // Ref 073-093: Purple morph + "What if you could" overlap
const SCENE_5_DURATION = 18;  // Ref 094-105: "What if you could" hold
const SCENE_6_DURATION = 47;  // Ref 106-136: "spot" with arrows
const SCENE_7_DURATION = 50;  // Ref 137-169: "exactly what your customers"
const SCENE_8_DURATION = 10;  // Ref 170+:    "are searching for," + buffer

const SCENE_2_START = SCENE_1_DURATION;
const SCENE_3_START = SCENE_2_START + SCENE_2_DURATION;
const SCENE_4_START = SCENE_3_START + SCENE_3_DURATION;
const SCENE_5_START = SCENE_4_START + SCENE_4_DURATION;
const SCENE_6_START = SCENE_5_START + SCENE_5_DURATION;
const SCENE_7_START = SCENE_6_START + SCENE_6_DURATION;
const SCENE_8_START = SCENE_7_START + SCENE_7_DURATION;

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

      {/* Scene 4: Purple morph transition (square → fills frame + text appears) */}
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
    </AbsoluteFill>
  );
};
