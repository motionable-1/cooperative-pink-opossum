import { AbsoluteFill, Sequence } from "remotion";
import { GettingTrafficScene } from "./scenes/GettingTrafficScene";
import { IsHaardScene } from "./scenes/IsHaardScene";
import { InsanelyHardScene } from "./scenes/InsanelyHardScene";
import { PurpleEndScene } from "./scenes/PurpleEndScene";

/*
 * Animation sequence breakdown (from reference frames):
 * 
 * Scene 1: "Getting traffic" - black bg, purple gradient top, animated line graph
 *          Graph draws from bottom-left upward with 2 glowing white nodes
 * Scene 2: "IS HAAARD!" - black bg, white bold text, slight bounce/hand-lettered feel
 * Scene 3: "INSANELY HARD." - white bg, black text, then perspective zoom distortion
 * Scene 4: Purple square + dots on soft lavender gradient - ending logo mark
 */

// Scene durations (in frames at 30fps)
const SCENE_1_DURATION = 100; // ~3.3s - Getting traffic with graph animation
const SCENE_2_DURATION = 50;  // ~1.7s - IS HAAARD!
const SCENE_3_DURATION = 70;  // ~2.3s - INSANELY HARD. with perspective
const SCENE_4_DURATION = 60;  // ~2.0s - Purple ending

const SCENE_2_START = SCENE_1_DURATION;
const SCENE_3_START = SCENE_2_START + SCENE_2_DURATION;
const SCENE_4_START = SCENE_3_START + SCENE_3_DURATION;

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

      {/* Scene 3: INSANELY HARD. */}
      <Sequence from={SCENE_3_START} durationInFrames={SCENE_3_DURATION}>
        <InsanelyHardScene />
      </Sequence>

      {/* Scene 4: Purple Logo Ending */}
      <Sequence from={SCENE_4_START} durationInFrames={SCENE_4_DURATION}>
        <PurpleEndScene />
      </Sequence>
    </AbsoluteFill>
  );
};
