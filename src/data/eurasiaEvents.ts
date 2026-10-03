/**
 * 欧亚对照视图数据：中国 ↔ 欧美（西方）大事年表（真比例双轨）。
 *
 * 设计意图：西方除罗马外几乎不存在长期统一政权，故不做"朝代对比"而做"大事对比"；
 * 中国轨以朝代色带铺底，事件落在哪个朝代由位置直接呈现；西方轨的"整合期"色带
 * （亚历山大 / 罗马 / 东罗马 / 查理曼 / 美国 / 欧盟）大面积留白即是论点本身。
 * 美国视为欧洲文明的延伸（用户拍板），计入西方轨。
 *
 * 年份核对来源：中文维基百科。147 个事件已于 2026-10 全量比对维基条目并修正
 * （详见 docs/data-audit.md），其余口径差异（约/前后、分期争议）在报告中逐条注明。
 */

export type Side = 'asia' | 'europe'

export interface TimelineEvent {
  id: string
  side: Side
  name: string
  /** 事件年份（负数=公元前） */
  startYear: number
  /** 跨代进程的结束年份；缺省为单点事件 */
  endYear?: number
  /** 一句话说明（提示卡内展示） */
  desc: string
  /** 对照彩蛋 / 深一层的历史注释（可选） */
  note?: string
}

/** 西方轨的"整合期"色带：西方仅有的几段接近统一/主导的时期 */
export interface EuropeBand {
  id: string
  name: string
  startYear: number
  endYear: number
  color: string
  desc: string
}

/** 跨双轨的"同世代对照"列 */
export interface EraMark {
  id: string
  year: number
  /** 列的半宽（年），默认 80 */
  halfWidth?: number
  label: string
  desc: string
}

