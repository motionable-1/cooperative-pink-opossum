import { AbsoluteFill, Sequence } from "remotion";
import { GettingTrafficScene } from "./scenes/GettingTrafficScene";
import { IsHaardScene } from "./scenes/IsHaardScene";
import { InsanelyHardScene } from "./scenes/InsanelyHardScene";
import { PurpleEndScene } from "./scenes/PurpleEndScene";

/*
 * Animation sequence (from 70 reference frames at 50ms each):
 *
 * Scene 1 (ref 1-34): "Getting traffic" - black bg, purple gradient top,
 *          animated purple line graph drawing from left to right with glowing nodes
 * Scene 2 (ref 35-48): "IS HAAARD!" - black bg, white bold text, bouncy uneven letters
 * Scene 3 (ref 49-71): "INSANELY HARD." - white bg, black text starts centered,
 *          then extreme perspective rotation (right side zooms toward viewer,
 *          left recedes) until "D." fills the frame
 * Scene 4 (ref 72-75): Purple square centered on soft lavender gradient, scattered dots
 */

const SCENE_1_DURATION = 85;
const SCENE_2_DURATION = 45;
const SCENE_3_DURATION = 65;
const SCENE_4_DURATION = 55;

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

      {/* Scene 3: INSANELY HARD. with extreme perspective zoom */}
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
