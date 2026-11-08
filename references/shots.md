# 镜头设计和提示词

## 定镜头的规则（《Slow Shutter》验证有效）

- **镜头跟着歌词意象走。** 歌词写物（的士、渡轮、雾窗），做空镜；写「我不动」「我在等」，做她静止、周围在动的剧情镜头；副歌和情绪最高的一句，做演唱镜头。
- **演唱镜头少用。** 9 个镜头里只有 3 个是演唱。这种风格靠空镜和剧情镜头出效果。
- **演唱镜头换地方。** 茶餐厅、天桥、月台各一个。全片同一个地方唱会单调。
- **两个空镜可以连着接。** bridge 里的士接渡轮反而有节奏。
- **短于 5 秒的快切可以用**（2.6 秒、2.8 秒），生成 5 秒再截。
- **剪辑点放在两句之间的空隙。** 例：「白晝」128.59 秒结束，「得我」128.79 秒开始，切在 128.7。
- **写歌词的时候就在写分镜。** 歌词里直接写画面（德輔道電車、茶餐廳落閘、起霧的窗寫名），后面就有镜头可拍。

每个镜头都要满足：**机位锁死，主角不动（或没有主角），周围有快速、贴近镜头的运动。** 没有运动的镜头，后期叠帧不会有拖影。

## 关键帧提示词结构

**人物段**（有主角的镜头才加，每镜一字不改，换主角时只改造型）：
```
The woman is the person in image 1: keep her face exactly the same (eyes, brows, nose, lips, jawline, skin tone). Early-1990s Hong Kong styling: long dark wavy hair, a black satin slip dress under an oversized charcoal men's blazer, matte red lipstick, small gold hoop earrings.
```

**场景段**的写法：
- 空镜在场景段末尾写 `No people in the frame.`；视频提示词里写在最前面。
- 写清机位：`camera locked off`，加高度（路边低机位 `low at the kerb`、视线高度 `at her eye level`、胸口高度 `at chest height`）。
- 主角：`stands perfectly still`、`stands still with her back against the railing`。
- 周围：快速、贴近镜头的运动，`a dense crowd hurries past her in both directions, close to the lens`、`red taxis stream past`、`a train rushes past directly behind her`。
- 演唱镜头：`Medium close-up from the chest up`、`lips softly parted as if about to sing`，嘴要露出来、够大。
- 演唱镜头加 `Nobody stands between her and the camera.` 和 `Her face is crisp and sharp.` 护脸椭圆里有东西经过的话，那东西是清楚的，看起来很怪。

最后接 `look.md` 的关键帧版胶片色调段。

## 9 个实测关键帧的场景段

主角镜头前面加人物段，后面都接胶片色调段。

| # | 类型 | 场景段 |
|---|---|---|
| 1 | 空镜 | Night, wide establishing shot of Victoria Harbour, Hong Kong, in the early 1990s, from the Tsim Sha Tsui waterfront at water level. A green-and-white Star Ferry crosses the dark harbour from left to right; its cabin lights and the neon of the Hong Kong Island skyline across the water stretch into long shimmering streaks on the black water. Light mist, no people in the frame. |
| 2 | 演唱 | Night, inside an old Hong Kong cha chaan teng diner that is about to close: close-up of her face and shoulders from a three-quarter angle, she sits by the rain-streaked window, head tilted slightly toward the glass, lips softly parted as if beginning to sing, eyes half-lowered. A green fluorescent tube above lights her face; behind her through the window red taxis pass as smeared red streaks and the neon outside blurs into soft ribbons. |
| 3 | 空镜 | Night, inside an old Hong Kong cha chaan teng diner that is about to close. Extreme close-up of the fogged-up window glass beside a green vinyl booth: a few loose handwritten strokes have been drawn with a fingertip in the condensation, and they are starting to run, thin droplets sliding down from each stroke. The glass fills the frame and is in sharp focus. Through it, the night street outside is soft and out of focus: a red taxi and the yellow lights of a double-decker tram passing, their lights smeared into long horizontal red and amber streaks, neon reflected on the wet road. No people in the frame. |
| 4 | 剧情 | Night, the middle of a crowded pedestrian crossing in Mong Kok, Hong Kong, under dense overhanging neon signs. She stands perfectly still in the centre of the frame, facing the camera, arms at her sides, lips closed, calm, looking just past the lens. A dense crowd hurries past her in both directions, close to the lens; the passers-by are smeared into translucent ghost trails, while she alone is crisp and sharp. Medium-wide shot, camera at chest height, locked off. |
| 5 | 演唱 | Night, on a pedestrian footbridge above a busy Hong Kong road. Medium close-up from the chest up, camera locked off at her eye level: she stands still with her back against the railing, facing the camera, chin slightly raised, lips softly parted as if about to sing, wind lifting a few strands of hair. Behind her and below, the road is full of traffic: red taxis and double-decker buses stream past as long red and white light trails, a red traffic signal glows and blooms, the towers behind are soft. Her face is crisp and sharp. |
| 6 | 剧情 | Night, wide shot across a Hong Kong street. On the far side of the tram tracks she stands alone and perfectly still under a lit tram-stop shelter, hands in her blazer pockets, facing the camera, waiting. Her whole figure is clearly visible. The tail end of a green double-decker tram is just sliding out of the left edge of the frame in the foreground, smeared into a streak of green and warm window light. Wet road reflecting neon. Camera locked off at head height. |
| 7 | 空镜 | No people in the frame. Night, a busy Hong Kong street, camera low at the kerb and locked off. A line of red taxis passes close to the lens, each with its roof sign lit up white, their headlights and tail lights smeared into long red and white streaks; the wet road mirrors the neon signs above. |
| 8 | 空镜 | No people in the frame. Night, at the Star Ferry pier in Tsim Sha Tsui, Hong Kong, camera locked off on the pier at the water's edge. The green-and-white Star Ferry is pulling away from the pier close to the camera, its rows of lit cabin windows and deck lamps smeared into warm horizontal streaks; beyond it the Hong Kong Island skyline glows across the black harbour, its lights rippling on the water. |
| 9 | 演唱 | Night, on an early-1990s Hong Kong MTR platform under green-tinted fluorescent light. Medium close-up from the chest up, camera locked off at her eye level: she stands still near the platform edge facing the camera, lips softly parted as if about to sing. Directly behind her a train rushes past, its lit windows smeared into one long horizontal streak of white and green light. Nobody stands between her and the camera. Her face is crisp and sharp. |

