/**
 * 欧亚对照视图数据：中国 ↔ 欧洲大事年表（真比例双轨）。
 *
 * 设计意图：欧洲除罗马外几乎不存在长期统一政权，故不做"朝代对比"而做"大事对比"；
 * 中国轨以朝代色带铺底，事件落在哪个朝代由位置直接呈现；欧洲轨的"整合期"色带
 * （亚历山大 / 罗马 / 东罗马 / 查理曼 / 欧盟）大面积留白即是论点本身。
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

/** 欧洲轨的"整合期"色带：欧洲仅有的几段接近统一的时期 */
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
  { id: 'oracle-bone', side: 'asia', name: '甲骨文', startYear: -1300, desc: '商王占卜的刻辞，迄今最早的成熟汉字体系，中国信史的开端。' },
  { id: 'zhou-fengjian', side: 'asia', name: '西周封建·制礼作乐', startYear: -1046, desc: '武王克商、周公制礼，以分封与宗法搭建"天下"秩序。' },
  { id: 'confucius', side: 'asia', name: '孔子', startYear: -551, endYear: -479, desc: '儒家的创立者，中国思想的元典时代由此展开。', note: '与佛陀、苏格拉底基本同时——人类文明的"轴心时代"。' },
  { id: 'shangyang', side: 'asia', name: '商鞅变法', startYear: -356, desc: '耕战立国、编户齐民，为秦的统一机器装上发动机。' },
  { id: 'qin-unify', side: 'asia', name: '秦统一六国', startYear: -221, desc: '书同文、车同轨，中国进入帝制大一统，此后两千年反复重建。', note: '几乎与罗马打赢布匿战争、称霸地中海同时。' },
  { id: 'silk-road', side: 'asia', name: '张骞凿空西域', startYear: -126, desc: '丝绸之路开通，长安与罗马之间第一次有了商路相连。' },
  { id: 'paper', side: 'asia', name: '蔡伦造纸', startYear: 105, desc: '廉价书写载体问世，知识传播成本骤降。', note: '约四百年后造纸术经阿拉伯传入欧洲。' },
  { id: 'buddhism-in', side: 'asia', name: '佛教传入', startYear: 67, desc: '白马寺建于洛阳，外来信仰开始融入中国。' },
  { id: 'feishui', side: 'asia', name: '淝水之战', startYear: 383, desc: '东晋以八万北府兵大破前秦，华夏文明在南北朝大乱世中保住火种。' },
  { id: 'canal', side: 'asia', name: '京杭大运河', startYear: 605, endYear: 610, desc: '贯通南北的经济大动脉，把分裂近四百年的人口与物资源源整合。' },
  { id: 'xuanzang', side: 'asia', name: '玄奘西行', startYear: 629, endYear: 645, desc: '取经天竺、著《大唐西域记》，欧亚大陆东段的信仰与知识大交换。' },
  { id: 'anlushi', side: 'asia', name: '安史之乱', startYear: 755, endYear: 763, desc: '盛唐由盛转衰，经济重心加速南移。' },
  { id: 'movable-type', side: 'asia', name: '毕昇活字印刷', startYear: 1044, desc: '世界最早的活字印刷术。', note: '比古登堡早约四百年——但此后它在欧洲引爆的变革远大于中国。' },
  { id: 'mongol-west', side: 'asia', name: '蒙古西征', startYear: 1219, endYear: 1260, desc: '蒙古铁骑一路西进至多瑙河畔，欧亚大陆被一次性打通。', note: '火药、印刷、罗盘随商路与征服西传，深刻改写欧洲。' },
  { id: 'zhenghe', side: 'asia', name: '郑和下西洋', startYear: 1405, endYear: 1433, desc: '宝船七下西洋，最远抵达东非。', note: '早于哥伦布近九十年，规模远超，但此后中国转身内敛。' },
  { id: 'ricci', side: 'asia', name: '利玛窦来华', startYear: 1583, desc: '东西方第一次系统性知识对话：欧氏几何、世界地图进入中国。' },
  { id: 'opium-war', side: 'asia', name: '鸦片战争', startYear: 1840, endYear: 1842, desc: '工业文明撞开农业帝国的大门，中国进入百年屈辱与自救。' },
  { id: 'xinhai', side: 'asia', name: '辛亥革命', startYear: 1911, desc: '两千年帝制终结，亚洲第一个共和国诞生。' },
  { id: 'may-fourth', side: 'asia', name: '五四运动', startYear: 1919, desc: '"德先生与赛先生"登场，新文化再造中国。' },
  { id: 'reform', side: 'asia', name: '改革开放', startYear: 1978, desc: '四十年高速工业化，中国重回世界经济体量前列。' },
  { id: 'wto', side: 'asia', name: '加入世贸组织', startYear: 2001, desc: '全面接入全球分工体系，"世界工厂"全速运转。' },
]

