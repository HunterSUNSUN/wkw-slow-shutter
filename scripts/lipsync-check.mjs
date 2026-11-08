// Does a singing clip's mouth line up with the song? H3 lock_source returns the driving
// audio inside the clip, so compare the clip's own sound with the song at the same moment.
// usage: node lipsync-check.mjs <clip.mp4> <song.mp3> <songStartSec> [seconds=6]
// prints the match (1.00 = same sound) and the offset; |offset| under 40 ms is under a frame.
import { execFileSync } from 'node:child_process'
const FF = process.env.FFMPEG || 'ffmpeg'  // PATH 里的 ffmpeg，或用环境变量 FFMPEG 指定
const [clip, song, start, secs = '6'] = process.argv.slice(2)
const pcm = (file, ss) => {
  const b = execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-ss', String(ss), '-t', secs, '-i', file, '-vn', '-ac', '1', '-ar', '8000', '-f', 's16le', '-'], { maxBuffer: 1 << 26 })
  return new Int16Array(b.buffer, b.byteOffset, b.length / 2)
}
const env = (x) => { const n = Math.floor(x.length / 40), o = new Float64Array(n); for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < 40; j++) s += Math.abs(x[i * 40 + j]); o[i] = s / 40 } const m = o.reduce((a, b) => a + b) / n; return o.map((v) => v - m) }
const a = env(pcm(clip, 0)), b = env(pcm(song, start)), n = Math.min(a.length, b.length)
const norm = (v) => Math.sqrt(v.slice(0, n).reduce((s, x) => s + x * x, 0))
let best = [-2, 0]
for (let l = -100; l <= 100; l++) { let s = 0; for (let i = 0; i < n; i++) { const j = i + l; if (j >= 0 && j < n) s += a[j] * b[i] } const c = s / (norm(a) * norm(b)); if (c > best[0]) best = [c, l] }
console.log(`match ${best[0].toFixed(2)}  offset ${best[1] * 5} ms (positive: the clip's sound comes later than the song)`)
