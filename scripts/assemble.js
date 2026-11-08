// Join treated shots on exact frames and lay the song under them.
// usage: node assemble.js <cut.json> <out.mp4>
// cut.json: { "song": "...mp3", "fps": 24, "end": 146.2, "fadeIn": 0.6, "fadeOut": 1.2,
//             "shots": [ { "file": "fx-s1.mp4", "at": 85 }, { "file": "h3-s2.mp4", "at": 93 }, ... ] }
// "at" = where the shot starts in the SONG; each shot runs until the next one's "at" (the last until "end").
// Cutting by frame count, not by seconds: rounding each clip to whole frames separately adds up, and by the
// ninth shot the picture was ~0.1 s late — enough to put a singing mouth out of sync.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
const FF = process.env.FFMPEG || 'ffmpeg'  // PATH 里的 ffmpeg，或用环境变量 FFMPEG 指定
const [cutFile, out] = process.argv.slice(2)
const cut = JSON.parse(readFileSync(cutFile, 'utf8'))
const dir = path.dirname(path.resolve(cutFile))
const fps = cut.fps ?? 24
const t0 = cut.shots[0].at
const marks = [...cut.shots.map((s) => s.at), cut.end].map((t) => Math.round((t - t0) * fps))
const frames = cut.shots.map((_, i) => marks[i + 1] - marks[i])
const total = marks.at(-1) / fps
const chains = cut.shots.map((_, i) => `[${i}:v]fps=${fps},trim=end_frame=${frames[i]},setpts=PTS-STARTPTS,setsar=1[v${i}]`)
const fadeOut = cut.fadeOut ?? 1.2
const fadeIn = cut.fadeIn ?? 0
const vfx = [fadeIn ? `fade=t=in:st=0:d=${fadeIn}` : '', `fade=t=out:st=${(total - fadeOut).toFixed(3)}:d=${fadeOut}`].filter(Boolean).join(',')
const afx = [fadeIn ? `afade=t=in:st=0:d=${Math.min(0.4, fadeIn)}` : '', `afade=t=out:st=${(total - fadeOut).toFixed(3)}:d=${fadeOut}`].filter(Boolean).join(',')
const n = cut.shots.length
const graph = [...chains, `${cut.shots.map((_, i) => `[v${i}]`).join('')}concat=n=${n}:v=1:a=0,${vfx},format=yuv420p[v]`,
  `[${n}:a]atrim=${t0}:${(t0 + total).toFixed(3)},asetpts=PTS-STARTPTS,${afx}[a]`].join(';')
const abs = (f) => (path.isAbsolute(f) ? f : path.join(dir, f))
execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...cut.shots.flatMap((s) => ['-i', abs(s.file)]), '-i', abs(cut.song),
  '-filter_complex', graph, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '12',
  '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', out], { stdio: 'inherit' })
console.log(`${n} shots, ${marks.at(-1)} frames (${total.toFixed(3)} s); cuts at ${marks.slice(1, -1).map((f) => (f / fps).toFixed(3)).join(' ')}`)