第 2 镜（三分之四侧脸、头靠向窗）后来她一直转头，护脸椭圆罩不住，只能不加拖影。演唱镜头还是写正面对镜头、头部动作小。

## 视频提示词

结构：机位段 + 动作段 +（剧情镜头）闭嘴句 / （演唱镜头）口型句 + 视频版胶片色调段 + `No on-screen text, no subtitles.`。空镜在最前面加 `No people in the frame.`。

| # | 动作段 |
|---|---|
| 3 | Locked-off static camera, no camera movement at all. Extreme close-up of the fogged-up diner window: the handwritten strokes in the condensation slowly run and melt away, droplets trickling down from each stroke one after another until the writing is almost gone. Behind the glass, out of focus, the night street is busy: red taxis, cars and a yellow double-decker tram pass quickly from right to left, one after another, their headlights and the neon reflections on the wet road streaking across the frame. |
| 4 | Locked-off static camera on a tripod at chest height, no camera movement at all. The woman stands perfectly still in the middle of the crowded Mong Kok crossing, facing the camera, arms at her sides; only her hair and blazer stir a little in the wind and she blinks slowly. Not singing, not talking: her mouth stays closed. Around her a dense crowd of pedestrians rushes past quickly in both directions, close to the lens, brushing past her shoulders; behind them the neon signs flicker. |
| 5 | Locked-off static camera at her eye level, no camera movement at all. She stays standing in the same place with her back against the footbridge railing, facing the camera; the wind moves her hair. Behind her and below, the traffic flows fast: red taxis, cars and double-decker buses stream past quickly in both directions, their head and tail lights streaking, the red traffic signals glowing. |
| 6 | Locked-off static camera at head height, no camera movement at all. She stands perfectly still under the tram-stop shelter, hands in her blazer pockets, waiting, looking toward the camera; she blinks slowly. Not singing, not talking: her mouth stays closed. The green tram beside her pulls away quickly and slides out of the left edge of the frame; red taxis and cars stream past quickly on the road to the right, and a few passers-by hurry along the pavement behind her. |
| 7 | Locked-off static camera low at the kerb, no camera movement at all. Red taxis with their roof signs lit stream past quickly and close to the lens one after another, headlights and tail lights streaking, water spraying off the wet road; neon signs above flicker. |
| 8 | Locked-off static camera on the pier, no camera movement at all. The green-and-white Star Ferry pulls away from the pier and glides out across the harbour, its lit cabin windows sliding past; small boats cross the water fast in the distance, the skyline lights rippling on the waves. |
| 9 | Locked-off static camera at her eye level, no camera movement at all. She stays standing in the same place on the platform facing the camera. Directly behind her a train rushes past at full speed, its lit windows streaking by in a blur, the wind of it lifting her hair; nobody passes between her and the camera. |

演唱镜头（5、9）在动作段后面加：
```
The person sings this part of the song with natural, accurate lip movement and expressive face; breathing and small head movement.
```

第 1 镜当时写了 `the camera drifts slowly to the right`，第 2 镜写了 `Handheld camera with a gentle drift`。第 1 镜叠帧后整个画面一起糊，拖影效果偏弱。**这两句是反例，别再写。**