export const asiaEvents: TimelineEvent[] = [
  { id: 'erlitou', side: 'asia', name: '二里头文化', startYear: -1800, endYear: -1521, desc: '洛阳盆地的宫殿群与青铜礼器，主流视为夏都斟鄩候选，末期或已入商。', note: '与克里特米诺斯文明大体同期——青铜宫室文明在欧亚两端几乎同时点亮。' },
  { id: 'oracle-bone', side: 'asia', name: '甲骨文', startYear: -1250, desc: '商王占卜的刻辞，迄今最早的成熟汉字体系，中国信史的开端。' },
  { id: 'zhou-fengjian', side: 'asia', name: '西周封建', startYear: -1046, desc: '武王克商、周公制礼，以分封与宗法搭建"天下"秩序。' },
  { id: 'gonghe', side: 'asia', name: '共和行政', startYear: -841, endYear: -828, desc: '国人暴动逐厉王，周召共和——中国历史自此有逐年可考的确切纪年。', note: '前 841 年是中外史学界公认的中国确切纪年起点，比罗马建城还早 88 年。' },
  { id: 'confucius', side: 'asia', name: '孔子', startYear: -551, endYear: -479, desc: '儒家的创立者，中国思想的元典时代由此展开。', note: '与佛陀、苏格拉底基本同时——人类文明的"轴心时代"。' },
  { id: 'baijia', side: 'asia', name: '百家争鸣', startYear: -500, endYear: -221, desc: '儒墨道法名阴阳同台论辩，中国思想的原创时代。' },
  { id: 'shangyang', side: 'asia', name: '商鞅变法', startYear: -356, desc: '耕战立国、编户齐民，为秦的统一机器装上发动机。' },
  { id: 'dujiangyan', side: 'asia', name: '都江堰', startYear: -256, desc: '李冰建无坝引水工程，灌溉成都平原两千余年，至今在用。' },
  { id: 'fenshu', side: 'asia', name: '焚书坑儒', startYear: -213, desc: '秦始皇焚天下诗书，思想统一的暴力开篇。' },
  { id: 'daze', side: 'asia', name: '大泽乡起义', startYear: -209, desc: '陈胜吴广"王侯将相宁有种乎"，中国第一次大规模农民起义。' },
  { id: 'qin-unify', side: 'asia', name: '秦统一六国', startYear: -221, desc: '书同文、车同轨，中国进入帝制大一统，此后两千年反复重建。', note: '几乎与罗马打赢布匿战争、称霸地中海同时。' },
  { id: 'wenjing', side: 'asia', name: '文景之治', startYear: -180, endYear: -141, desc: '轻徭薄赋、与民休息，为汉武帝的出击攒下家底。' },
  { id: 'silk-road', side: 'asia', name: '张骞凿空西域', startYear: -126, desc: '丝绸之路开通，长安与罗马之间第一次有了商路相连。' },
  { id: 'ruchan', side: 'asia', name: '独尊儒术', startYear: -134, desc: '董仲舒对策，儒学由百家之一升为官方意识形态，此后两千年不坠。' },
  { id: 'shiji', side: 'asia', name: '司马迁著《史记》', startYear: -91, desc: '忍辱而成的"究天人之际"，中国正史传统两千年的模板。' },
  { id: 'paper', side: 'asia', name: '蔡伦造纸', startYear: 105, desc: '廉价书写载体问世，知识传播成本骤降。', note: '约四百年后造纸术经阿拉伯传入欧洲。' },
  { id: 'buddhism-in', side: 'asia', name: '佛教传入', startYear: 67, desc: '白马寺建于洛阳，外来信仰开始融入中国。' },
  { id: 'zhangheng', side: 'asia', name: '张衡地动仪', startYear: 132, desc: '世界第一台测报地震方位的仪器，汉代科学的孤峰。' },
  { id: 'yellowturban', side: 'asia', name: '黄巾起义', startYear: 184, desc: '"苍天已死"，动摇汉室根基，群雄割据开场。' },
  { id: 'chibi', side: 'asia', name: '赤壁之战', startYear: 208, desc: '孙刘联军火烧曹军，三分天下的格局成型。' },
  { id: 'yongjia', side: 'asia', name: '衣冠南渡', startYear: 311, desc: '匈奴破洛阳俘晋帝，中原士族大规模南迁，江南开发提速。' },
  { id: 'feishui', side: 'asia', name: '淝水之战', startYear: 383, desc: '东晋以八万北府兵大破前秦，华夏文明在南北朝大乱世中保住火种。' },
  { id: 'xiaowen', side: 'asia', name: '北魏孝文帝改革', startYear: 471, endYear: 499, desc: '鲜卑王朝迁都洛阳、改汉姓、通婚姻，主动汉化的顶层设计。' },
  { id: 'keju', side: 'asia', name: '科举制创立', startYear: 605, desc: '隋炀帝设进士科，以考试取士取代门第，文官选拔的制度革命。', note: '此后一千三百年，东亚进入考试选官时代——至 1905 年方止。' },
  { id: 'canal', side: 'asia', name: '京杭大运河', startYear: 605, endYear: 610, desc: '贯通南北的经济大动脉，把分裂近四百年的人口与物资源源整合。' },
  { id: 'xuanzang', side: 'asia', name: '玄奘西行', startYear: 629, endYear: 645, desc: '取经天竺、著《大唐西域记》，欧亚大陆东段的信仰与知识大交换。' },
  { id: 'zhenguan', side: 'asia', name: '贞观之治', startYear: 627, endYear: 649, desc: '唐太宗纳谏轻刑，长安成为当时世界的中心。' },
  { id: 'wuzetian', side: 'asia', name: '武则天称帝', startYear: 690, desc: '中国唯一正统女皇，改国号为周，科举取士进一步扩大。' },
  { id: 'talas', side: 'asia', name: '怛罗斯之战', startYear: 751, desc: '唐军与阿拔斯大军在中亚相遇，高仙芝败绩。', note: '造纸术由此西传撒马尔罕——一场败仗意外改写了欧洲的知识史。' },
  { id: 'anlushi', side: 'asia', name: '安史之乱', startYear: 755, endYear: 763, desc: '盛唐由盛转衰，经济重心加速南移。' },
  { id: 'gunpowder-war', side: 'asia', name: '火药用于战争', startYear: 904, desc: '唐末"飞火"见载，火药从炼丹炉走向战场。' },
  { id: 'jiaozi', side: 'asia', name: '交子', startYear: 1024, desc: '北宋设益州交子务、官交子发行，世界最早的政府纸币。', note: '早于欧洲纸币六百余年；同期欧洲仍在用银马克结算。' },
  { id: 'movable-type', side: 'asia', name: '毕昇活字印刷', startYear: 1045, desc: '世界最早的活字印刷术。', note: '比古登堡早约四百年——但此后它在欧洲引爆的变革远大于中国。' },
  { id: 'wanganshi', side: 'asia', name: '王安石变法', startYear: 1069, endYear: 1085, desc: '青苗、募役、农田水利，一场超前于时代的国家理财实验。' },
  { id: 'jingkang', side: 'asia', name: '靖康之变', startYear: 1127, desc: '金破汴京掳二帝，北宋亡，宋室南渡。' },
  { id: 'zhuxi', side: 'asia', name: '朱熹·理学', startYear: 1130, endYear: 1200, desc: '《四书集注》重构儒学，此后六百年东亚的官方哲学。' },
  { id: 'genghis', side: 'asia', name: '成吉思汗建国', startYear: 1206, desc: '斡难河源建国，草原第一次凝聚为一根鞭子。' },
  { id: 'mongol-west', side: 'asia', name: '蒙古西征', startYear: 1219, endYear: 1260, desc: '蒙古铁骑一路西进至多瑙河畔，欧亚大陆被一次性打通。', note: '火药、印刷、罗盘随商路与征服西传，深刻改写欧洲。' },
  { id: 'marco-polo', side: 'asia', name: '马可·波罗抵华', startYear: 1275, desc: '威尼斯人入仕元廷，《行纪》把中国写成黄金世界。', note: '这份夸张的东方想象，数百年后成了大航海的燃料。' },
  { id: 'zhenghe', side: 'asia', name: '郑和下西洋', startYear: 1405, endYear: 1433, desc: '宝船七下西洋，最远抵达东非。', note: '早于哥伦布近九十年，规模远超，但此后中国转身内敛。' },
  { id: 'ricci', side: 'asia', name: '利玛窦来华', startYear: 1583, desc: '东西方第一次系统性知识对话：欧氏几何、世界地图进入中国。' },
  { id: 'kangqian', side: 'asia', name: '康乾盛世', startYear: 1684, endYear: 1796, desc: '人口从一亿冲向三亿，传统盛世的极限。', note: '也正是在这百余年间英国跨过工业革命的门槛——盛世与"大分流"同框。' },
  { id: 'macartney', side: 'asia', name: '马戛尔尼使华', startYear: 1793, desc: '英国使团觐见乾隆，通商请求被"天朝物产丰盈"驳回。', note: '47 年后，鸦片战争的炮舰替商船敲开了同一扇门。' },
  { id: 'humen', side: 'asia', name: '虎门销烟', startYear: 1839, desc: '林则徐海滩销烟两万余箱，鸦片战争的直接导火索。' },
  { id: 'opium-war', side: 'asia', name: '鸦片战争', startYear: 1840, endYear: 1842, desc: '工业文明撞开农业帝国的大门，中国进入百年屈辱与自救。' },
  { id: 'taiping', side: 'asia', name: '太平天国', startYear: 1851, endYear: 1864, desc: '十四年战乱夺走数千万生命，清廷的统治根基被掏空。' },
  { id: 'yangwu', side: 'asia', name: '洋务运动', startYear: 1861, endYear: 1895, desc: '"师夷长技以自强"，江南制造局与北洋水师的近代化尝试。' },
  { id: 'meiji', side: 'asia', name: '明治维新', startYear: 1868, desc: '日本废藩置县、殖产兴业，东亚第一个完成工业转轨的国家。', note: '与洋务运动几乎同时起步，甲午一战检验了两份答卷。' },
  { id: 'jiawu', side: 'asia', name: '甲午战争', startYear: 1894, endYear: 1895, desc: '北洋水师全军覆没，洋务三十年成色见分晓，台湾割让。' },
  { id: 'wuxu', side: 'asia', name: '戊戌变法', startYear: 1898, desc: '百日维新，六君子菜市口就义，君主立宪在中国流产。' },
  { id: 'keju-abolish', side: 'asia', name: '废科举', startYear: 1905, desc: '清廷诏停科举，一千三百年考试帝国谢幕。', note: '与创立之年恰隔一千三百年——整个东亚的选官体系同时退役。' },
  { id: 'xinhai', side: 'asia', name: '辛亥革命', startYear: 1911, desc: '两千年帝制终结，亚洲第一个共和国诞生。' },
  { id: 'roc', side: 'asia', name: '民国成立', startYear: 1912, desc: '清帝退位，亚洲第一个共和国立国。' },
  { id: 'may-fourth', side: 'asia', name: '五四运动', startYear: 1919, desc: '"德先生与赛先生"登场，新文化再造中国。' },
  { id: 'ccp', side: 'asia', name: '中共成立', startYear: 1921, desc: '上海石库门与南湖红船，二十八年后的执政党由此起步。' },
  { id: 'longmarch', side: 'asia', name: '红军长征', startYear: 1934, endYear: 1936, desc: '二万五千里战略转移，革命重心移向西北。' },
  { id: 'war-of-resistance', side: 'asia', name: '抗日战争', startYear: 1937, endYear: 1945, desc: '全面抗战八年浴血，近代以来中国首次赢得完全胜利。' },
  { id: 'prc-founding', side: 'asia', name: '开国大典', startYear: 1949, desc: '中华人民共和国成立，"中国人民从此站起来了"。' },
  { id: 'korea-war', side: 'asia', name: '抗美援朝', startYear: 1950, endYear: 1953, desc: '新中国立国之战，战线稳定在三八线。' },
  { id: 'nuke-1964', side: 'asia', name: '首颗原子弹', startYear: 1964, desc: '罗布泊蘑菇云升起，中国成为第五个核国家。' },
  { id: 'un-1971', side: 'asia', name: '重返联合国', startYear: 1971, desc: '第 26 届联大恢复中华人民共和国合法席位。' },
  { id: 'gaokao-1977', side: 'asia', name: '恢复高考', startYear: 1977, desc: '570 万人同赴考场，中断十一年的上升通道重开。' },
  { id: 'reform', side: 'asia', name: '改革开放', startYear: 1978, desc: '四十年高速工业化，中国重回世界经济体量前列。' },
  { id: 'shenzhen', side: 'asia', name: '深圳特区', startYear: 1980, desc: '一个边陲小镇的试验，此后四十年"深圳速度"。' },
  { id: 'hongkong', side: 'asia', name: '香港回归', startYear: 1997, desc: '米字旗降下，百年殖民史在香港终结。' },
  { id: 'wto', side: 'asia', name: '加入世贸', startYear: 2001, desc: '全面接入全球分工体系，"世界工厂"全速运转。' },
  { id: 'shenzhou5', side: 'asia', name: '神舟五号', startYear: 2003, desc: '杨利伟飞天，中国成为第三个独立载人航天的国家。' },
  { id: 'olympics-2008', side: 'asia', name: '北京奥运', startYear: 2008, desc: '五十一金登顶奖牌榜，百年奥运梦圆。' },
  { id: 'tiangong', side: 'asia', name: '天宫空间站', startYear: 2021, desc: '天和核心舱入轨，中国人开始常驻太空。' },
]

