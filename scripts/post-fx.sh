#!/usr/bin/env bash
# 慢门后期（本机 ffmpeg，不花钱）
#   post-fx.sh step-smear   <in.mp4> <out.mp4>                      空镜、剧情镜头：叠 10 帧（约 0.4 秒拖影），再抽成每秒 8 帧
#   post-fx.sh sing-smear   <in.mp4> <out.mp4> <cx> <cy> <rx> <ry>  演唱镜头：椭圆（中心 cx,cy，半径 rx,ry，像素）里用原片，
#                                                                   外面拖影；不抽帧，嘴才对得上
#   post-fx.sh mask-preview <in.mp4> <out.png> <cx> <cy> <rx> <ry> [秒]  看椭圆罩在哪：没蒙红的是原片，蒙红的会拖影
# ffmpeg 用 PATH 里的，或环境变量 FFMPEG 指定。
set -euo pipefail
FF="${FFMPEG:-ffmpeg}"
ENC=(-an -c:v libx264 -preset slow -crf 12 -pix_fmt yuv420p)

size() { "$FF" -hide_banner -i "$1" 2>&1 | grep -o 'Video:.*' | grep -oE '[0-9]{3,4}x[0-9]{3,4}' | head -1 | tr x ' '; }

# 椭圆遮罩：半径 0.7 倍以内全白，到 1.0 倍渐变到黑
make_mask() { # <in> <mask.png> cx cy rx ry
  local W H; read -r W H <<< "$(size "$1")"
  "$FF" -hide_banner -loglevel error -y -f lavfi -i "color=c=black:s=${W}x${H},format=gray" \
    -vf "geq=lum='255*clip((1.0-hypot((X-$3)/$5\,(Y-$4)/$6))/0.3\,0\,1)'" -frames:v 1 "$2"
}

case "${1:-}" in
  step-smear)
    "$FF" -hide_banner -loglevel error -y -i "$2" -vf "tmix=frames=10,fps=8,fps=24" "${ENC[@]}" "$3" ;;
  sing-smear)
    MASK="${3%.mp4}-mask.png"
    make_mask "$2" "$MASK" "$4" "$5" "$6" "$7"
    "$FF" -hide_banner -loglevel error -y -i "$2" -loop 1 -i "$MASK" -filter_complex \
      "[0:v]split[r1][r2];[r1]tmix=frames=10[sm];[1:v]format=gray[m];[r2][m]alphamerge[face];[sm][face]overlay=shortest=1" \
      "${ENC[@]}" "$3" ;;
  mask-preview)
    MASK="${3%.png}-mask.png"
    make_mask "$2" "$MASK" "$4" "$5" "$6" "$7"
    read -r W H <<< "$(size "$2")"
    # 椭圆外面蒙一层半透明红（夜戏本来就暗，只压暗看不出来）
    "$FF" -hide_banner -loglevel error -y -ss "${8:-0}" -i "$2" -i "$MASK" -filter_complex \
      "[0:v]format=gbrp,split[a][b];color=c=red:s=${W}x${H},format=gbrp[r];[a][r]blend=all_mode=normal:all_opacity=0.45:shortest=1[d];[1:v]format=gbrp[m];[d][b][m]maskedmerge" \
      -frames:v 1 "$3" ;;
  *) sed -n 2,8p "$0"; exit 1 ;;
esac
