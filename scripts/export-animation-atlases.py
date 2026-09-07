"""Extract original WebM alpha frames into browser-independent WebP atlases."""
from pathlib import Path
import math
import imageio_ffmpeg as ff
from PIL import Image

root = Path(__file__).resolve().parents[1]
out = root / 'assets/ip-atlases'
out.mkdir(exist_ok=True)
for name in ('normal-1', 'normal-2', 'good', 'excellent', 'miss', 'curtain'):
    reader = ff.read_frames(str(root / 'assets/ip-videos' / (name + '.webm')),
                            pix_fmt='rgba', bpp=4, input_params=['-c:v', 'libvpx-vp9'])
    meta = next(reader)
    frames = [Image.frombytes('RGBA', meta['size'], raw).resize((320, 320), Image.Resampling.LANCZOS)
              for raw in reader]
    atlas = Image.new('RGBA', (320 * 8, 320 * math.ceil(len(frames) / 8)))
    for i, frame in enumerate(frames):
        atlas.paste(frame, ((i % 8) * 320, (i // 8) * 320))
    atlas.save(out / (name + '.webp'), quality=88, method=6, exact=True)
    print(name, len(frames), 'frames', meta['fps'], 'fps')
