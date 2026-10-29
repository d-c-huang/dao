/**
 * 六十四卦按《周易》通行卦序排列；上下卦名称与 src/data.ts 一致。
 * 卦辞及大象据维基文库《周易》各卦公共领域原文核对，2026-10-29。
 * 简体卦名便于检索，原文保留繁体；summary 与 keywords 为项目入门整理。
 * 卦序编号与本项目二进制编码分别使用。校录范围及异文见 docs/sources/zhou-yi-64.md。
 */
export interface Hexagram {
  number: number;
  name: string;
  traditionalName: string;
  pinyin: string;
  lower: string;
  upper: string;
  title: string;
  judgment: string;
  imageText: string;
  summary: string;
  keywords: string[];
  sourceUrl: string;
}

export const hexagrams: Hexagram[] = [
  {
    "number": 1,
    "name": "乾",
    "traditionalName": "乾",
    "pinyin": "qián",
    "lower": "乾",
    "upper": "乾",
    "title": "乾为天",
    "judgment": "乾：元亨。利貞。",
    "imageText": "象曰：天行健，君子以自強不息。",
    "summary": "六爻皆阳，乾以天的运行表现健行。《大象》由此引出持续自我修养的要求；“自强不息”强调过程中的积累。",
    "keywords": [
      "持续",
      "进取",
      "自强修养"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/乾"
  },
  {
    "number": 2,
    "name": "坤",
    "traditionalName": "坤",
    "pinyin": "kūn",
    "lower": "坤",
    "upper": "坤",
    "title": "坤为地",
    "judgment": "坤：元亨。利牝馬之貞。君子有攸往，先迷後得主。利西南得朋，東北喪朋。安貞，吉。",
    "imageText": "象曰：地勢坤，君子以厚德載物。",
    "summary": "六爻皆阴，坤以地的承载表现顺与厚。《大象》把厚德与容纳万物相联系，可从支持、配合和承接责任理解。",
    "keywords": [
      "承载",
      "包容",
      "顺势配合"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/坤"
  },
  {
    "number": 3,
    "name": "屯",
    "traditionalName": "屯",
    "pinyin": "zhūn",
    "lower": "震",
    "upper": "坎",
    "title": "水雷屯",
    "judgment": "屯：元亨，利貞。勿用有攸往，利建侯。",
    "imageText": "象曰：雲雷，屯；君子以經綸。",
    "summary": "下震上坎，动而遇险，表现事物初起时的困难。《大象》说“经纶”，着重在纷乱中梳理关系、建立秩序。",
    "keywords": [
      "初生",
      "艰难",
      "建立秩序"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/屯"
  },
  {
    "number": 4,
    "name": "蒙",
    "traditionalName": "蒙",
    "pinyin": "méng",
    "lower": "坎",
    "upper": "艮",
    "title": "山水蒙",
    "judgment": "蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三瀆，瀆則不告。利貞。",
    "imageText": "象曰：山下出泉，蒙；君子以果行育德。",
    "summary": "下坎上艮，山下出泉，借蒙昧初开说明学习。《卦辞》强调求教者的主动与诚敬，《大象》联系行动与德性的培养。",
    "keywords": [
      "启蒙",
      "求学",
      "教育回应"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/蒙"
  },
  {
    "number": 5,
    "name": "需",
    "traditionalName": "需",
    "pinyin": "xū",
    "lower": "乾",
    "upper": "坎",
    "title": "水天需",
    "judgment": "需：有孚，光亨。貞吉，利涉大川。",
    "imageText": "象曰：雲上於天，需；君子以飲食宴樂。",
    "summary": "下乾上坎，天上积云而雨未至。《大象》以饮食宴乐说明等待中的生活安排；可从耐心、准备和条件成熟来理解。",
    "keywords": [
      "等待",
      "时机",
      "准备供养"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/需"
  },
  {
    "number": 6,
    "name": "讼",
    "traditionalName": "訟",
    "pinyin": "sòng",
    "lower": "坎",
    "upper": "乾",
    "title": "天水讼",
    "judgment": "訟：有孚，窒，惕，中吉，終凶。利見大人，不利涉大川。",
    "imageText": "象曰：天與水違行，訟；君子以作事謀始。",
    "summary": "下坎上乾，天与水异向而行，取争讼之义。《大象》强调做事之前先谋划，提示对分歧与责任作早期辨明。",
    "keywords": [
      "争端",
      "审慎",
      "谋始明责"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/訟"
  },
  {
    "number": 7,
    "name": "师",
    "traditionalName": "師",
    "pinyin": "shī",
    "lower": "坎",
    "upper": "坤",
    "title": "地水师",
    "judgment": "師：貞丈人吉，无咎。",
    "imageText": "象曰：地中有水，師；君子以容民畜衆。",
    "summary": "下坎上坤，地中有水，取众人汇聚和军旅之义。经文保留古代统众语境，《大象》也关注容纳民众与蓄养力量。",
    "keywords": [
      "组织",
      "众人",
      "纪律责任"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/師"
  },
  {
    "number": 8,
    "name": "比",
    "traditionalName": "比",
    "pinyin": "bǐ",
    "lower": "坤",
    "upper": "坎",
    "title": "水地比",
    "judgment": "比：吉。原筮元永貞，无咎。不寧方來，後夫凶。",
    "imageText": "象曰：地上有水，比；先王以建萬國，親諸侯。",
    "summary": "下坤上坎，水在地上相亲相依，取亲比联合之义。《大象》借建国亲侯表达关系的组织，重点在联结与共同秩序。",
    "keywords": [
      "亲近",
      "联合",
      "信任关系"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/比"
  },
  {
    "number": 9,
    "name": "小畜",
    "traditionalName": "小畜",
    "pinyin": "xiǎo xù",
    "lower": "乾",
    "upper": "巽",
    "title": "风天小畜",
    "judgment": "小畜：亨。密雲不雨，自我西郊。",
    "imageText": "象曰：風行天上，小畜，君子以懿文德。",
    "summary": "下乾上巽，风行天上，云聚而尚未成雨。“小畜”可从小规模积累与约束理解，《大象》着重文德的涵养。",
    "keywords": [
      "小有",
      "积蓄",
      "修养准备"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/小畜"
  },
  {
    "number": 10,
    "name": "履",
    "traditionalName": "履",
    "pinyin": "lǚ",
    "lower": "兑",
    "upper": "乾",
    "title": "天泽履",
    "judgment": "履虎尾，不咥人，亨。",
    "imageText": "象曰：上天下澤，履；君子以辨上下，定民志。",
    "summary": "下兑上乾，经文以踩近虎尾的处境说明履行。《大象》把卦象联系到上下秩序；阅读重点在行动中的分寸与审慎。",
    "keywords": [
      "践履",
      "礼序",
      "谨慎行动"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/履"
  },
  {
    "number": 11,
    "name": "泰",
    "traditionalName": "泰",
    "pinyin": "tài",
    "lower": "乾",
    "upper": "坤",
    "title": "地天泰",
    "judgment": "泰：小往大來，吉亨。",
    "imageText": "象曰：天地交，泰；后以財成天地之道，輔相天地之宜，以左右民。",
    "summary": "下乾上坤，天地交而万物通，是泰卦的重要取象。《大象》进一步谈到辅助天地之宜，可从沟通与相互成全理解。",
    "keywords": [
      "交往",
      "通达",
      "协调互济"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/泰"
  },
  {
    "number": 12,
    "name": "否",
    "traditionalName": "否",
    "pinyin": "pǐ",
    "lower": "坤",
    "upper": "乾",
    "title": "天地否",
    "judgment": "否之匪人，不利君子貞，大往小來。",
    "imageText": "象曰：天地不交，否；君子以儉德辟難，不可榮以祿。",
    "summary": "下坤上乾，与泰卦的上下结构相反，取天地不交之象。《大象》把闭塞处境联系到节俭守德与避难，强调处境变化中的自持。",
    "keywords": [
      "隔阂",
      "闭塞",
      "守持原则"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/否"
  },
  {
    "number": 13,
    "name": "同人",
    "traditionalName": "同人",
    "pinyin": "tóng rén",
    "lower": "离",
    "upper": "乾",
    "title": "天火同人",
    "judgment": "同人于野，亨。利涉大川，利君子貞。",
    "imageText": "象曰：天與火，同人；君子以類族辨物。",
    "summary": "下离上乾，天与火相应，取与人相同相合之义。《卦辞》说“同人于野”，《大象》又强调类族辨物，显示联合仍需辨别差异。",
    "keywords": [
      "共同",
      "目标",
      "辨别异同"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/同人"
  },
  {
    "number": 14,
    "name": "大有",
    "traditionalName": "大有",
    "pinyin": "dà yǒu",
    "lower": "乾",
    "upper": "离",
    "title": "火天大有",
    "judgment": "大有：元亨。",
    "imageText": "象曰：火在天上，大有；君子以遏惡揚善，順天休命。",
    "summary": "下乾上离，火在天上，明照广远，取大有之义。《大象》将丰富拥有与遏恶扬善相联系，关注资源和影响力的使用。",
    "keywords": [
      "丰厚",
      "拥有",
      "善用资源"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/大有"
  },
  {
    "number": 15,
    "name": "谦",
    "traditionalName": "謙",
    "pinyin": "qiān",
    "lower": "艮",
    "upper": "坤",
    "title": "地山谦",
    "judgment": "謙：亨，君子有終。",
    "imageText": "象曰：地中有山，謙；君子以裒多益寡，稱物平施。",
    "summary": "下艮上坤，山藏地中，以高居下，取谦之义。《大象》说裒多益寡、称物平施，既谈自我谦抑，也谈适度调剂。",
    "keywords": [
      "谦逊",
      "有节",
      "调剂多寡"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/謙"
  },
  {
    "number": 16,
    "name": "豫",
    "traditionalName": "豫",
    "pinyin": "yù",
    "lower": "坤",
    "upper": "震",
    "title": "雷地豫",
    "judgment": "豫：利建侯行師。",
    "imageText": "象曰：雷出地奮，豫。先王以作樂崇德，殷薦之上帝，以配祖考。",
    "summary": "下坤上震，雷出地上，使万物振动，取和乐振奋之象。《大象》保留礼乐祭祀语境，说明情感表达与群体秩序的联系。",
    "keywords": [
      "和乐",
      "振奋",
      "共同动员"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/豫"
  },
  {
    "number": 17,
    "name": "随",
    "traditionalName": "隨",
    "pinyin": "suí",
    "lower": "震",
    "upper": "兑",
    "title": "泽雷随",
    "judgment": "隨：元亨。利貞。无咎。",
    "imageText": "象曰：澤中有雷，隨；君子以嚮晦入宴息。",
    "summary": "下震上兑，泽中有雷，取随顺之义。《大象》以向晚入内休息为例，可从顺应时序和有节律的生活来理解。",
    "keywords": [
      "顺应",
      "时势",
      "作息有节"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/隨"
  },
  {
    "number": 18,
    "name": "蛊",
    "traditionalName": "蠱",
    "pinyin": "gǔ",
    "lower": "巽",
    "upper": "艮",
    "title": "山风蛊",
    "judgment": "蠱：元亨。利涉大川。先甲三日，後甲三日。",
    "imageText": "象曰：山下有風，蠱；君子以振民育德。",
    "summary": "下巽上艮，山下有风，卦名涉及积久而生的弊坏。《大象》着重振民育德，说明整治不仅是除旧，也包括恢复人的活力。",
    "keywords": [
      "整治",
      "积弊",
      "更新教养"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/蠱"
  },
  {
    "number": 19,
    "name": "临",
    "traditionalName": "臨",
    "pinyin": "lín",
    "lower": "兑",
    "upper": "坤",
    "title": "地泽临",
    "judgment": "臨：元亨。利貞。至于八月有凶。",
    "imageText": "象曰：澤上有地，臨；君子以教思无窮，容保民无疆。",
    "summary": "下兑上坤，地临于泽，取接近与照临之义。《大象》以教思无穷、容保无疆说明照顾和教养；经文同时提醒盛衰有时。",
    "keywords": [
      "接近",
      "照临",
      "教养容保"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/臨"
  },
  {
    "number": 20,
    "name": "观",
    "traditionalName": "觀",
    "pinyin": "guàn",
    "lower": "坤",
    "upper": "巽",
    "title": "风地观",
    "judgment": "觀：盥而不薦，有孚顒若。",
    "imageText": "象曰：風行地上，觀；先王以省方，觀民設教。",
    "summary": "下坤上巽，风行地上，取观察与展示之义。《卦辞》借祭祀的肃敬姿态取象，《大象》则联系省察民情与设教。",
    "keywords": [
      "观察",
      "省察",
      "示范教化"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/觀"
  },
  {
    "number": 21,
    "name": "噬嗑",
    "traditionalName": "噬嗑",
    "pinyin": "shì hé",
    "lower": "震",
    "upper": "离",
    "title": "火雷噬嗑",
    "judgment": "噬嗑：亨。利用獄。",
    "imageText": "象曰：雷電噬嗑；先王以明罰敕法。",
    "summary": "下震上离，以咬合去除口中阻隔的形象说明噬嗑。《卦辞》和《大象》涉及刑狱与法度，应放在古代治理语境中阅读。",
    "keywords": [
      "排除",
      "阻隔",
      "明法审断"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/噬嗑"
  },
  {
    "number": 22,
    "name": "贲",
    "traditionalName": "賁",
    "pinyin": "bì",
    "lower": "离",
    "upper": "艮",
    "title": "山火贲",
    "judgment": "賁：亨。小利有攸往。",
    "imageText": "象曰：山下有火，賁；君子以明庶政，无敢折獄。",
    "summary": "下离上艮，山下有火，取文采和修饰之义。《大象》把明庶政与不敢轻易折狱并提，说明外在明晰仍需审慎判断。",
    "keywords": [
      "文饰",
      "有度",
      "明辨政事"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/賁"
  },
  {
    "number": 23,
    "name": "剥",
    "traditionalName": "剝",
    "pinyin": "bō",
    "lower": "坤",
    "upper": "艮",
    "title": "山地剥",
    "judgment": "剝：不利有攸往。",
    "imageText": "象曰：山附地上，剝；上以厚下，安宅。",
    "summary": "下坤上艮，山附于地，取剥落之义。《大象》提出厚下安宅，可从承重基础与整体稳定的关系理解。",
    "keywords": [
      "剥落",
      "衰减",
      "厚植根基"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/剝"
  },
  {
    "number": 24,
    "name": "复",
    "traditionalName": "復",
    "pinyin": "fù",
    "lower": "震",
    "upper": "坤",
    "title": "地雷复",
    "judgment": "復：亨。出入无疾，朋來无咎。反復其道，七日來復，利有攸往。",
    "imageText": "象曰：雷在地中，復；先王以至日閉關，商旅不行，后不省方。",
    "summary": "下震上坤，阳爻初复，雷藏地中，取回返之义。《大象》以冬至闭关、暂停行旅取象，强调在更新之初保养生机。",
    "keywords": [
      "回返",
      "复始",
      "休养生息"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/復"
  },
  {
    "number": 25,
    "name": "无妄",
    "traditionalName": "无妄",
    "pinyin": "wú wàng",
    "lower": "震",
    "upper": "乾",
    "title": "天雷无妄",
    "judgment": "无妄：元亨。利貞。其匪正有眚，不利有攸往。",
    "imageText": "象曰：天下雷行，物與无妄；先王以茂對時，育萬物。",
    "summary": "下震上乾，雷行天下而万物随时生长。“无妄”可从不虚妄、不妄为来理解，《大象》关注顺时养育万物。",
    "keywords": [
      "真实",
      "无妄",
      "顺应自然"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/无妄"
  },
  {
    "number": 26,
    "name": "大畜",
    "traditionalName": "大畜",
    "pinyin": "dà xù",
    "lower": "乾",
    "upper": "艮",
    "title": "山天大畜",
    "judgment": "大畜：利貞，不家食吉，利涉大川。",
    "imageText": "象曰：天在山中，大畜；君子以多識前言往行，以畜其德。",
    "summary": "下乾上艮，天在山中，取蓄养与止健之义。《大象》强调多识前人的言行，以见闻积累涵养德性。",
    "keywords": [
      "积蓄",
      "涵养",
      "博学厚德"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/大畜"
  },
  {
    "number": 27,
    "name": "颐",
    "traditionalName": "頤",
    "pinyin": "yí",
    "lower": "震",
    "upper": "艮",
    "title": "山雷颐",
    "judgment": "頤：貞吉。觀頤，自求口實。",
    "imageText": "象曰：山下有雷，頤；君子以慎言語，節飲食。",
    "summary": "下震上艮，卦形与口颐相关，取养之义。《大象》把养具体落实到语言和饮食，提示入口、出口都需要节制。",
    "keywords": [
      "养生",
      "养德",
      "慎言节食"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/頤"
  },
  {
    "number": 28,
    "name": "大过",
    "traditionalName": "大過",
    "pinyin": "dà guò",
    "lower": "巽",
    "upper": "兑",
    "title": "泽风大过",
    "judgment": "大過：棟橈，利有攸往，亨。",
    "imageText": "象曰：澤滅木，大過。君子以獨立不懼，遯世无悶。",
    "summary": "下巽上兑，泽水漫过树木，卦辞又以栋梁弯曲取象。它呈现负荷过大的非常处境，《大象》强调独立自守的态度。",
    "keywords": [
      "承重",
      "过度",
      "独立自持"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/大過"
  },
  {
    "number": 29,
    "name": "坎",
    "traditionalName": "坎",
    "pinyin": "kǎn",
    "lower": "坎",
    "upper": "坎",
    "title": "坎为水",
    "judgment": "習坎：有孚，維心亨。行有尚。",
    "imageText": "象曰：水洊至，習坎；君子以常德行，習教事。",
    "summary": "上下皆坎，水接续而至，称“习坎”。《大象》由反复的水流引出德行与教习的持续，关注在困难中形成稳定实践。",
    "keywords": [
      "重险",
      "反复",
      "习行守信"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/坎"
  },
  {
    "number": 30,
    "name": "离",
    "traditionalName": "離",
    "pinyin": "lí",
    "lower": "离",
    "upper": "离",
    "title": "离为火",
    "judgment": "離：利貞。亨。畜牝牛，吉。",
    "imageText": "象曰：明兩作離，大人以繼明照于四方。",
    "summary": "上下皆离，明光相继，取附丽与光明之义。《大象》以继明照四方说明光明的延续，可从依托条件与传递认识理解。",
    "keywords": [
      "光明",
      "依附",
      "持续照明"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/離"
  },
  {
    "number": 31,
    "name": "咸",
    "traditionalName": "咸",
    "pinyin": "xián",
    "lower": "艮",
    "upper": "兑",
    "title": "泽山咸",
    "judgment": "咸：亨。利貞。取女吉。",
    "imageText": "象曰：山上有澤，咸；君子以虛受人。",
    "summary": "下艮上兑，山上有泽，取感应之义。《卦辞》保留古代婚姻语境，《大象》则提出虚心受人，强调相互回应与接纳。",
    "keywords": [
      "相互",
      "感应",
      "虚心接纳"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/咸"
  },
  {
    "number": 32,
    "name": "恒",
    "traditionalName": "恆",
    "pinyin": "héng",
    "lower": "巽",
    "upper": "震",
    "title": "雷风恒",
    "judgment": "恆：亨，无咎。利貞，利有攸往。",
    "imageText": "象曰：雷風，恆；君子以立不易方。",
    "summary": "下巽上震，雷风相与，取恒久之义。《大象》着重“立不易方”，可从持续行动中的原则和方向理解，并非机械不变。",
    "keywords": [
      "恒久",
      "有常",
      "保持方向"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/恒"
  },
  {
    "number": 33,
    "name": "遁",
    "traditionalName": "遯",
    "pinyin": "dùn",
    "lower": "艮",
    "upper": "乾",
    "title": "天山遁",
    "judgment": "遯：亨。小利貞。",
    "imageText": "象曰：天下有山，遯；君子以遠小人，不惡而嚴。",
    "summary": "下艮上乾，天下有山，取退避之义，传统卦名作“遯”。《大象》强调保持距离而不流于怨恶，可从适时退让与边界理解。",
    "keywords": [
      "退避",
      "有度",
      "保持边界"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/遯"
  },
  {
    "number": 34,
    "name": "大壮",
    "traditionalName": "大壯",
    "pinyin": "dà zhuàng",
    "lower": "乾",
    "upper": "震",
    "title": "雷天大壮",
    "judgment": "大壯：利貞。",
    "imageText": "象曰：雷在天上，大壯；君子以非禮弗履。",
    "summary": "下乾上震，雷在天上，取强壮盛大之义。《大象》以“非礼弗履”限制力量的使用，说明强盛也需要准则。",
    "keywords": [
      "强盛",
      "有节",
      "约束行动"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/大壯"
  },
  {
    "number": 35,
    "name": "晋",
    "traditionalName": "晉",
    "pinyin": "jìn",
    "lower": "坤",
    "upper": "离",
    "title": "火地晋",
    "judgment": "晉：康侯用錫馬蕃庶，晝日三接。",
    "imageText": "象曰：明出地上，晉；君子以自昭明德。",
    "summary": "下坤上离，光明从地上升起，取晋进之义。卦辞保留受赐与朝见的古代场景，《大象》将重点落在自我修明。",
    "keywords": [
      "进展",
      "显明",
      "修明德行"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/晉"
  },
  {
    "number": 36,
    "name": "明夷",
    "traditionalName": "明夷",
    "pinyin": "míng yí",
    "lower": "离",
    "upper": "坤",
    "title": "地火明夷",
    "judgment": "明夷：利艱貞。",
    "imageText": "象曰：明入地中，明夷；君子以蒞眾，用晦而明。",
    "summary": "下离上坤，光明入于地下，取明受损伤之义。《大象》讨论以晦用明，可从受限处境中的审慎表达和内在清明理解。",
    "keywords": [
      "光明",
      "受伤",
      "内明外晦"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/明夷"
  },
  {
    "number": 37,
    "name": "家人",
    "traditionalName": "家人",
    "pinyin": "jiā rén",
    "lower": "离",
    "upper": "巽",
    "title": "风火家人",
    "judgment": "家人：利女貞。",
    "imageText": "象曰：風自火出，家人；君子以言有物，而行有恆。",
    "summary": "下离上巽，风从火出，取家内关系的联系与影响。《卦辞》保留古代家庭角色观念，《大象》则强调说话有内容、行动有恒常。",
    "keywords": [
      "家庭",
      "秩序",
      "言行有实"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/家人"
  },
  {
    "number": 38,
    "name": "睽",
    "traditionalName": "睽",
    "pinyin": "kuí",
    "lower": "兑",
    "upper": "离",
    "title": "火泽睽",
    "judgment": "睽：小事吉。",
    "imageText": "象曰：上火下澤，睽；君子以同而異。",
    "summary": "下兑上离，上火下泽，取相异与分离之义。《大象》以“同而异”说明共同生活中仍存在差别，可从辨别与协调理解。",
    "keywords": [
      "差异",
      "相对",
      "求同存异"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/睽"
  },
  {
    "number": 39,
    "name": "蹇",
    "traditionalName": "蹇",
    "pinyin": "jiǎn",
    "lower": "艮",
    "upper": "坎",
    "title": "水山蹇",
    "judgment": "蹇：利西南，不利東北；利見大人，貞吉。",
    "imageText": "象曰：山上有水，蹇；君子以反身修德。",
    "summary": "下艮上坎，山上有水，取行进艰难之义。《大象》把面对阻碍转为反身修德的要求，关注处境与自身准备的关系。",
    "keywords": [
      "前路",
      "受阻",
      "反身修德"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/蹇"
  },
  {
    "number": 40,
    "name": "解",
    "traditionalName": "解",
    "pinyin": "jiě",
    "lower": "坎",
    "upper": "震",
    "title": "雷水解",
    "judgment": "解：利西南，无所往，其來復吉。有攸往，夙吉。",
    "imageText": "象曰：雷雨作，解；君子以赦過宥罪。",
    "summary": "下坎上震，雷雨兴作，取解散、缓解之义。《大象》以赦过宥罪取象，表现紧张解除之后恢复秩序与宽和的方向。",
    "keywords": [
      "松解",
      "困结",
      "宽宥过失"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/解"
  },
  {
    "number": 41,
    "name": "损",
    "traditionalName": "損",
    "pinyin": "sǔn",
    "lower": "兑",
    "upper": "艮",
    "title": "山泽损",
    "judgment": "損：有孚，元吉。无咎，可貞，利有攸往。曷之用？二簋可用享。",
    "imageText": "象曰：山下有澤，損；君子以懲忿窒欲。",
    "summary": "下兑上艮，山下有泽，取损减之义。《卦辞》以简约祭品说明诚意，《大象》则把减损用在忿怒和欲望上。",
    "keywords": [
      "减省",
      "有度",
      "克制欲望"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/損"
  },
  {
    "number": 42,
    "name": "益",
    "traditionalName": "益",
    "pinyin": "yì",
    "lower": "震",
    "upper": "巽",
    "title": "风雷益",
    "judgment": "益：利有攸往。利涉大川。",
    "imageText": "象曰：風雷，益；君子以見善則遷，有過則改。",
    "summary": "下震上巽，风雷相激，取增益之义。《大象》用见善即迁、有过即改解释增益，使增长与学习、修正联系起来。",
    "keywords": [
      "增益",
      "成全",
      "迁善改过"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/益"
  },
  {
    "number": 43,
    "name": "夬",
    "traditionalName": "夬",
    "pinyin": "guài",
    "lower": "乾",
    "upper": "兑",
    "title": "泽天夬",
    "judgment": "夬：揚于王庭，孚號，有厲，告自邑，不利即戎，利有攸往。",
    "imageText": "象曰：澤上于天，夬；君子以施祿及下，居德則忌。",
    "summary": "下乾上兑，泽在天上，取决除阻滞之义。《卦辞》强调公开告示并警惕动武，《大象》将施予与戒惧相联系。",
    "keywords": [
      "决断",
      "公开",
      "施予戒备"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/夬"
  },
  {
    "number": 44,
    "name": "姤",
    "traditionalName": "姤",
    "pinyin": "gòu",
    "lower": "巽",
    "upper": "乾",
    "title": "天风姤",
    "judgment": "姤：女壯，勿用取女。",
    "imageText": "象曰：天下有風，姤；后以施命誥四方。",
    "summary": "下巽上乾，风行天下，取不期而遇之义。《卦辞》保留古代性别与婚姻表述，《大象》由风的传播联系到向四方传达命令。",
    "keywords": [
      "相遇",
      "应对",
      "传播命令"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/姤"
  },
  {
    "number": 45,
    "name": "萃",
    "traditionalName": "萃",
    "pinyin": "cuì",
    "lower": "坤",
    "upper": "兑",
    "title": "泽地萃",
    "judgment": "萃：王假有廟，利見大人，亨。利貞。用大牲吉，利有攸往。",
    "imageText": "象曰：澤上于地，萃；君子以除戎器，戒不虞。",
    "summary": "下坤上兑，泽水聚在地上，取汇聚之义。《卦辞》涉及宗庙与祭祀，《大象》提醒聚众之后也须整备以防意外。",
    "keywords": [
      "聚集",
      "协作",
      "防备意外"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/萃"
  },
  {
    "number": 46,
    "name": "升",
    "traditionalName": "升",
    "pinyin": "shēng",
    "lower": "巽",
    "upper": "坤",
    "title": "地风升",
    "judgment": "升：元亨，用見大人，勿恤，南征吉。",
    "imageText": "象曰：地中生木，升；君子以順德，積小以高大。",
    "summary": "下巽上坤，木在地中生长，取渐次升进之义。《大象》明确提出“积小以高大”，强调细小积累与长期发展的联系。",
    "keywords": [
      "循序",
      "上升",
      "积小成大"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/升"
  },
  {
    "number": 47,
    "name": "困",
    "traditionalName": "困",
    "pinyin": "kùn",
    "lower": "坎",
    "upper": "兑",
    "title": "泽水困",
    "judgment": "困：亨，貞大人吉，无咎，有言不信。",
    "imageText": "象曰：澤无水，困；君子以致命遂志。",
    "summary": "下坎上兑，泽中无水，取资源匮乏与受困之义。《卦辞》提到有言不信，《大象》强调守志，可从困难中的一致行动理解。",
    "keywords": [
      "困境",
      "自持",
      "言行相验"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/困"
  },
  {
    "number": 48,
    "name": "井",
    "traditionalName": "井",
    "pinyin": "jǐng",
    "lower": "巽",
    "upper": "坎",
    "title": "水风井",
    "judgment": "井：改邑不改井，无喪无得，往來井井。汔至亦未繘井。羸其瓶，凶。",
    "imageText": "象曰：木上有水，井；君子以勞民勸相。",
    "summary": "下巽上坎，木上有水，借井取供养之义。卦辞以迁邑不改井和汲水失误取象，可从稳定公共资源与维护完成度理解。",
    "keywords": [
      "公共",
      "供养",
      "维护到底"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/井"
  },
  {
    "number": 49,
    "name": "革",
    "traditionalName": "革",
    "pinyin": "gé",
    "lower": "离",
    "upper": "兑",
    "title": "泽火革",
    "judgment": "革：已日乃孚，元亨。利貞。悔亡。",
    "imageText": "象曰：澤中有火，革；君子以治歷明時。",
    "summary": "下离上兑，泽中有火，取变革之义。《大象》以治理历法、辨明时序为例，强调变化与时机、秩序的联系。",
    "keywords": [
      "变革",
      "合时",
      "历法明时"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/革"
  },
  {
    "number": 50,
    "name": "鼎",
    "traditionalName": "鼎",
    "pinyin": "dǐng",
    "lower": "巽",
    "upper": "离",
    "title": "火风鼎",
    "judgment": "鼎：元吉，亨。",
    "imageText": "象曰：木上有火，鼎；君子以正位凝命。",
    "summary": "下巽上离，木上有火，以烹饪器物“鼎”取象。《大象》着重正位凝命，可从承载新内容以及各安其位理解。",
    "keywords": [
      "更新",
      "承载",
      "端正位置"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/鼎"
  },
  {
    "number": 51,
    "name": "震",
    "traditionalName": "震",
    "pinyin": "zhèn",
    "lower": "震",
    "upper": "震",
    "title": "震为雷",
    "judgment": "震：亨。震來虩虩，笑言啞啞。震驚百里，不喪匕鬯。",
    "imageText": "象曰：洊雷，震；君子以恐懼修省。",
    "summary": "上下皆震，雷声接续而至，取震动与惊惧之义。《卦辞》以震惊中不失祭器取象，《大象》把警醒转向修省。",
    "keywords": [
      "震动",
      "警醒",
      "修身反省"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/震"
  },
  {
    "number": 52,
    "name": "艮",
    "traditionalName": "艮",
    "pinyin": "gèn",
    "lower": "艮",
    "upper": "艮",
    "title": "艮为山",
    "judgment": "艮：艮其背，不獲其身，行其庭，不見其人，无咎。",
    "imageText": "象曰：兼山，艮；君子以思不出其位。",
    "summary": "上下皆艮，两山相连，取止之义。《大象》以思不出其位说明分际，可从停止、专注和恰当边界理解。",
    "keywords": [
      "适时",
      "停止",
      "安守分际"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/艮"
  },
  {
    "number": 53,
    "name": "渐",
    "traditionalName": "漸",
    "pinyin": "jiàn",
    "lower": "艮",
    "upper": "巽",
    "title": "风山渐",
    "judgment": "漸：女歸吉，利貞。",
    "imageText": "象曰：山上有木，漸；君子以居賢德，善俗。",
    "summary": "下艮上巽，山上有木，取渐次成长之义。《卦辞》借古代婚嫁取象，《大象》则强调安居贤德与改善风俗。",
    "keywords": [
      "渐进",
      "有序",
      "涵养风俗"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/漸"
  },
  {
    "number": 54,
    "name": "归妹",
    "traditionalName": "歸妹",
    "pinyin": "guī mèi",
    "lower": "兑",
    "upper": "震",
    "title": "雷泽归妹",
    "judgment": "歸妹：征凶，无攸利。",
    "imageText": "象曰：澤上有雷，歸妹；君子以永終知敝。",
    "summary": "下兑上震，雷在泽上，卦名保留古代女子出嫁语境。《大象》强调从长远结局审察弊端，适合从关系与时序来读。",
    "keywords": [
      "婚嫁",
      "秩序",
      "审察终始"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/歸妹"
  },
  {
    "number": 55,
    "name": "丰",
    "traditionalName": "豐",
    "pinyin": "fēng",
    "lower": "离",
    "upper": "震",
    "title": "雷火丰",
    "judgment": "豐：亨。王假之，勿憂，宜日中。",
    "imageText": "象曰：雷電皆至，豐；君子以折獄致刑。",
    "summary": "下离上震，雷电同时到来，取盛大丰明之义。《卦辞》以日中取象，《大象》涉及刑狱，表现盛明时的审断责任。",
    "keywords": [
      "丰盛",
      "光明",
      "审断有据"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/豐"
  },
  {
    "number": 56,
    "name": "旅",
    "traditionalName": "旅",
    "pinyin": "lǚ",
    "lower": "艮",
    "upper": "离",
    "title": "火山旅",
    "judgment": "旅：小亨，旅貞吉。",
    "imageText": "象曰：山上有火，旅；君子以明慎用刑，而不留獄。",
    "summary": "下艮上离，山上有火，取旅居与暂时停留之义。《大象》强调明慎用刑、不拖延狱事，可从陌生处境中的分寸和慎重理解。",
    "keywords": [
      "行旅",
      "客居",
      "谨慎处事"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/旅"
  },
  {
    "number": 57,
    "name": "巽",
    "traditionalName": "巽",
    "pinyin": "xùn",
    "lower": "巽",
    "upper": "巽",
    "title": "巽为风",
    "judgment": "巽：小亨。利有攸往。利見大人。",
    "imageText": "象曰：隨風，巽；君子以申命行事。",
    "summary": "上下皆巽，风相继而行，取入与顺之义。《大象》以申明命令、执行事务取象，关注反复传达与实际落实。",
    "keywords": [
      "渐入",
      "传达",
      "反复落实"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/巽"
  },
  {
    "number": 58,
    "name": "兑",
    "traditionalName": "兌",
    "pinyin": "duì",
    "lower": "兑",
    "upper": "兑",
    "title": "兑为泽",
    "judgment": "兌：亨。利貞。",
    "imageText": "象曰：麗澤，兌；君子以朋友講習。",
    "summary": "上下皆兑，两泽相连，取和悦之义。《大象》以朋友共同讲习说明悦的文化含义，强调交流、学习与彼此启发。",
    "keywords": [
      "和悦",
      "交流",
      "朋友讲习"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/兌"
  },
  {
    "number": 59,
    "name": "涣",
    "traditionalName": "渙",
    "pinyin": "huàn",
    "lower": "坎",
    "upper": "巽",
    "title": "风水涣",
    "judgment": "渙：亨，王假有廟，利涉大川，利貞。",
    "imageText": "象曰：風行水上，渙；先王以享于帝立廟。",
    "summary": "下坎上巽，风行水上，取散与疏解之义。《卦辞》和《大象》又以宗庙祭祀取象，表现分散与凝聚之间的关系。",
    "keywords": [
      "涣散",
      "疏通",
      "重新联结"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/渙"
  },
  {
    "number": 60,
    "name": "节",
    "traditionalName": "節",
    "pinyin": "jié",
    "lower": "兑",
    "upper": "坎",
    "title": "水泽节",
    "judgment": "節：亨。苦節不可貞。",
    "imageText": "象曰：澤上有水，節；君子以制數度，議德行。",
    "summary": "下兑上坎，泽上有水，以容量和限度取象。《卦辞》指出苦节不可持久，《大象》联系数度与德行，强调适当的节制。",
    "keywords": [
      "节度",
      "分寸",
      "制度尺度"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/節"
  },
  {
    "number": 61,
    "name": "中孚",
    "traditionalName": "中孚",
    "pinyin": "zhōng fú",
    "lower": "兑",
    "upper": "巽",
    "title": "风泽中孚",
    "judgment": "中孚：豚魚吉，利涉大川，利貞。",
    "imageText": "象曰：澤上有風，中孚；君子以議獄緩死。",
    "summary": "下兑上巽，泽上有风，取内在诚实与相互信任之义。《大象》以议狱缓死取象，说明在关乎他人的判断上保持审慎。",
    "keywords": [
      "内在",
      "诚信",
      "审慎宽缓"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/中孚"
  },
  {
    "number": 62,
    "name": "小过",
    "traditionalName": "小過",
    "pinyin": "xiǎo guò",
    "lower": "艮",
    "upper": "震",
    "title": "雷山小过",
    "judgment": "小過：亨。利貞。可小事，不可大事。飛鳥遺之音，不宜上宜下，大吉。",
    "imageText": "象曰：山上有雷，小過；君子以行過乎恭，喪過乎哀，用過乎儉。",
    "summary": "下艮上震，雷在山上，取小有过越之义。《卦辞》分辨大小事务，《大象》以恭、哀、俭的加厚说明细节中的审慎。",
    "keywords": [
      "小事",
      "审慎",
      "谦下有节"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/小過"
  },
  {
    "number": 63,
    "name": "既济",
    "traditionalName": "既濟",
    "pinyin": "jì jì",
    "lower": "离",
    "upper": "坎",
    "title": "水火既济",
    "judgment": "既濟：亨小。利貞。初吉終亂。",
    "imageText": "象曰：水在火上，既濟；君子以思患而豫防之。",
    "summary": "下离上坎，水在火上，取事情已经渡成之义。卦辞仍提到终乱，《大象》强调预想隐患，说明完成之后仍需维护。",
    "keywords": [
      "已成",
      "防患",
      "维持秩序"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/既濟"
  },
  {
    "number": 64,
    "name": "未济",
    "traditionalName": "未濟",
    "pinyin": "wèi jì",
    "lower": "坎",
    "upper": "离",
    "title": "火水未济",
    "judgment": "未濟：亨。小狐汔濟，濡其尾，无攸利。",
    "imageText": "象曰：火在水上，未濟；君子以慎辨物居方。",
    "summary": "下坎上离，与既济的上下结构相反，取尚未渡成之义。《卦辞》以小狐将渡而濡尾取象，《大象》强调分辨事物、安置位置。",
    "keywords": [
      "未成",
      "待续",
      "辨物定位"
    ],
    "sourceUrl": "https://zh.wikisource.org/wiki/周易/未濟"
  }
];
