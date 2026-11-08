#!/usr/bin/env python3
"""关键帧颜色检查：看一组关键帧的颜色是否和《Slow Shutter》实测的港风夜色一致、彼此一致。

用法：python3 color-check.py 关键帧1.png 关键帧2.jpg ...
只用 Python 标准库，图片用 ffmpeg 解码（PATH 里的，或环境变量 FFMPEG）。

每张图打印：平均亮度、近黑占比、最亮 5% 的亮度、平均饱和度、青绿 / 暖色（琥珀加红）/ 蓝的占比。
超出参照范围的项后面标 ✗；和这一组中位数差太多的也标出来（这张会和别的镜头接不上）。
参照范围来自 9 张实测关键帧（references/look.md），两边各放宽了一点。
"""
import colorsys
import os
import statistics
import subprocess
import sys

FF = os.environ.get("FFMPEG", "ffmpeg")
W = 320

# 指标: (下限, 上限, 中文名)
REF = {
    "lum": (0.17, 0.38, "平均亮度"),
    "dark": (0.06, 0.26, "近黑占比"),
    "p95": (0.50, 0.88, "最亮5%"),
    "sat": (0.38, 0.62, "饱和度"),
    "teal": (0.10, 1.00, "青绿"),
    "warm": (0.02, 0.30, "暖色"),
    "blue": (0.00, 0.12, "蓝"),
}
GROUP_TOL = {"lum": 0.10, "teal": 0.10, "warm": 0.15}  # 和整组中位数差这么多就提示


def pixels(path):
    probe = subprocess.run([FF, "-hide_banner", "-i", path], capture_output=True, text=True).stderr
    import re
    m = re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", probe)
    if not m:
        sys.exit(f"读不了这张图：{path}")
    w, h = int(m.group(1)), int(m.group(2))
    hh = max(2, round(h * W / w / 2) * 2)
    raw = subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-i", path, "-vf", f"scale={W}:{hh}",
                          "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return [(raw[i] / 255, raw[i + 1] / 255, raw[i + 2] / 255) for i in range(0, len(raw) - 2, 3)]


def measure(path):
    px = pixels(path)
    lum = sorted(0.2126 * r + 0.7152 * g + 0.0722 * b for r, g, b in px)
    n = len(px)
    hsv = [colorsys.rgb_to_hsv(*p) for p in px]
    colored = [(h * 360) for h, s, v in hsv if s > 0.25 and v > 0.2]

    def share(lo, hi):
        if lo < hi:
            return sum(1 for h in colored if lo <= h < hi) / n
        return sum(1 for h in colored if h >= lo or h < hi) / n

    return {
        "lum": sum(lum) / n,
        "dark": sum(1 for x in lum if x < 0.06) / n,
        "p95": lum[int(n * 0.95)],
        "sat": sum(s for _, s, _ in hsv) / n,
        "teal": share(140, 200),
        "warm": share(340, 20) + share(20, 55),
        "blue": share(200, 250),
    }


def main(paths):
    if not paths:
        sys.exit(__doc__)
    rows = [(p, measure(p)) for p in paths]
    med = {k: statistics.median(m[k] for _, m in rows) for k in REF}
    bad = 0
    print("  ".join(f"{REF[k][2]}" for k in REF), " 文件")
    for p, m in rows:
        cells, notes = [], []
        for k, (lo, hi, name) in REF.items():
            ok = lo <= m[k] <= hi
            cells.append(f"{m[k]:.2f}{'' if ok else '✗'}")
            if not ok:
                notes.append(f"{name} {m[k]:.2f} 不在 {lo:.2f}–{hi:.2f}")
        for k, tol in GROUP_TOL.items():
            if len(rows) > 2 and abs(m[k] - med[k]) > tol:
                notes.append(f"{REF[k][2]}和这一组差得多（{m[k]:.2f}，中位数 {med[k]:.2f}）")
        bad += bool(notes)
        print("  ".join(cells), " ", os.path.basename(p))
        for t in notes:
            print("     ↳", t)
    print(f"\n{len(rows)} 张，{bad} 张要看一下" if bad else f"\n{len(rows)} 张都在范围内")


if __name__ == "__main__":
    main(sys.argv[1:])