export const europeEvents: TimelineEvent[] = [
  { id: 'mycenae', side: 'europe', name: '迈锡尼文明', startYear: -1600, endYear: -1100, desc: '荷马史诗中的黄金时代，与商朝大体同时的希腊青铜文明。', note: '线形文字B失传后，欧洲进入三百年"黑暗时代"。' },
  { id: 'olympics', side: 'europe', name: '首届古代奥运会', startYear: -776, desc: '希腊城邦时代的纪年原点。' },
  { id: 'rome-founded', side: 'europe', name: '罗马建城', startYear: -753, desc: '传说中罗慕路斯建罗马，此后一千年地中海的主人登场。' },
  { id: 'athenian-democracy', side: 'europe', name: '雅典民主', startYear: -508, desc: '克利斯提尼改革，公民直接参政的城邦实验。' },
  { id: 'persian-wars', side: 'europe', name: '希波战争', startYear: -490, endYear: -479, desc: '马拉松与萨拉米斯，希腊城邦击败波斯帝国。' },
  { id: 'socrates', side: 'europe', name: '苏格拉底', startYear: -469, endYear: -399, desc: '西方哲学的奠基者，与孔子遥相呼应。', note: '"轴心时代"：中国、印度、希腊几乎同时诞生追问终极问题的思想者。' },
  { id: 'alexander', side: 'europe', name: '亚历山大东征', startYear: -334, endYear: -323, desc: '十年从希腊打到印度河，希腊化世界横跨欧亚。', note: '东征止步印度，距战国诸侯只有一步之遥，东西两大文明圈擦肩而过。' },
  { id: 'punic', side: 'europe', name: '布匿战争', startYear: -264, endYear: -146, desc: '罗马消灭迦太基，称霸西地中海。' },
  { id: 'roman-empire', side: 'europe', name: '罗马帝国建立', startYear: -27, desc: '屋大维称奥古斯都，欧洲唯一一次长期大一统的开端。', note: '时值西汉：汉与罗马东西并立，由丝绸之路遥遥相连。' },
  { id: 'five-emperors', side: 'europe', name: '罗马五贤帝时代', startYear: 96, endYear: 180, desc: '罗马疆域与繁荣的顶峰，与东汉盛世同频。' },
  { id: 'milan-edict', side: 'europe', name: '米兰敕令', startYear: 313, desc: '基督教在罗马合法化，欧洲的精神底色开始转轨。' },
  { id: 'rome-split', side: 'europe', name: '罗马帝国东西分裂', startYear: 395, desc: '帝国一分为二，西欧从此走上碎片化道路。' },
  { id: 'rome-falls', side: 'europe', name: '西罗马灭亡', startYear: 476, desc: '欧洲最大的一次政治解体，此后一千四百年再无统一。', note: '时值中国南北朝：同样的大崩溃，中国走向再统一，欧洲走向永久分裂——分岔点即在此。' },
  { id: 'charlemagne', side: 'europe', name: '查理曼加冕', startYear: 800, desc: '短暂统一西欧的尝试，帝国三分后碎片固化。', note: '时值盛唐：查理曼被称为"欧洲的秦始皇"，但他身后没有汉来接盘。' },
  { id: 'magna-carta', side: 'europe', name: '《大宪章》', startYear: 1215, desc: '王在法下，贵族限制君权的起点。', note: '时值南宋：欧洲在给王权上锁，中国在把皇权推向顶峰。' },
  { id: 'renaissance', side: 'europe', name: '文艺复兴', startYear: 1350, endYear: 1600, desc: '从意大利燃起的人文浪潮，欧洲开始"重新发现人"。' },
  { id: 'gutenberg', side: 'europe', name: '古登堡活字印刷', startYear: 1450, desc: '印刷机引爆宗教改革与科学革命。', note: '比毕昇晚四百年，但撞上了识字率上升的欧洲，后果完全不同。' },
  { id: 'columbus', side: 'europe', name: '哥伦布抵达美洲', startYear: 1492, desc: '大航海时代的高光时刻，欧洲开始全球扩张。', note: '郑和的大船队停航近六十年后，三艘小帆船改变了世界。' },
  { id: 'copernicus', side: 'europe', name: '哥白尼《天体运行论》', startYear: 1543, desc: '日心说掀起天文学革命，科学世界观启幕。' },
  { id: 'newton', side: 'europe', name: '牛顿《原理》', startYear: 1687, desc: '经典力学体系建立，时值康熙年间。' },
  { id: 'industrial-rev', side: 'europe', name: '工业革命', startYear: 1760, endYear: 1840, desc: '蒸汽机改写生产力，人类历史陡然加速。', note: '时值乾隆盛世：一边是机器轰鸣，一边是最后的繁华——"大分流"自此定局。' },
  { id: 'french-rev', side: 'europe', name: '法国大革命', startYear: 1789, desc: '自由平等博爱横扫旧制度，民族国家时代来临。', note: '乾隆退位同年，法国砍下了国王的头。' },
  { id: 'darwin', side: 'europe', name: '达尔文《物种起源》', startYear: 1859, desc: '进化论动摇创世叙事，第二次鸦片战争同年。' },
  { id: 'ww1', side: 'europe', name: '第一次世界大战', startYear: 1914, endYear: 1918, desc: '欧洲内耗掉世界中心的地位。' },
  { id: 'ww2', side: 'europe', name: '第二次世界大战', startYear: 1939, endYear: 1945, desc: '欧亚两洲的总体战，战后世界秩序重建。' },
  { id: 'eu', side: 'europe', name: '欧洲联盟成立', startYear: 1993, desc: '以条约与市场重新"统一"欧洲的当代实验。', note: '罗马之后一千五百年，欧洲选择了另一种大一统：不带皇帝的那种。' },
]

export const europeBands: EuropeBand[] = [
  { id: 'alexander-band', name: '亚历山大帝国', startYear: -336, endYear: -323, color: '#8fa3c9', desc: '十年速成的希腊化帝国，身后即裂解为继业者王国。' },
  { id: 'rome-band', name: '罗马帝国', startYear: -27, endYear: 476, color: '#9d7bb0', desc: '欧洲唯一一次五百年级的大一统，地中海成为内湖。' },
  { id: 'byzantium-band', name: '东罗马', startYear: 395, endYear: 1453, color: '#6d6390', desc: '延续千年的东部残响，1453 年亡于奥斯曼。' },
  { id: 'charlemagne-band', name: '查理曼帝国', startYear: 800, endYear: 843, color: '#b08d57', desc: '西欧三百年一遇的短暂整合，一纸条约三分天下。' },
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
    id: 'divergence',
    year: 1800,
    halfWidth: 90,
    label: '大分流',
    desc: '约1750–1850：工业革命的英国与康乾盛世的中国在同一个五十年里擦肩而过，东西实力自此易位。',
  },
]
