# 色调与胶片提示词

颜色全靠生图这一步定。图生视频会沿用关键帧的颜色，后期也不调色。所以每张关键帧都要接**同一段**胶片色调提示词，一字不改。

## 关键帧版（原文照用，接在场景段后面）

```
Look of a 1994 Hong Kong art-house film shot on 35mm: slow shutter (about 1/8 second), so anything moving smears into soft streaks and ghost trails of light while still things stay crisp. Kodak Vision 500T film grain, gentle halation around highlights, teal-green and deep blue night with neon red and amber accents, crushed blacks. Restrained, natural, not over-processed. A single still frame, 16:9, no text overlay, no subtitles, no watermark.
```

竖屏把 `16:9` 改成 `9:16`（竖屏没实测过）。

## 视频版（开头和结尾改掉，中间不变）

```
Shot on 35mm film like a 1994 Hong Kong art-house movie, with a slow shutter (about 1/8 second): anything moving smears into soft streaks and ghost trails of light while still things stay crisp. Kodak Vision 500T grain, gentle halation around highlights, teal-green and deep blue night with neon red and amber accents, crushed blacks. Restrained and natural, not over-processed.
```

## 每句管什么

| 句子 | 管什么 |
|---|---|
| `1994 Hong Kong art-house film shot on 35mm` | 年代、地点和胶片感，决定整体气质 |
| `slow shutter ... ghost trails of light` | 让模型在构图上给运动留位置，车灯、霓虹会有一点点拖尾。**真正的拖影不靠它**，靠后期 |
| `Kodak Vision 500T film grain` | 颗粒。500T 是灯光型夜景胶片，暖光会偏暖、夜色偏青 |
| `gentle halation around highlights` | 霓虹、车灯周围一圈柔光。写 `gentle`，别写 `glowing around every highlight`，否则溢出太重 |
| `teal-green and deep blue night with neon red and amber accents` | 主色青绿，点缀霓虹红和琥珀 |
| `crushed blacks` | 暗部压死，画面有一成到两成是近黑 |
| `Restrained, natural, not over-processed.` | **最重要的一句。** 去掉以后，画面容易变得像过度调色的样子 |
| `no text overlay, no subtitles, no watermark` | 防止模型自己加字 |

## 实测出来的颜色

《Slow Shutter》9 张关键帧（Nano Banana 2.1）测出来的数，`scripts/color-check.py` 就拿这些当参照：

| 指标 | 9 张的范围 | 意思 |
|---|---|---|
| 平均亮度 | 0.20–0.35 | 整体偏暗，是夜戏 |
| 亮度中位数 | 0.14–0.28 | |
| 近黑像素（亮度 < 0.06）占比 | 10%–20% | 暗部压死，但不是一片黑 |
| 最亮 5% 的亮度 | 0.56–0.84 | 高光没有爆白 |
| 平均饱和度 | 0.45–0.56 | |
| 青绿（色相 140–200°）占比 | 14%–28% | **主色** |
| 琥珀（20–55°） | 2%–16% | 暖光点缀：钠灯、窗里的灯 |
| 红（340–20°） | 0%–9% | 霓虹、的士、红灯 |
| 蓝（200–250°） | 0%–7% | **几乎没有。** 提示词写了 deep blue night，模型出的夜色是带青的黑，不是蓝 |

整组 10 个主色（按占比从高到低）：

| 色值 | 占比 | 是什么 |
|---|---|---|
| `#0F1C19` | 18% | 带青的暗部 |
| `#03090A` | 18% | 近黑 |
| `#1B312D` | 16% | 深青绿夜色 |
| `#2B4B46` | 10% | 青绿中间调 |
| `#4E685E` | 10% | 灰绿（荧光灯照的墙、地面） |
| `#758F7F` | 8% | 浅灰绿 |
| `#523B2A` | 8% | 暗琥珀、棕 |
| `#B7B08F` | 6% | 暖米色高光 |
| `#966345` | 4% | 琥珀 |
| `#D9E3D0` | 3% | 带绿的白，最亮处 |

高光是暖米色、带一点绿，不是纯白。

## 场景里的光源怎么写

颜色除了胶片色调段，还要靠场景里写具体的光源。实测提示词里用过、效果好的：

| 场景 | 写法 |
|---|---|
| 茶餐厅 | `a green fluorescent tube above lights her face`、`green vinyl booth`、`formica table` |
| 旺角街 | `dense overhanging neon signs in red, pink and amber`、`the asphalt wet and mirror-like` |
| 天桥、马路 | `red taxis and double-decker buses stream past as long red and white light trails`、`a red traffic signal glows and blooms` |
| 电车站 | `a green double-decker tram ... smeared into a streak of green and warm window light`、`wet road reflecting neon` |
| 港铁月台 | `under green-tinted fluorescent light`、`lit windows smeared into one long horizontal streak of white and green light` |
| 维港、渡轮 | `the green-and-white Star Ferry`、`lit cabin windows`、`the Hong Kong Island skyline glows across the black harbour, its lights rippling on the water`、`light mist` |

规律：**绿来自荧光灯和电车渡轮，红来自霓虹、的士、红灯，琥珀来自窗里的灯和钠灯，地面一律写湿的，好反光。**

## 被否的写法

- 最早的版本：`shot handheld ... by a restless cinematographer`、`combined with a short burst of flash`、`halation glowing around every highlight`、`saturated teal-green`、`wide-angle lens held close to her, horizon slightly tilted`。用 GPT Image 2.5 出，作者看了觉得质感不错但「用力过度」。手持和倾斜也和后期要的锁死机位冲突。
- 换成 Nano Banana 2.1，并加上 `Restrained, natural, not over-processed`、`gentle`，才定下来。

## 换题材

这段色调是按九十年代香港夜戏定的。换城市、换白天、换王家卫别的片子的色调（比如《花样年华》的暖红墨绿），都没实测过：先用同一组场景出 3–4 张样张给用户挑，挑定以后再固定成新的一段，后面整片都用它。
