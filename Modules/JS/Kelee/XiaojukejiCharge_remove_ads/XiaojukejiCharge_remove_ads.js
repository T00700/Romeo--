/*
移除“权益与营销活动类”（邀请有礼、福利兑换、借钱等）及“会员相关”（会员价、专属券等）卡片。
*/
let body = $response.body;

// -------------------------------------------------------
// 1. 移除会员相关卡片 (来自模块 73482 - MemberCard)
// -------------------------------------------------------
// 原逻辑中判断是否展示会员入口的条件
const memberCardCondition = /e\.isShowMemberEntrance\|\|e\.showModuleSkeleton&&e\.showModuleSkeleton\.member&&e\.checkLogin/g;
// 强制替换为 false，使 Vue 不渲染该板块
body = body.replace(memberCardCondition, 'false');

// -------------------------------------------------------
// 2. 移除“低碳家园” (来自模块 73482 - BenifitCard - carbon-card)
// -------------------------------------------------------
// 原逻辑: n("carbon-card", ...)
// 替换为: e._e("carbon-card", ...) -> _e 是 Vue 的 createEmptyVNode
body = body.replace(/n\("carbon-card",/g, 'e._e("carbon-card",');

// -------------------------------------------------------
// 3. 移除其他权益与营销活动图标 (来自模块 73482 - BenifitCard)
// -------------------------------------------------------
// 需要移除的功能函数名列表
const marketingFuncs = [
    "handleLinkInvite", // 邀请有礼
    "toRedeemExchange", // 福利兑换
    "toJumpGun",        // 跳枪赔付
    "toYouxuan",        // 优选站
    "toAccChargePage",  // 加速充
    "toAds",            // 借钱 (预估6.6万元)
    "toActCenter"       // 活动中心
];

// 构建正则: 匹配 n("ThanosView", {staticClass:["item-wrapper"],attrs:{prismFunctionName:"目标函数"
// 将 n(...) 替换为 e._e(...)，即渲染为空注释节点
const marketingRegex = new RegExp(`n\\("ThanosView",(\\{staticClass:\\["item-wrapper"\\],attrs:\\{prismFunctionName:"(?:${marketingFuncs.join("|")})"`, 'g');

body = body.replace(marketingRegex, 'e._e("ThanosView",$1');

$done({ body });