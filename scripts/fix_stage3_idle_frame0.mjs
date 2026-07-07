// One-off repair: stage3_idle.png shipped with an empty frame 0, which made
// the stage-3 avatar vanish for one frame per idle loop (and entirely while
// sleeping, which freezes on frame 0). Copies frame 1 into the frame 0 slot.
import { Jimp } from 'jimp';

const FRAME = 256;
const path = new URL('../public/fighters/stage3_idle.png', import.meta.url).pathname;

const sheet = await Jimp.read(path);
const frame1 = sheet.clone().crop({ x: FRAME, y: 0, w: FRAME, h: FRAME });

// Sanity-check the target really is empty before overwriting anything.
let opaque = 0;
sheet.scan(0, 0, FRAME, FRAME, (x, y, idx) => {
  if (sheet.bitmap.data[idx + 3] > 0) opaque++;
});
if (opaque > 100) {
  console.error(`Frame 0 has ${opaque} opaque pixels — not empty, aborting.`);
  process.exit(1);
}

sheet.composite(frame1, 0, 0);
await sheet.write(path);
console.log('Copied frame 1 into empty frame 0 of stage3_idle.png');