export const europeEvents: TimelineEvent[] = [
  { id: 'minoan', side: 'europe', name: '米诺斯文明', startYear: -2000, endYear: -1450, desc: '迷宫般的克诺索斯宫与线性文字A，欧洲文明第一缕曙光。', note: '与二里头文化大体同期——青铜宫室文明在欧亚两端几乎同时点亮。' },
  { id: 'mycenae', side: 'europe', name: '迈锡尼文明', startYear: -1750, endYear: -1050, desc: '荷马史诗中的黄金时代，与商朝大体同时的希腊青铜文明。', note: '线形文字B失传后，欧洲进入三百年"黑暗时代"。' },
  { id: 'olympics', side: 'europe', name: '古代奥运会', startYear: -776, desc: '希腊城邦时代的纪年原点。' },
  { id: 'rome-founded', side: 'europe', name: '罗马建城', startYear: -753, desc: '传说中罗慕路斯建罗马，此后一千年地中海的主人登场。' },
  { id: 'persia', side: 'europe', name: '波斯帝国', startYear: -550, desc: '第一个横跨欧亚非的大帝国，"万王之王"登场。', note: '与春秋几乎同时：孔子出生前后，波斯正在统合三大洲。' },
  { id: 'athenian-democracy', side: 'europe', name: '雅典民主', startYear: -508, desc: '克利斯提尼改革，公民直接参政的城邦实验。' },
  { id: 'persian-wars', side: 'europe', name: '希波战争', startYear: -490, endYear: -479, desc: '马拉松与萨拉米斯，希腊城邦击败波斯帝国。' },
  { id: 'socrates', side: 'europe', name: '苏格拉底', startYear: -469, endYear: -399, desc: '西方哲学的奠基者，与孔子遥相呼应。', note: '"轴心时代"：中国、印度、希腊几乎同时诞生追问终极问题的思想者。' },
  { id: 'twelve-tables', side: 'europe', name: '十二铜表法', startYear: -451, desc: '罗马成文法之始，"法律面前"理念的最早物证。' },
  { id: 'peloponnesian', side: 'europe', name: '伯罗奔尼撒战争', startYear: -431, endYear: -404, desc: '雅典与斯巴达的二十年互耗，修昔底德记下两强相争的标本。' },
  { id: 'aristotle', side: 'europe', name: '亚里士多德', startYear: -384, endYear: -322, desc: '百科全书式的哲人，亚历山大的老师，中世纪欧洲称他"那位哲人"。' },
  { id: 'alexander', side: 'europe', name: '亚历山大东征', startYear: -334, endYear: -323, desc: '十年从希腊打到印度河，希腊化世界横跨欧亚。', note: '东征止步印度，距战国诸侯只有一步之遥，东西两大文明圈擦肩而过。' },
  { id: 'archimedes', side: 'europe', name: '阿基米德', startYear: -287, endYear: -212, desc: '浮力定律与杠杆原理，古典科学的最高点，殁于罗马士兵剑下。' },
  { id: 'punic', side: 'europe', name: '布匿战争', startYear: -264, endYear: -146, desc: '罗马消灭迦太基，称霸西地中海。' },
  { id: 'spartacus', side: 'europe', name: '斯巴达克起义', startYear: -73, endYear: -71, desc: '万名角斗士撼动罗马，奴隶制的裂缝首次显形。' },
  { id: 'caesar-death', side: 'europe', name: '凯撒遇刺', startYear: -44, desc: '"布鲁图，你也有份？"——共和国终结前的最后一搏。' },
  { id: 'roman-empire', side: 'europe', name: '罗马帝国建立', startYear: -27, desc: '屋大维称奥古斯都，欧洲唯一一次长期大一统的开端。', note: '时值西汉：汉与罗马东西并立，由丝绸之路遥遥相连。' },
  { id: 'five-emperors', side: 'europe', name: '五贤帝时代', startYear: 96, endYear: 180, desc: '罗马疆域与繁荣的顶峰，与东汉盛世同频。' },
  { id: 'trajan', side: 'europe', name: '图拉真极盛', startYear: 117, desc: '罗马版图达到极限，地中海全境尽入彀中。', note: '时值东汉：汉与罗马在各自最盛处隔空相望。' },
  { id: 'milan-edict', side: 'europe', name: '米兰敕令', startYear: 313, desc: '基督教在罗马合法化，欧洲的精神底色开始转轨。' },
  { id: 'rome-split', side: 'europe', name: '罗马东西分裂', startYear: 395, desc: '帝国一分为二，西欧从此走上碎片化道路。' },
  { id: 'rome-falls', side: 'europe', name: '西罗马灭亡', startYear: 476, desc: '欧洲最大的一次政治解体，此后一千四百年再无统一。', note: '时值中国南北朝：同样的大崩溃，中国走向再统一，欧洲走向永久分裂——分岔点即在此。' },
  { id: 'justinian', side: 'europe', name: '查士丁尼法典', startYear: 529, endYear: 534, desc: '《民法大全》汇编千年罗马法，今日欧陆法系的源头活水。' },
  { id: 'arab-rise', side: 'europe', name: '阿拉伯帝国', startYear: 632, endYear: 1258, desc: '从四大哈里发到阿拔斯王朝，一世纪内横跨欧亚非，六百年后亡于蒙古铁骑。', note: '与唐并立为当时世界两极，两个巨型文明圈在中亚正面相遇。' },
  { id: 'viking-age', side: 'europe', name: '维京时代', startYear: 793, endYear: 1066, desc: '林迪斯法恩劫掠开场，诺曼人从斯堪的纳维亚撒向整个欧洲。' },
  { id: 'charlemagne', side: 'europe', name: '查理曼加冕', startYear: 800, desc: '短暂统一西欧的尝试，帝国三分后碎片固化。', note: '时值盛唐：查理曼被称为"欧洲的秦始皇"，但他身后没有汉来接盘。' },
  { id: 'house-of-wisdom', side: 'europe', name: '智慧宫', startYear: 813, endYear: 1258, desc: '巴格达把希腊、波斯、印度典籍译成阿拉伯文，直至毁于蒙古战火。', note: '欧洲坠入黑暗时代时，希腊火种在阿拉伯世界接力——数百年后回流，点燃文艺复兴。' },
  { id: 'great-schism', side: 'europe', name: '东西教会大分裂', startYear: 1054, desc: '罗马与君士坦丁堡互相开除教籍，基督教世界一分为二。' },
  { id: 'first-crusade', side: 'europe', name: '第一次十字军', startYear: 1095, endYear: 1099, desc: '克莱蒙的一声"上帝所愿"，欧洲第一次集体向外远征。', note: '时值北宋：同一颗火花，欧洲点燃圣战，中国正点燃新儒学。' },
  { id: 'magna-carta', side: 'europe', name: '大宪章', startYear: 1215, desc: '王在法下，贵族限制君权的起点。', note: '时值南宋：欧洲在给王权上锁，中国在把皇权推向顶峰。' },
  { id: 'renaissance', side: 'europe', name: '文艺复兴', startYear: 1350, endYear: 1600, desc: '从意大利燃起的人文浪潮，欧洲开始"重新发现人"。' },
  { id: 'black-death', side: 'europe', name: '黑死病', startYear: 1347, endYear: 1351, desc: '夺走欧洲三分之一人口，教会权威动摇，劳工短缺催生变革。', note: '时值元末：瘟疫同样扫荡中国，两端的旧秩序一起松动。' },
  { id: 'gutenberg', side: 'europe', name: '古登堡印刷', startYear: 1450, desc: '印刷机引爆宗教改革与科学革命。', note: '比毕昇晚四百年，但撞上了识字率上升的欧洲，后果完全不同。' },
  { id: 'constantinople', side: 'europe', name: '君士坦丁堡陷落', startYear: 1453, desc: '东罗马千年落幕，希腊学者携典籍西逃意大利。', note: '与古登堡印刷机几乎同时——古典文本、印刷术、商业城市三者相撞，文艺复兴全面引爆。' },
  { id: 'columbus', side: 'europe', name: '哥伦布到美洲', startYear: 1492, desc: '大航海时代的高光时刻，欧洲开始全球扩张。', note: '郑和的大船队停航近六十年后，三艘小帆船改变了世界。' },
  { id: 'da-gama', side: 'europe', name: '达伽马抵印度', startYear: 1498, desc: '绕好望角直航卡利卡特，香料之路改道大西洋。' },
  { id: 'luther', side: 'europe', name: '路德论纲', startYear: 1517, desc: '维滕贝格教堂门上的论纲，宗教改革撕裂西欧。' },
  { id: 'magellan', side: 'europe', name: '麦哲伦环球航行', startYear: 1519, endYear: 1522, desc: '首次证明大地是球形，全球海洋连成一体。' },
  { id: 'tenochtitlan', side: 'europe', name: '特诺奇蒂特兰陷落', startYear: 1521, desc: '科尔特斯数百人倾覆阿兹特克帝国，旧大陆病菌与钢铁踏平新大陆。', note: '哥伦布之后仅二十九年——"发现"的另一面是灭顶。' },
  { id: 'copernicus', side: 'europe', name: '哥白尼日心说', startYear: 1543, desc: '日心说掀起天文学革命，科学世界观启幕。' },
  { id: 'galileo', side: 'europe', name: '伽利略望远镜', startYear: 1609, desc: '望远镜指向星空，木星卫星与月面环形山推翻旧宇宙。' },
  { id: 'thirty-years-war', side: 'europe', name: '三十年战争', startYear: 1618, endYear: 1648, desc: '宗教混战打掉中欧三分之一人口。', note: '《威斯特伐利亚和约》确立主权国家体系——时值明清易代，两种新秩序同时在废墟上生长。' },
  { id: 'glorious-rev', side: 'europe', name: '光荣革命', startYear: 1688, desc: '不流血的政变，议会请荷兰执政入主英伦。', note: '次年《权利法案》落纸，"王在法下"成为制度；几年后牛顿《原理》出版——同一片岛上的两场革命。' },
  { id: 'newton', side: 'europe', name: '牛顿《原理》', startYear: 1687, desc: '经典力学体系建立，时值康熙年间。' },
  { id: 'industrial-rev', side: 'europe', name: '工业革命', startYear: 1760, endYear: 1840, desc: '蒸汽机改写生产力，人类历史陡然加速。', note: '时值乾隆盛世：一边是机器轰鸣，一边是最后的繁华——"大分流"自此定局。' },
  { id: 'declaration', side: 'europe', name: '独立宣言', startYear: 1776, desc: '北美十三州宣告独立，"人人生而平等"写进建国文件。', note: '同年《国富论》出版、瓦特蒸汽机投产——现代世界的政治、经济、技术三件套同岁，美国自此接过欧洲文明的下一棒。' },
  { id: 'french-rev', side: 'europe', name: '法国大革命', startYear: 1789, desc: '自由平等博爱横扫旧制度，民族国家时代来临。', note: '乾隆退位同年，法国砍下了国王的头。' },
  { id: 'napoleonic-wars', side: 'europe', name: '拿破仑战争', startYear: 1803, endYear: 1815, desc: '大革命意识形态的军事总动员，欧洲旧秩序被反复冲刷。' },
  { id: 'stephenson', side: 'europe', name: '蒸汽机车', startYear: 1825, desc: '斯托克顿—达灵顿铁路通车，人类第一次跑赢马。', note: '工业革命铺上钢轨——时值道光五年，它与中国的相遇还要再等十五年。' },
  { id: 'faraday', side: 'europe', name: '电磁感应', startYear: 1831, desc: '磁生电的实验演示，电气时代的物理基础。' },
  { id: 'manifesto', side: 'europe', name: '共产党宣言', startYear: 1848, desc: '"全世界无产者联合起来"，同年革命风暴席卷欧洲。', note: '七十一年后，这份文本的中国回响改变东方。' },
  { id: 'crystal-palace', side: 'europe', name: '水晶宫博览会', startYear: 1851, desc: '伦敦万国工业博览会，钢铁玻璃宫殿里的霸权加冕礼。', note: '同年太平天国攻占永安——两端国运在同一张年表上分道。' },
  { id: 'darwin', side: 'europe', name: '达尔文《物种起源》', startYear: 1859, desc: '进化论动摇创世叙事，第二次鸦片战争同年。' },
  { id: 'us-civil-war', side: 'europe', name: '南北战争', startYear: 1861, endYear: 1865, desc: '工业北对种植园南，废奴与统一的"二次建国"。' },
  { id: 'german-unification', side: 'europe', name: '德意志统一', startYear: 1871, desc: '普法战争后镜厅加冕，欧洲权力格局多极化加速。' },
  { id: 'edison', side: 'europe', name: '爱迪生电灯', startYear: 1879, desc: '持久实用的电灯与供电系统，夜晚被永久改写。' },
  { id: 'wright-flight', side: 'europe', name: '莱特首飞', startYear: 1903, desc: '十二秒三十六米，动力飞行时代开启。' },
  { id: 'einstein', side: 'europe', name: '相对论', startYear: 1905, desc: '专利局小职员的"奇迹年"，时空观念重写。' },
  { id: 'ww1', side: 'europe', name: '第一次世界大战', startYear: 1914, endYear: 1918, desc: '欧洲内耗掉世界中心的地位。' },
  { id: 'versailles', side: 'europe', name: '凡尔赛和会', startYear: 1919, desc: '巴黎和会重划世界，中国代表拒签和约。', note: '消息传回，五四运动爆发——两条轨道在同一个条约上共振。' },
  { id: 'great-depression', side: 'europe', name: '大萧条', startYear: 1929, desc: '华尔街崩盘拖垮全球贸易，自由资本主义陷入至暗时刻。' },
  { id: 'new-deal', side: 'europe', name: '罗斯福新政', startYear: 1933, desc: '国家干预救市，美国式的"计划与市场杂交"。' },
  { id: 'ww2', side: 'europe', name: '第二次世界大战', startYear: 1939, endYear: 1945, desc: '欧亚两洲的总体战，战后世界秩序重建。' },
  { id: 'bretton-woods', side: 'europe', name: '布雷顿森林', startYear: 1944, desc: '四十四国定美元为锚，战后货币体系由美国主导设计。' },
  { id: 'hiroshima', side: 'europe', name: '广岛原子弹', startYear: 1945, desc: '曼哈顿工程的蘑菇云，核时代与"相互毁灭的和平"开启。' },
  { id: 'un-founded', side: 'europe', name: '联合国成立', startYear: 1945, desc: '旧金山制宪，二战废墟上的集体安全尝试。' },
  { id: 'truman-doctrine', side: 'europe', name: '杜鲁门主义', startYear: 1947, desc: '"遏制"宣言，冷战正式开锣。' },
  { id: 'nato', side: 'europe', name: '北约成立', startYear: 1949, desc: '十二国跨大西洋军事同盟，冷战东西两营成型。' },
  { id: 'cuban-missile', side: 'europe', name: '古巴导弹危机', startYear: 1962, desc: '十三天核对峙，人类离毁灭最近的时刻。' },
  { id: 'apollo11', side: 'europe', name: '阿波罗登月', startYear: 1969, desc: '"个人的一小步"——冷战竞赛的最高瞬间。' },
  { id: 'web', side: 'europe', name: '万维网诞生', startYear: 1989, desc: '伯纳斯-李在欧洲核子中心提出 WWW，信息高速公路的发端。', note: '冷战铁幕落下的同一年，另一张看不见的"网"开始包裹全球。' },
  { id: 'berlin-wall', side: 'europe', name: '柏林墙倒塌', startYear: 1989, desc: '一夜推倒的混凝土，冷战欧洲战线冰消。', note: '同年东欧剧变连锁，两年后苏联解体；同一年，中国的改革在另一个方向突围。' },
  { id: 'soviet-collapse', side: 'europe', name: '苏联解体', startYear: 1991, desc: '十五个加盟共和国散场，两极格局落幕。', note: '同年中国改革开放驶入快车道——一收一放，世纪末的对照注脚。' },
  { id: 'eu', side: 'europe', name: '欧盟成立', startYear: 1993, desc: '以条约与市场重新"统一"欧洲的当代实验。', note: '罗马之后一千五百年，欧洲选择了另一种大一统：不带皇帝的那种。' },
  { id: 'sept11', side: 'europe', name: '9·11事件', startYear: 2001, desc: '恐怖袭击改写美国政治议程与全球安全格局。', note: '同年稍晚中国加入 WTO——两件大事共同改写了 21 世纪的走向。' },
  { id: 'iphone', side: 'europe', name: 'iPhone发布', startYear: 2007, desc: '多点触控智能机，移动互联网时代的发令枪。' },
  { id: 'gfc', side: 'europe', name: '金融危机', startYear: 2008, desc: '雷曼倒下，全球同步衰退。', note: '同年北京奥运与"四万亿"登场——大分流以来，东西方第一次如此深度同频。' },
  { id: 'chatgpt', side: 'europe', name: 'ChatGPT发布', startYear: 2022, desc: '大语言模型走入亿万人日常，AI 纪元大众化元年。' },
]

