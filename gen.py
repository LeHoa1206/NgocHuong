#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

# Template data
hsk3 = [
    ("daily", "Buổi sáng", "我每天早上七点起床。我先刷牙洗脸，然后吃早饭。", "Wǒ měitiān zǎoshang qī diǎn qǐchuáng. Wǒ xiān shuāyá xǐliǎn, ránhòu chī zǎofàn.", "Tôi thức dậy lúc 7 giờ sáng. Tôi đánh răng rửa mặt, sau đó ăn sáng.", [("起床","qǐchuáng","thức dậy"),("刷牙","shuāyá","đánh răng")]),
    ("love", "Yêu em", "我很喜欢你。你笑的时候特别漂亮。我想每天都和你在一起。", "Wǒ hěn xǐhuan nǐ. Nǐ xiào de shíhou tèbié piàoliang. Wǒ xiǎng měitiān dōu hé nǐ zài yīqǐ.", "Anh rất thích em. Khi em cười rất xinh. Anh muốn ở bên em mỗi ngày.", [("喜欢","xǐhuan","thích"),("漂亮","piàoliang","xinh đẹp")]),
    ("food", "Ăn phở", "今天中午我们去吃越南河粉。河粉很好吃，也不贵。", "Jīntiān zhōngwǔ wǒmen qù chī Yuènán héfěn. Héfěn hěn hǎochī, yě bù guì.", "Hôm nay trưa đi ăn phở. Phở rất ngon và không đắt.", [("河粉","héfěn","phở"),("好吃","hǎochī","ngon")]),
    ("work", "Làm việc", "我在一家公司工作。我的工作很忙，但是我喜欢我的同事。", "Wǒ zài yī jiā gōngsī gōngzuò. Wǒ de gōngzuò hěn máng, dànshì wǒ xǐhuan wǒ de tóngshì.", "Tôi làm ở một công ty. Công việc bận nhưng tôi thích đồng nghiệp.", [("公司","gōngsī","công ty"),("同事","tóngshì","đồng nghiệp")]),
    ("travel", "Du lịch", "下个月我要去北京旅游。我想看长城和故宫。", "Xià ge yuè wǒ yào qù Běijīng lǚyóu. Wǒ xiǎng kàn Chángchéng hé Gùgōng.", "Tháng sau tôi sẽ đi Bắc Kinh. Tôi muốn xem Vạn Lý Trường Thành.", [("旅游","lǚyóu","du lịch"),("长城","Chángchéng","Vạn Lý Trường Thành")]),
    ("daily", "Học tập", "我每天学习两个小时中文。中文很难，但是很有意思。", "Wǒ měitiān xuéxí liǎng ge xiǎoshí Zhōngwén. Zhōngwén hěn nán, dànshì hěn yǒu yìsi.", "Mỗi ngày tôi học tiếng Trung hai tiếng. Tiếng Trung khó nhưng thú vị.", [("学习","xuéxí","học tập"),("难","nán","khó")]),
    ("love", "Sinh nhật", "明天是你的生日。我给你买了一个礼物。希望你会喜欢。", "Míngtiān shì nǐ de shēngrì. Wǒ gěi nǐ mǎi le yī ge lǐwù. Xīwàng nǐ huì xǐhuan.", "Ngày mai là sinh nhật em. Anh đã mua quà. Hy vọng em thích.", [("生日","shēngrì","sinh nhật"),("礼物","lǐwù","quà")]),
    ("food", "Nấu ăn", "我喜欢做饭。今天晚上我要做中国菜。", "Wǒ xǐhuan zuòfàn. Jīntiān wǎnshang wǒ yào zuò Zhōngguó cài.", "Tôi thích nấu ăn. Tối nay tôi sẽ nấu món Trung Quốc.", [("做饭","zuòfàn","nấu ăn"),("菜","cài","món ăn")]),
    ("work", "Họp", "下午三点我们有一个会议。老板要介绍新项目。", "Xiàwǔ sān diǎn wǒmen yǒu yī ge huìyì. Lǎobǎn yào jièshào xīn xiàngmù.", "Chiều 3 giờ có cuộc họp. Sếp sẽ giới thiệu dự án mới.", [("会议","huìyì","cuộc họp"),("老板","lǎobǎn","sếp")]),
    ("travel", "Máy bay", "我在网上订了机票。下周五我要飞上海。", "Wǒ zài wǎngshàng dìng le jīpiào. Xià zhōuwǔ wǒ yào fēi Shànghǎi.", "Tôi đã đặt vé máy bay online. Thứ 6 tuần sau bay Thượng Hải.", [("机票","jīpiào","vé máy bay"),("飞","fēi","bay")]),
]

