import { AbsoluteFill, Sequence } from "remotion";
import { GettingTrafficScene } from "./scenes/GettingTrafficScene";
import { IsHaardScene } from "./scenes/IsHaardScene";
import { InsanelyHardScene } from "./scenes/InsanelyHardScene";
import { PurpleEndScene } from "./scenes/PurpleEndScene";
import { PurpleMorphScene } from "./scenes/PurpleMorphScene";
import { WhatIfScene } from "./scenes/WhatIfScene";
import { SpotScene } from "./scenes/SpotScene";

/*
 * Full animation sequence:
 *
 * Scene 1: "Getting traffic" - black bg, purple gradient top, animated line graph
 * Scene 2: "IS HAAARD!" - black bg, white bold bouncy text
 * Scene 3: "INSANELY HARD." - white bg → extreme perspective zoom
 * Scene 4: Purple square on lavender gradient with dots (brief hold)
 * Scene 5: Purple morph - square rotates → diamond → abstract wing expansion
 * Scene 6: "What if you could" - white text on deep purple with wing shapes
 * Scene 7: "spot" - white lowercase on black with 4 purple hand-drawn arrows
 */

const SCENE_1_DURATION = 85;
const SCENE_2_DURATION = 45;
const SCENE_3_DURATION = 65;
const SCENE_4_DURATION = 12; // Brief hold before morph begins
const SCENE_5_DURATION = 35; // Purple square morph → wings (faster transition)
const SCENE_6_DURATION = 65; // "What if you could"
const SCENE_7_DURATION = 65; // "spot" with arrows + buffer at end

const SCENE_2_START = SCENE_1_DURATION;
const SCENE_3_START = SCENE_2_START + SCENE_2_DURATION;
const SCENE_4_START = SCENE_3_START + SCENE_3_DURATION;
const SCENE_5_START = SCENE_4_START + SCENE_4_DURATION;
const SCENE_6_START = SCENE_5_START + SCENE_5_DURATION;
const SCENE_7_START = SCENE_6_START + SCENE_6_DURATION;

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

      {/* Scene 4: Purple square hold */}
      <Sequence from={SCENE_4_START} durationInFrames={SCENE_4_DURATION}>
        <PurpleEndScene />
      </Sequence>

      {/* Scene 5: Purple morph transition */}
      <Sequence from={SCENE_5_START} durationInFrames={SCENE_5_DURATION}>
        <PurpleMorphScene />
      </Sequence>

      {/* Scene 6: "What if you could" */}
      <Sequence from={SCENE_6_START} durationInFrames={SCENE_6_DURATION}>
        <WhatIfScene />
      </Sequence>

      {/* Scene 7: "spot" with arrows */}
      <Sequence from={SCENE_7_START} durationInFrames={SCENE_7_DURATION}>
        <SpotScene />
      </Sequence>
    </AbsoluteFill>
  );
};
