/* Original transparent frames, rendered without browser-specific video codecs. */
function createAlphaPlayer(canvas, initialSource) {
  const counts = { 'normal-1': 32, 'normal-2': 32, good: 40, excellent: 35, miss: 22, curtain: 106 };
  const cache = createAlphaPlayer.cache || (createAlphaPlayer.cache = new Map());
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 320;
  let source = initialSource, atlas, count = 1, time = 0, running = false;
  let frame = 0, started = 0, revision = 0, ready = 0;
  canvas.loop = false;
  function draw() {
    if (!atlas) return;
    const i = Math.min(count - 1, Math.floor(time * 15));
    ctx.clearRect(0, 0, 320, 320);
    ctx.drawImage(atlas, (i % 8) * 320, Math.floor(i / 8) * 320, 320, 320, 0, 0, 320, 320);
  }
  function tick(now) {
    if (!running || !ready) return;
    time = Math.max(0, (now - started) / 1000);
    if (time >= count / 15) {
      if (canvas.loop) { time %= count / 15; started = now - time * 1000; }
      else { time = (count - 1) / 15; running = false; draw(); canvas.dispatchEvent(new Event('ended')); return; }
    }
    draw();
    frame = requestAnimationFrame(tick);
  }
  Object.defineProperties(canvas, {
    src: { get: () => new URL(source, location.href).href, set: value => { source = value; } },
    currentSrc: { get: () => new URL(source, location.href).href },
    readyState: { get: () => ready },
    currentTime: { get: () => time, set: value => { time = Math.max(0, Number(value) || 0); started = performance.now() - time * 1000; draw(); } },
  });
  canvas.pause = () => { running = false; cancelAnimationFrame(frame); };
  canvas.play = async () => {
    running = true;
    started = performance.now() - time * 1000;
    cancelAnimationFrame(frame);
    if (ready) frame = requestAnimationFrame(tick);
  };
  canvas.load = () => {
    canvas.pause(); ready = 0; time = 0;
    const ticket = ++revision;
    const name = source.split('/').pop().replace('.webm', '');
    count = counts[name];
    if (!cache.has(name)) {
      cache.set(name, new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = new URL(`./assets/ip-atlases/${name}.webp`, location.href).href;
      }));
    }
    cache.get(name).then(image => {
      if (revision !== ticket) return;
      atlas = image; ready = 4; draw();
      canvas.dispatchEvent(new Event('loadedmetadata'));
      if (running) { started = performance.now() - time * 1000; frame = requestAnimationFrame(tick); }
    }).catch(() => { cache.delete(name); });
  };
  canvas.load();
  return canvas;
}