hsk4 = [
    ("daily", "Thói quen", "养成好习惯对我们的生活很重要。我每天坚持锻炼身体。", "Yǎngchéng hǎo xíguàn duì wǒmen de shēnghuó hěn zhòngyào. Wǒ měitiān jiānchí duànliàn shēntǐ.", "Hình thành thói quen tốt rất quan trọng. Tôi kiên trì tập luyện mỗi ngày.", [("习惯","xíguàn","thói quen"),("坚持","jiānchí","kiên trì")]),
    ("work", "Thăng tiến", "经过努力工作，我终于得到了晋升的机会。", "Jīngguò nǔlì gōngzuò, wǒ zhōngyú dédào le jìnshēng de jīhuì.", "Sau khi làm việc chăm chỉ, cuối cùng tôi có cơ hội thăng tiến.", [("经过","jīngguò","trải qua"),("晋升","jìnshēng","thăng tiến")]),
    ("travel", "Khám phá", "这次旅行让我体验了不同的文化和风俗。", "Zhè cì lǚxíng ràng wǒ tǐyàn le bùtóng de wénhuà hé fēngsú.", "Chuyến du lịch này cho tôi trải nghiệm văn hóa khác nhau.", [("体验","tǐyàn","trải nghiệm"),("风俗","fēngsú","phong tục")]),
    ("love", "Cam kết", "我愿意陪伴你度过人生的每一个阶段。", "Wǒ yuànyì péibàn nǐ dùguò rénshēng de měi yī ge jiēduàn.", "Anh sẵn sàng đồng hành cùng em qua mọi giai đoạn cuộc đời.", [("陪伴","péibàn","đồng hành"),("阶段","jiēduàn","giai đoạn")]),
    ("food", "Ẩm thực", "品尝当地美食是旅行中最享受的事情之一。", "Pǐncháng dāngdì měishí shì lǚxíng zhōng zuì xiǎngshòu de shìqing zhī yī.", "Thưởng thức ẩm thực địa phương là một trong những điều thú vị nhất khi du lịch.", [("品尝","pǐncháng","thưởng thức"),("享受","xiǎngshòu","tận hưởng")]),
    ("daily", "Đọc sách", "阅读不仅能增长知识，还能提高我们的思考能力。", "Yuèdú bùjǐn néng zēngzhǎng zhīshi, hái néng tígāo wǒmen de sīkǎo nénglì.", "Đọc sách không chỉ tăng kiến thức mà còn nâng cao khả năng tư duy.", [("阅读","yuèdú","đọc"),("增长","zēngzhǎng","tăng trưởng")]),
    ("work", "Hợp tác", "团队合作精神在现代职场中越来越重要。", "Tuánduì hézuò jīngshén zài xiàndài zhíchǎng zhōng yuè lái yuè zhòngyào.", "Tinh thần làm việc nhóm ngày càng quan trọng trong môi trường làm việc hiện đại.", [("团队","tuánduì","đội nhóm"),("职场","zhíchǎng","nơi làm việc")]),
    ("travel", "Văn hóa", "了解不同国家的文化差异能够开阔我们的视野。", "Liǎojiě bùtóng guójiā de wénhuà chāyì nénggòu kāikuò wǒmen de shìyě.", "Hiểu sự khác biệt văn hóa giữa các nước có thể mở rộng tầm nhìn.", [("差异","chāyì","khác biệt"),("视野","shìyě","tầm nhìn")]),
    ("love", "Tin tưởng", "信任是维持长久关系的基础。", "Xìnrèn shì wéichí chángjiǔ guānxi de jīchǔ.", "Tin tưởng là nền tảng duy trì mối quan hệ lâu dài.", [("信任","xìnrèn","tin tưởng"),("维持","wéichí","duy trì")]),
    ("food", "Dinh dưỡng", "均衡的饮食对保持健康非常关键。", "Jūnhéng de yǐnshí duì bǎochí jiànkāng fēicháng guānjiàn.", "Chế độ ăn cân bằng rất quan trọng để giữ sức khỏe.", [("均衡","jūnhéng","cân bằng"),("饮食","yǐnshí","chế độ ăn")]),
]

out = "const stories = [\n"

# Generate 100 HSK3
for i in range(100):
    t = hsk3[i % len(hsk3)]
    out += f'    {{id: {i+1}, level: "HSK3", category: "{t[0]}", title: "{t[1]} #{i+1}", chinese: "{t[2]}", pinyin: "{t[3]}", vietnamese: "{t[4]}", vocabulary: ['
    for v in t[5]:
        out += f'{{chinese: "{v[0]}", pinyin: "{v[1]}", vietnamese: "{v[2]}"}}, '
    out = out.rstrip(', ') + ']},\n'

# Generate 100 HSK4
for i in range(100):
    t = hsk4[i % len(hsk4)]
    out += f'    {{id: {i+101}, level: "HSK4", category: "{t[0]}", title: "{t[1]} #{i+1}", chinese: "{t[2]}", pinyin: "{t[3]}", vietnamese: "{t[4]}", vocabulary: ['
    for v in t[5]:
        out += f'{{chinese: "{v[0]}", pinyin: "{v[1]}", vietnamese: "{v[2]}"}}, '
    out = out.rstrip(', ') + ']}'
    if i < 99:
        out += ','
    out += '\n'

out += "];\n"

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(out)

print("✓ Đã tạo 200 câu chuyện!")