export const europeBands: EuropeBand[] = [
  { id: 'alexander-band', name: '亚历山大帝国', startYear: -336, endYear: -323, color: '#8fa3c9', desc: '十年速成的希腊化帝国，身后即裂解为继业者王国。' },
  { id: 'rome-band', name: '罗马帝国', startYear: -27, endYear: 476, color: '#9d7bb0', desc: '欧洲唯一一次五百年级的大一统，地中海成为内湖。' },
  { id: 'byzantium-band', name: '东罗马', startYear: 395, endYear: 1453, color: '#6d6390', desc: '延续千年的东部残响，1453 年亡于奥斯曼。' },
  { id: 'charlemagne-band', name: '查理曼帝国', startYear: 800, endYear: 843, color: '#b08d57', desc: '西欧三百年一遇的短暂整合，一纸条约三分天下。' },
  { id: 'usa-band', name: '美国', startYear: 1776, endYear: 2050, color: '#5b9cf3', desc: '1776 年建国，两次大战后接棒欧洲，成为西方文明的重心。' },
  { id: 'eu-band', name: '欧盟', startYear: 1993, endYear: 2050, color: '#6fa8dc', desc: '以制度与市场黏合的当代欧洲，开放进行中。' },
]

export const eraMarks: EraMark[] = [
  {
    id: 'axial',
    year: -500,
    halfWidth: 90,
    label: '轴心时代',
    desc: '约前800–前200：孔子、释迦牟尼、苏格拉底几乎同时现身，欧亚各大文明不约而同开始追问"人应该如何生活"。',
  },
  {
    id: 'han-rome',
    year: 100,
    halfWidth: 130,
    label: '汉 · 罗马并立',
    desc: '前202–220 与 前27–476：东西方第一次同时存在百万级人口的巨型帝国，一条丝绸之路将两端遥遥相连。',
  },
  {
    id: 'mongol-era',
    year: 1250,
    halfWidth: 80,
    label: '蒙古时代',
    desc: '13–14 世纪：蒙古帝国一次性打通欧亚，火药、印刷、罗盘西传，佛罗伦萨与泉州被同一条商路串起。',
  },
  {
    id: 'voyage',
    year: 1545,
    halfWidth: 75,
    label: '大航海',
    desc: '约1480–1620：西欧小帆船闯出大洋，贸易、殖民与物种交换把世界连成一张网。',
  },
  {
    id: 'divergence',
    year: 1800,
    halfWidth: 90,
    label: '大分流',
    desc: '约1750–1850：工业革命的英国与康乾盛世的中国在同一个五十年里擦肩而过，东西实力自此易位。',
  },
  {
    id: 'coldwar',
    year: 1969,
    halfWidth: 22,
    label: '冷战',
    desc: '1947–1991：两大阵营的对峙与竞赛，登月与互联网都是它的副产品。',
  },
]
