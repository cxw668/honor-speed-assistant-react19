import type { HeroItem } from '@/types'

/**
 * 王者荣耀2026 S42赛季 完整英雄信息数据
 * 贴合新手需求，收录了完整英雄，难度星级/新手推荐均为官方标准
 */
export const heroList: HeroItem[] = [
  // ========== 坦克类 ==========
  {
    id: 101,
    heroName: '项羽',
    heroType: '坦克',
    corePosition: '前排承伤、开团留人、团战先锋',
    combatFeature: '血量厚防御极高，自带回血和免伤，技能有击退和眩晕控制，团战中能抗能开团，逆风局也能稳住阵线',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 102,
    heroName: '廉颇',
    heroType: '坦克',
    corePosition: '前排承伤、持续控制、团战神坦',
    combatFeature: '霸体状态免控，技能连招有高额护盾和范围控制，血量越低防御越高，容错率极高，几乎不怕被风筝',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 103,
    heroName: '白起',
    heroType: '坦克',
    corePosition: '吸血续航、群体嘲讽、反手开团',
    combatFeature: '技能命中敌人可回血，大招能远距离嘲讽多名敌人，团战中能强行开团并吸收大量伤害，后期坦度无解',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 104,
    heroName: '夏侯惇',
    heroType: '坦克',
    corePosition: '全能坦边、护盾续航、灵活开团',
    combatFeature: '有位移有护盾有回血，技能连招灵活，可抗可打，既能走对抗路也能走辅助位，适配所有阵容',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 105,
    heroName: '刘禅',
    heroType: '坦克',
    corePosition: '拆塔先锋、群体控制、游走支援',
    combatFeature: '技能对防御塔有额外伤害，自带护盾和眩晕，拆塔速度极快，适合游走配合队友推进，新手容易上手',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 106,
    heroName: '程咬金',
    heroType: '坦克',
    corePosition: '单带牵制、高额回血、不死战神',
    combatFeature: '大招开启后回血速度超快，残血反打能力强，适合单带牵制敌人，几乎不需要回家补血，操作简单',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 107,
    heroName: '牛魔',
    heroType: '坦克',
    corePosition: '团队护盾、开团保人、反手控制',
    combatFeature: '二技能击飞+大招范围眩晕，能给队友提供护盾，团战中既能开团也能保护后排，容错率拉满',
    difficulty: 2,
    isNewbieRecommend: false
  },
  {
    id: 108,
    heroName: '东皇太一',
    heroType: '坦克',
    corePosition: '吸血续航、压制开团、反制刺客',
    combatFeature: '小球吸血续航能力极强，大招能压制敌方核心英雄，完美克制刺客切入，但是大招需要精准预判',
    difficulty: 3,
    isNewbieRecommend: false
  },
  {
    id: 109,
    heroName: '猪八戒',
    heroType: '坦克',
    corePosition: '回血续航、团控留人、拉扯抗伤',
    combatFeature: '技能命中敌人回血，霸体免控效果多，团战中能持续抗伤拉扯，操作简单容错率高，新手友好',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 110,
    heroName: '蒙恬',
    heroType: '坦克',
    corePosition: '阵型防御、群体免伤、开团攻坚',
    combatFeature: '开启大招可召唤士兵形成阵型，高额免伤加击退，团战中能守住阵线，操作简单只需找好开团位置',
    difficulty: 2,
    isNewbieRecommend: false
  },
  {
    id: 111,
    heroName: '盾山',
    heroType: '坦克',
    corePosition: '格挡技能、修塔保排、反手开团',
    combatFeature: '一技能可格挡所有远程技能，大招能封锁走位，还能修复防御塔，完美克制射手法师，操作简单',
    difficulty: 2,
    isNewbieRecommend: false
  },
  {
    id: 112,
    heroName: '庄周',
    heroType: '坦克',
    corePosition: '解控免伤、群体加速、拉扯牵制',
    combatFeature: '大招全体解控加免伤，二技能持续叠加伤害，不怕控制能灵活拉扯，操作简单，新手易上手',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 113,
    heroName: '刘邦',
    heroType: '坦克',
    corePosition: '远程支援、护盾保人、分带牵制',
    combatFeature: '大招可传送到队友身边并加护盾，能抗能支援，适合分带牵制敌人，操作简单容错率高',
    difficulty: 2,
    isNewbieRecommend: false
  },
  {
    id: 114,
    heroName: '孙策',
    heroType: '坦克',
    corePosition: '开团突击、连招控场、快速支援',
    combatFeature: '大招开船快速支援，连招击飞眩晕敌人，一套技能能开团留人，操作简单连招固定，新手友好',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 115,
    heroName: '夏侯惇',
    heroType: '坦克',
    corePosition: '全能坦边、护盾续航、灵活开团',
    combatFeature: '有位移有护盾有回血，技能连招灵活，可抗可打，适配所有阵容，新手容易掌握',
    difficulty: 2,
    isNewbieRecommend: true
  },

  // ========== 战士类 ==========
  {
    id: 201,
    heroName: '亚瑟',
    heroType: '战士',
    corePosition: '全能对抗、持续输出、新手必练',
    combatFeature: '技能简单粗暴，有位移有沉默有回血，既能抗伤也能打输出，上手难度极低，适合所有新手入门',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 202,
    heroName: '吕布',
    heroType: '战士',
    corePosition: '真伤输出、团战收割、坦度兼备',
    combatFeature: '普攻和技能有真实伤害，大招能开团和分割战场，出半肉装后又肉又能打，新手也能轻松打出高额伤害',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 203,
    heroName: '李信',
    heroType: '战士',
    corePosition: '双形态切换、远程消耗、近战爆发',
    combatFeature: '光信形态远程消耗清兵快，暗信形态近战带线牵制强，双形态适配不同战局，操作简单容错率高',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 204,
    heroName: '孙策',
    heroType: '战士',
    corePosition: '开团留人、连招爆发、支援快速',
    combatFeature: '大招能开船快速支援队友，连招有击飞和眩晕，一套技能能秒脆皮，操作简单连招固定，新手易上手',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 205,
    heroName: '花木兰',
    heroType: '战士',
    corePosition: '双形态切换、灵活切C、免伤爆发',
    combatFeature: '轻剑形态灵活拉扯，重剑形态免伤爆发，能轻松切敌方后排射手，但是需要熟练切换形态，难度稍高',
    difficulty: 4,
    isNewbieRecommend: false
  },
  {
    id: 206,
    heroName: '夏洛特',
    heroType: '战士',
    corePosition: '连招叠加、真实伤害、免控拉扯',
    combatFeature: '技能连招叠加被动触发真伤，自带免控和护盾，拉扯能力极强，但是需要记住连招顺序，新手不易上手',
    difficulty: 3,
    isNewbieRecommend: false
  },
  {
    id: 207,
    heroName: '典韦',
    heroType: '战士',
    corePosition: '普攻爆发、残血反打、收割利器',
    combatFeature: '大招命中后普攻有高额真实伤害，血量越低伤害越高，团战中能收割残血，操作简单只需要贴脸普攻',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 208,
    heroName: '凯',
    heroType: '战士',
    corePosition: '一刀流爆发、脆皮克星、半肉半输出',
    combatFeature: '开大后攻击力和坦度大幅提升，一刀能秒杀脆皮射手，出半肉装后容错率极高，新手也能轻松上手',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 209,
    heroName: '老夫子',
    heroType: '战士',
    corePosition: '单挑无解、捆人留人、带线牵制',
    combatFeature: '大招捆住敌人后单挑无敌，二技能高额免伤，适合带线牵制，操作简单只需捆住敌人贴脸输出',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 210,
    heroName: '曜',
    heroType: '战士',
    corePosition: '灵活连招、回血续航、拉扯输出',
    combatFeature: '技能连招能刷新位移，自带回血续航，团战中能灵活拉扯，但是需要熟练掌握连招节奏，新手慎选',
    difficulty: 4,
    isNewbieRecommend: false
  },
  {
    id: 211,
    heroName: '马超',
    heroType: '战士',
    corePosition: '移速拉扯、长枪突刺、高额爆发',
    combatFeature: '捡枪后移速超快，长枪突刺伤害极高，团战中能灵活收割，操作难度极大，新手不推荐',
    difficulty: 5,
    isNewbieRecommend: false
  },
  {
    id: 212,
    heroName: '盘古',
    heroType: '战士',
    corePosition: '缴械克制、群体输出、前排抗伤',
    combatFeature: '技能能缴械敌人让其无法普攻，完美克制射手，自带护盾续航，操作简单，新手友好',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 213,
    heroName: '狂铁',
    heroType: '战士',
    corePosition: '能量续航、连招爆发、单挑强势',
    combatFeature: '能量满时技能伤害极高，自带回血续航，单挑能力极强，操作简单只需攒满能量打连招',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 214,
    heroName: '钟无艳',
    heroType: '战士',
    corePosition: '石化控制、高额爆发、前排抗伤',
    combatFeature: '技能有概率石化敌人，大招范围伤害极高，能抗能打，操作简单只需预判敌人走位放技能',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 215,
    heroName: '夏侯惇',
    heroType: '战士',
    corePosition: '全能对抗、护盾续航、灵活开团',
    combatFeature: '有位移有护盾有回血，技能连招灵活，可抗可打，适配所有阵容，新手容易掌握',
    difficulty: 2,
    isNewbieRecommend: true
  },

  // ========== 刺客类 ==========
  {
    id: 301,
    heroName: '兰陵王',
    heroType: '刺客',
    corePosition: '隐身切入、秒杀脆皮、游走抓人',
    combatFeature: '大招隐身能轻松接近敌方后排，一套技能必秒脆皮射手/法师，操作简单连招固定，新手入门刺客首选',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 302,
    heroName: '阿轲',
    heroType: '刺客',
    corePosition: '背刺暴击、收割残血、团战刺客',
    combatFeature: '从敌人背后攻击必出暴击，击杀/助攻后刷新所有技能，团战中能无限收割，操作简单只需要找好站位',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 303,
    heroName: '韩信',
    heroType: '刺客',
    corePosition: '灵活位移、野区牵制、快速支援',
    combatFeature: '位移技能多，清野速度快，能快速支援各路，但是身板脆容错率低，需要熟练掌握位移连招，新手慎选',
    difficulty: 5,
    isNewbieRecommend: false
  },
  {
    id: 304,
    heroName: '镜',
    heroType: '刺客',
    corePosition: '镜像分身、连招爆发、秀操作刺客',
    combatFeature: '技能能召唤镜像，连招能打出多段伤害，上限极高，但是操作难度极大，需要大量练习，新手不推荐',
    difficulty: 5,
    isNewbieRecommend: false
  },
  {
    id: 305,
    heroName: '澜',
    heroType: '刺客',
    corePosition: '水中灵活、收割团战、持续输出',
    combatFeature: '在水中能无限位移，技能连招能打出多段伤害，团战中能收割多个敌人，但是需要熟练掌握入场时机',
    difficulty: 4,
    isNewbieRecommend: false
  },
  {
    id: 306,
    heroName: '孙悟空',
    heroType: '刺客',
    corePosition: '暴击爆发、秒人刺客、简单粗暴',
    combatFeature: '技能有位移和暴击加成，三棒能秒脆皮，操作简单只需要贴脸输出，容错率高，新手入门刺客首选',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 307,
    heroName: '娜可露露',
    heroType: '刺客',
    corePosition: '超高爆发、秒杀脆皮、快速支援',
    combatFeature: '大招能快速支援队友，一套技能能秒杀任何脆皮，操作简单连招固定，但是身板脆需要注意入场时机',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 308,
    heroName: '裴擒虎',
    heroType: '刺客',
    corePosition: '双形态打野、前期强势、节奏带动',
    combatFeature: '人形态远程消耗，虎形态近战爆发，前期清野速度快能快速入侵野区，但是后期乏力，新手不易掌握节奏',
    difficulty: 4,
    isNewbieRecommend: false
  },
  {
    id: 309,
    heroName: '橘右京',
    heroType: '刺客',
    corePosition: '远程消耗、连招爆发、灵活切C',
    combatFeature: '技能远程消耗清兵快，连招能打出高额爆发，能轻松切敌方后排，操作简单连招固定，新手友好',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 310,
    heroName: '云中君',
    heroType: '刺客',
    corePosition: '无视地形、持续输出、秒杀脆皮',
    combatFeature: '大招无视地形快速切入，普攻持续流血伤害，能轻松秒杀脆皮，操作简单只需贴脸输出',
    difficulty: 3,
    isNewbieRecommend: false
  },
  {
    id: 311,
    heroName: '司马懿',
    heroType: '刺客',
    corePosition: '沉默切入、法术爆发、收割残血',
    combatFeature: '大招快速切入沉默敌人，技能法术爆发极高，能轻松收割残血，操作简单只需找好入场时机',
    difficulty: 3,
    isNewbieRecommend: false
  },
  {
    id: 312,
    heroName: '百里玄策',
    heroType: '刺客',
    corePosition: '勾人拉扯、连招收割、团战搅局',
    combatFeature: '二技能勾中敌人后能灵活拉扯，击杀后刷新技能，团战中能无限收割，操作难度高，新手慎选',
    difficulty: 5,
    isNewbieRecommend: false
  },
  {
    id: 313,
    heroName: '荆轲',
    heroType: '刺客',
    corePosition: '残血收割、隐身切入、秒杀脆皮',
    combatFeature: '大招能隐身切入敌方后排，击杀残血后刷新技能，操作简单只需找残血目标收割',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 314,
    heroName: '元歌',
    heroType: '刺客',
    corePosition: '傀儡分身、连招秀场、秒杀脆皮',
    combatFeature: '傀儡能迷惑敌人，连招能打出多段伤害，能轻松秒杀脆皮，操作难度极大，新手不推荐',
    difficulty: 5,
    isNewbieRecommend: false
  },
  {
    id: 315,
    heroName: '盘古',
    heroType: '刺客',
    corePosition: '缴械克制、群体输出、前排收割',
    combatFeature: '技能能缴械敌人，完美克制射手，大招范围伤害极高，操作简单，新手友好',
    difficulty: 2,
    isNewbieRecommend: true
  },

  // ========== 辅助类 ==========
  {
    id: 401,
    heroName: '蔡文姬',
    heroType: '辅助',
    corePosition: '群体回血、持续控制、新手必练',
    combatFeature: '技能能给队友群体回血和加护盾，二技能有眩晕控制，操作简单只需要跟紧队友加血，新手辅助首选',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 402,
    heroName: '明世隐',
    heroType: '辅助',
    corePosition: '单体增益、牵线保人、极致输出',
    combatFeature: '大招能给队友加血和加攻击力，牵线后能大幅提升队友输出，操作简单只需要跟紧射手，新手易上手',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 403,
    heroName: '孙膑',
    heroType: '辅助',
    corePosition: '群体加速、抬血续航、拉扯开团',
    combatFeature: '二技能群体加速和回血，大招能沉默敌人并减速，团战中能拉扯敌方阵型，操作简单容错率高',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 404,
    heroName: '瑶',
    heroType: '辅助',
    corePosition: '附身保护、护盾免伤、灵活支援',
    combatFeature: '大招能附身队友并提供护盾，二技能能打出小额伤害，操作简单只需要跟紧队友附身，新手易上手',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 405,
    heroName: '大乔',
    heroType: '辅助',
    corePosition: '传送支援、开团留人、团队核心',
    combatFeature: '大招能召唤队友支援，二技能能送队友回家补血，团战中能快速转线，但是需要熟练掌握技能释放时机',
    difficulty: 4,
    isNewbieRecommend: false
  },
  {
    id: 406,
    heroName: '太乙真人',
    heroType: '辅助',
    corePosition: '复活队友、群体加速、开团保人',
    combatFeature: '大招能复活队友，一技能能炸晕敌人，团战中能保队友不死，但是需要精准预判大招释放时机',
    difficulty: 3,
    isNewbieRecommend: false
  },
  {
    id: 407,
    heroName: '张飞',
    heroType: '辅助',
    corePosition: '护盾保人、开团留人、反手控制',
    combatFeature: '大招能变身并击飞敌人，二技能能给队友加护盾，团战中能开团也能保护后排，操作简单容错率高',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 408,
    heroName: '鬼谷子',
    heroType: '辅助',
    corePosition: '隐身开团、群体拉扯、节奏带动',
    combatFeature: '大招能让全队隐身，二技能能拉回敌人，团战中能强行开团，但是需要熟练掌握入场时机，新手慎选',
    difficulty: 4,
    isNewbieRecommend: false
  },
  {
    id: 409,
    heroName: '鲁班大师',
    heroType: '辅助',
    corePosition: '护盾保排、推人开团、技能联动',
    combatFeature: '二技能能给队友护盾并拉回，大招能推人开团，完美配合射手，操作简单容错率高',
    difficulty: 2,
    isNewbieRecommend: false
  },
  {
    id: 410,
    heroName: '桑启',
    heroType: '辅助',
    corePosition: '群体回血、草丛续航、拉扯保人',
    combatFeature: '技能能群体回血，草丛中续航能力极强，团战中能持续保队友，操作简单只需跟紧队友加血',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 411,
    heroName: '刘禅',
    heroType: '辅助',
    corePosition: '拆塔先锋、群体控制、游走支援',
    combatFeature: '技能对防御塔有额外伤害，自带护盾和眩晕，拆塔速度极快，适合游走配合队友推进',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 412,
    heroName: '牛魔',
    heroType: '辅助',
    corePosition: '团队护盾、开团保人、反手控制',
    combatFeature: '二技能击飞+大招范围眩晕，能给队友提供护盾，团战中既能开团也能保护后排',
    difficulty: 2,
    isNewbieRecommend: false
  },
  {
    id: 413,
    heroName: '廉颇',
    heroType: '辅助',
    corePosition: '前排承伤、持续控制、团战神辅',
    combatFeature: '霸体免控，技能连招有高额护盾和范围控制，能抗能开团，操作简单',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 414,
    heroName: '东皇太一',
    heroType: '辅助',
    corePosition: '吸血续航、压制开团、反制刺客',
    combatFeature: '小球吸血续航强，大招压制敌方核心，完美克制刺客，操作简单只需贴脸开大',
    difficulty: 3,
    isNewbieRecommend: false
  },
  {
    id: 415,
    heroName: '孙膑',
    heroType: '辅助',
    corePosition: '群体加速、抬血续航、拉扯开团',
    combatFeature: '二技能群体加速回血，大招沉默减速，团战拉扯能力强，操作简单',
    difficulty: 2,
    isNewbieRecommend: true
  },

  // ========== 射手类 ==========
  {
    id: 501,
    heroName: '鲁班七号',
    heroType: '射手',
    corePosition: '持续普攻、范围输出、新手必练',
    combatFeature: '普攻伤害极高，被动有范围爆炸伤害，操作简单只需要走A输出，是新手入门射手的首选英雄',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 502,
    heroName: '后羿',
    heroType: '射手',
    corePosition: '站桩输出、群体减速、团战核心',
    combatFeature: '普攻有群体减速效果，大招能远程开团，操作简单只需要站桩输出，容错率高，新手易上手',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 503,
    heroName: '狄仁杰',
    heroType: '射手',
    corePosition: '解控自保、持续输出、灵活射手',
    combatFeature: '二技能能解除控制并加速，普攻伤害稳定，操作简单容错率高，不怕刺客切入，新手首选',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 504,
    heroName: '孙尚香',
    heroType: '射手',
    corePosition: '位移爆发、远程消耗、灵活输出',
    combatFeature: '一技能位移后普攻有高额爆发，能远程消耗敌人，操作简单连招固定，新手易上手',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 505,
    heroName: '伽罗',
    heroType: '射手',
    corePosition: '超远射程、减速留人、后期核心',
    combatFeature: '普攻射程超远，被动有减速效果，后期能轻松点杀坦克，但是前期弱势需要队友保护，新手慎选',
    difficulty: 3,
    isNewbieRecommend: false
  },
  {
    id: 506,
    heroName: '公孙离',
    heroType: '射手',
    corePosition: '灵活位移、秀操作、持续输出',
    combatFeature: '位移技能多，能灵活拉扯敌人，但是操作难度极大，需要熟练掌握位移连招，新手不推荐',
    difficulty: 5,
    isNewbieRecommend: false
  },
  {
    id: 507,
    heroName: '黄忠',
    heroType: '射手',
    corePosition: '架炮输出、高额爆发、团战核心',
    combatFeature: '大招架炮后普攻伤害极高，能轻松点掉防御塔，操作简单只需要找好位置架炮，新手易上手',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 508,
    heroName: '马可波罗',
    heroType: '射手',
    corePosition: '真实伤害、灵活位移、拉扯输出',
    combatFeature: '普攻能叠加真实伤害，位移技能多，能灵活拉扯敌人，但是需要熟练掌握普攻节奏，新手不易上手',
    difficulty: 4,
    isNewbieRecommend: false
  },
  {
    id: 509,
    heroName: '戈娅',
    heroType: '射手',
    corePosition: '移速拉扯、持续输出、团战收割',
    combatFeature: '普攻持续输出，移速超快能灵活拉扯，大招能减速留人，操作简单只需走A输出',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 510,
    heroName: '莱西奥',
    heroType: '射手',
    corePosition: '飞天输出、高额爆发、灵活切场',
    combatFeature: '大招能飞天输出，普攻伤害极高，能轻松秒杀脆皮，操作简单只需贴脸输出',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 511,
    heroName: '百里守约',
    heroType: '射手',
    corePosition: '远程狙击、视野掌控、秒杀脆皮',
    combatFeature: '二技能远程狙击能秒杀脆皮，大招能位移保命，操作难度高，需要精准预判，新手慎选',
    difficulty: 4,
    isNewbieRecommend: false
  },
  {
    id: 512,
    heroName: '虞姬',
    heroType: '射手',
    corePosition: '物理免疫、远程消耗、自保能力强',
    combatFeature: '二技能物理免疫，能轻松躲避刺客切入，普攻远程消耗，操作简单只需走A输出',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 513,
    heroName: '艾琳',
    heroType: '射手',
    corePosition: '法术输出、持续拉扯、团战核心',
    combatFeature: '普攻法术伤害，大招范围输出，能灵活拉扯敌人，操作简单只需走A输出',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 514,
    heroName: '李元芳',
    heroType: '射手',
    corePosition: '快速清兵、打野发育、团战收割',
    combatFeature: '一技能快速清兵打野，大招范围减速，团战中能快速收割，操作简单只需贴脸输出',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 515,
    heroName: '蒙犽',
    heroType: '射手',
    corePosition: '持续扫射、范围输出、团战核心',
    combatFeature: '大招持续扫射范围伤害，普攻持续输出，操作简单只需站桩输出',
    difficulty: 2,
    isNewbieRecommend: true
  },

  // ========== 法师类 ==========
  {
    id: 601,
    heroName: '妲己',
    heroType: '法师',
    corePosition: '单体爆发、秒杀脆皮、新手必练',
    combatFeature: '技能连招简单粗暴，一套技能必秒脆皮，操作简单只需要蹲草释放技能，是新手入门法师的首选',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 602,
    heroName: '安琪拉',
    heroType: '法师',
    corePosition: '范围爆发、群体伤害、新手必练',
    combatFeature: '大招有高额范围伤害，二技能能眩晕敌人，操作简单只需要预判敌人走位，新手易上手',
    difficulty: 1,
    isNewbieRecommend: true
  },
  {
    id: 603,
    heroName: '甄姬',
    heroType: '法师',
    corePosition: '群体控制、范围输出、团战法师',
    combatFeature: '技能有群体眩晕和减速，大招能打出高额范围伤害，操作简单只需要往人堆里放技能，新手易上手',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 604,
    heroName: '王昭君',
    heroType: '法师',
    corePosition: '群体减速、冰冻控制、范围输出',
    combatFeature: '技能有群体冰冻和减速，大招能打出高额范围伤害，团战中能分割战场，操作简单容错率高',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 605,
    heroName: '诸葛亮',
    heroType: '法师',
    corePosition: '位移收割、单体爆发、灵活法师',
    combatFeature: '位移技能多，大招能收割残血，团战中能灵活拉扯，但是需要熟练掌握入场时机，新手慎选',
    difficulty: 3,
    isNewbieRecommend: false
  },
  {
    id: 606,
    heroName: '不知火舞',
    heroType: '法师',
    corePosition: '灵活位移、连招爆发、秀操作法师',
    combatFeature: '位移技能多，连招能打出多段伤害，上限极高，但是操作难度极大，需要大量练习，新手不推荐',
    difficulty: 5,
    isNewbieRecommend: false
  },
  {
    id: 607,
    heroName: '米莱狄',
    heroType: '法师',
    corePosition: '推塔先锋、召唤仆从、快速清兵',
    combatFeature: '技能能召唤仆从推塔，清兵速度快，能快速拆掉敌方防御塔，操作简单只需要放技能就行，新手易上手',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 608,
    heroName: '貂蝉',
    heroType: '法师',
    corePosition: '无限连招、持续输出、团战核心',
    combatFeature: '二技能能躲技能，大招能刷新技能CD，团战中能无限连招，但是需要熟练掌握连招节奏，新手不易上手',
    difficulty: 4,
    isNewbieRecommend: false
  },
  {
    id: 609,
    heroName: '上官婉儿',
    heroType: '法师',
    corePosition: '飞天收割、连招爆发、秒杀脆皮',
    combatFeature: '连招飞天能秒杀脆皮，大招无法选中，团战中能轻松收割，操作难度高，新手慎选',
    difficulty: 5,
    isNewbieRecommend: false
  },
  {
    id: 610,
    heroName: '弈星',
    heroType: '法师',
    corePosition: '范围控制、高额爆发、团战核心',
    combatFeature: '技能范围控制，大招高额爆发，能轻松分割战场，操作简单只需预判敌人走位',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 611,
    heroName: '西施',
    heroType: '法师',
    corePosition: '牵引控制、远程消耗、团战核心',
    combatFeature: '二技能牵引敌人，大招刷新技能，团战中能轻松留人，操作简单只需预判敌人走位',
    difficulty: 3,
    isNewbieRecommend: false
  },
  {
    id: 612,
    heroName: '张良',
    heroType: '法师',
    corePosition: '单体压制、持续输出、反制刺客',
    combatFeature: '大招单体压制，能完美克制刺客，普攻持续输出，操作简单只需贴脸开大',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 613,
    heroName: '高渐离',
    heroType: '法师',
    corePosition: '团战爆发、金身进场、高额输出',
    combatFeature: '大招高额范围伤害，金身进场能轻松收割，操作简单只需开大招冲进人堆',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 614,
    heroName: '扁鹊',
    heroType: '法师',
    corePosition: '持续回血、毒伤输出、团战续航',
    combatFeature: '技能能持续回血和毒伤，团战中能持续输出，操作简单只需跟紧队友放技能',
    difficulty: 2,
    isNewbieRecommend: true
  },
  {
    id: 615,
    heroName: '杨玉环',
    heroType: '法师',
    corePosition: '群体回血、灵活输出、团战续航',
    combatFeature: '技能群体回血，大招无法选中，团战中能持续续航，操作简单只需跟紧队友放技能',
    difficulty: 3,
    isNewbieRecommend: false
  }
]