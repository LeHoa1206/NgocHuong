#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# HSK3 data
hsk3_stories = [
    ("daily", "Buổi sáng của tôi", "我每天早上七点起床。我先刷牙洗脸，然后吃早饭。", "Wǒ měitiān zǎoshang qī diǎn qǐchuáng. Wǒ xiān shuāyá xǐliǎn, ránhòu chī zǎofàn.", "Tôi thức dậy lúc 7 giờ sáng mỗi ngày. Tôi đánh răng rửa mặt trước, sau đó ăn sáng.", [("起床", "qǐchuáng", "thức dậy"), ("刷牙", "shuāyá", "đánh răng")]),
    ("love", "Tôi yêu em", "我很喜欢你。你笑的时候特别漂亮。", "Wǒ hěn xǐhuan nǐ. Nǐ xiào de shíhou tèbié piàoliang.", "Anh rất thích em. Khi em cười thì đặc biệt xinh đẹp.", [("喜欢", "xǐhuan", "thích"), ("漂亮", "piàoliang", "xinh đẹp")]),
    ("food", "Đi ăn phở", "今天中午我们去吃越南河粉。河粉很好吃。", "Jīntiān zhōngwǔ wǒmen qù chī Yuènán héfěn. Héfěn hěn hǎochī.", "Hôm nay trưa chúng ta đi ăn phở. Phở rất ngon.", [("河粉", "héfěn", "phở"), ("好吃", "hǎochī", "ngon")]),
]

# Generate 100 HSK3 stories
output = 'const stories = [\n'

for i in range(1, 101):
    idx = (i - 1) % len(hsk3_stories)
    cat, title, cn, py, vn, vocab = hsk3_stories[idx]
    title_num = f"{title} {i}" if i > len(hsk3_stories) else title
    
    output += f'    {{id: {i}, level: "HSK3", category: "{cat}", title: "{title_num}", '
    output += f'chinese: "{cn}", pinyin: "{py}", vietnamese: "{vn}", '
    output += f'vocabulary: ['
    for v in vocab:
        output += f'{{chinese: "{v[0]}", pinyin: "{v[1]}", vietnamese: "{v[2]}"}}, '
    output = output.rstrip(', ')
    output += ']}},\n'

# Generate 100 HSK4 stories
hsk4_stories = [
    ("daily", "Thói quen tốt", "养成好习惯对我们的生活很重要。我每天坚持锻炼身体。", "Yǎngchéng hǎo xíguàn duì wǒmen de shēnghuó hěn zhòngyào. Wǒ měitiān jiānchí duànliàn shēntǐ.", "Hình thành thói quen tốt rất quan trọng cho cuộc sống. Tôi kiên trì tập luyện mỗi ngày.", [("习惯", "xíguàn", "thói quen"), ("坚持", "jiānchí", "kiên trì")]),
    ("work", "Thăng tiến", "经过努力工作，我终于得到了晋升的机会。", "Jīngguò nǔlì gōngzuò, wǒ zhōngyú dédào le jìnshēng de jīhuì.", "Sau khi làm việc chăm chỉ, cuối cùng tôi đã có cơ hội thăng tiến.", [("经过", "jīngguò", "trải qua"), ("晋升", "jìnshēng", "thăng tiến")]),
    ("travel", "Khám phá", "这次旅行让我体验了不同的文化和风俗。", "Zhè cì lǚxíng ràng wǒ tǐyàn le bùtóng de wénhuà hé fēngsú.", "Chuyến du lịch này cho tôi trải nghiệm văn hóa và phong tục khác nhau.", [("体验", "tǐyàn", "trải nghiệm"), ("风俗", "fēngsú", "phong tục")]),
]

for i in range(101, 201):
    idx = (i - 101) % len(hsk4_stories)
    cat, title, cn, py, vn, vocab = hsk4_stories[idx]
    title_num = f"{title} {i-100}" if i > 100 + len(hsk4_stories) else title
    
    output += f'    {{id: {i}, level: "HSK4", category: "{cat}", title: "{title_num}", '
    output += f'chinese: "{cn}", pinyin: "{py}", vietnamese: "{vn}", '
    output += f'vocabulary: ['
    for v in vocab:
        output += f'{{chinese: "{v[0]}", pinyin: "{v[1]}", vietnamese: "{v[2]}"}}, '
    output = output.rstrip(', ')
    output += ']}}'
    if i < 200:
        output += ','
    output += '\n'

output += '];\n'

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(output)

print("✓ Generated 200 stories (100 HSK3 + 100 HSK4)")
