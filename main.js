const Router = require("koa-router");
const axios = require("axios");
const cheerio = require("cheerio");
const api = new Router();

const log = console.log;

const getUrl = (nickname) => `https://lostark.game.onstove.com/Profile/Character/${encodeURI(nickname)}`
const getHtmlData = async (url) => {
	try {
		const encodedUrl = getUrl(url);
		log(encodedUrl);
		const html = await axios.get(encodedUrl);
		const $ = cheerio.load(html.data);
	
		return $;
	} catch (error) {
		log(error)
	}
}

api.get("/another", async (ctx) => {
	log("GET /another detected");
	
	const { nickname } = ctx.query;
	const $ = await getHtmlData(nickname);
	
	if (!nickname) {
		ctx.body = {
			"result": "error",
			"result_error": "query에 nickname을 포함시켜 주십시오."
		}
		return;
	}
	
	if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-attention").html()) {
		ctx.body = {
		  "result": "Error",
		  "result_error": "일치하는 닉네임의 캐릭터가 없습니다."
		}
		return;
    }

    const characterServer = $("#lostark-wrapper > div > main > div > div.profile-character-info > span.profile-character-info__server")
      .text()
      .replace("@", "");

    const anotherCharacterList = [];
	
	$("#expand-character-list").find("ul.profile-character-list__char").each((i, v) => {
		const server = $($("#expand-character-list").find("strong.profile-character-list__server").toArray()[i]).text().replace("@", "");
		$(v).find("li > span > button").each((i, v) => {
			const name = $(v).find("span").text();
			const level = $(v).text().replace($(v).find("span").text(), "").trim();
			const _class = $(v).find("img").attr("alt");
			anotherCharacterList[i] = { server, name, level, _class };
		});
	});

    ctx.body = {
	  result: "success",
      characterServer,
      anotherCharacterList,
    };
	
});

api.get("/info", async (ctx) => {
	log("GET /info detected");
	
	const { nickname } = ctx.query;
	const $ = await getHtmlData(nickname);
	
	if (!nickname) {
		ctx.body = {
			"result": "error",
			"result_error": "query에 nickname을 포함시켜 주십시오."
		}
		return;
	}
	
	if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-attention").html()) {
		ctx.body = {
		  "result": "Error",
		  "result_error": "일치하는 닉네임의 캐릭터가 없습니다." 
		}
		return;
    }
	
	const server = $(
		"#lostark-wrapper > div > main > div > div.profile-character-info > span.profile-character-info__server"
    ).text()
     .replace("@", "");
	const _class = $("#lostark-wrapper > div > main > div > div.profile-character-info > img"
	).attr("alt");
    const expeditionLevel = $(
		"#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info > div.level-info__expedition > span:nth-child(2)"
	).text();
    const battleLevel = $(
		"#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info > div.level-info__item > span:nth-child(2)"
    ).text();
    const gearLevel = $(
        "#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info2 > div.level-info2__expedition > span:nth-child(2)"
    ).text();
    const gearMaxLevel = $(
        "#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info2 > div.level-info2__item > span:nth-child(2)"
    ).text();
    const title = $(
        "#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.game-info__title > span:nth-child(2)"
    ).text();
    const guild = $(
        "#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.game-info__guild > span:nth-child(2)"
    ).text();
    const pvp = $(
        "#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.level-info__pvp > span:nth-child(2)"
    ).text();
    const wisdomName = $(
        "#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.game-info__wisdom > span:nth-child(3)"
    ).text();
    const wisdomLevel = $(
        "#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.game-info__wisdom > span:nth-child(2)"
    ).text();
    const basicAttack = $(
        "#profile-ability > div.profile-ability-basic > ul > li:nth-child(1) > span:nth-child(2)"
    ).text();
    const basicHP = $(
        "#profile-ability > div.profile-ability-basic > ul > li:nth-child(2) > span:nth-child(2)"
    ).text();
    const crit = $(
        "#profile-ability > div.profile-ability-battle > ul > li:nth-child(1) > span:nth-child(2)"
    ).text();
    const specialization = $(
        "#profile-ability > div.profile-ability-battle > ul > li:nth-child(2) > span:nth-child(2)"
    ).text();
    const domination = $(
		"#profile-ability > div.profile-ability-battle > ul > li:nth-child(3) > span:nth-child(2)"
    ).text();
    const swiftness = $(
        "#profile-ability > div.profile-ability-battle > ul > li:nth-child(4) > span:nth-child(2)"
    ).text();
    const endurance = $(
        "#profile-ability > div.profile-ability-battle > ul > li:nth-child(5) > span:nth-child(2)"
    ).text();
    const expertise = $(
        "#profile-ability > div.profile-ability-battle > ul > li:nth-child(6) > span:nth-child(2)"
    ).text();
    const engraveList = [];
    $(
        "#profile-ability > div.profile-ability-engrave > div > div.swiper-wrapper"
    )
    .find("li")
    .toArray()
    .forEach((v) => {
        const engraveName = $(v).find("span").text();
        const engraveDescription = $(v).find("p").text();
        engraveList.push({
			name: engraveName,
			description: engraveDescription,
        });
    });
    const virtuesList = $("body > script:nth-child(12)")
        .html()
        .split("value: [")[1]
        .split("],")[0]
        .replace(/\n/g, "")
        .replace(/\s*/g, "")
        .split(",");
    const virtues = {
        wisdom: virtuesList[0],
        courage: virtuesList[1],
        charisma: virtuesList[2],
        kindness: virtuesList[3],
    };

	const info = {
        nickname,
        server,
		_class,
        level: {
        expedition: expeditionLevel,
        battle: battleLevel,
        gear: {
			level: gearLevel,
            maxLevel: gearMaxLevel,
			},
		},
        title,
        guild,
        pvp,
        wisdom: {
          level: wisdomLevel,
          name: wisdomName,
        },
        basic: {
          attack: basicAttack,
          HP: basicHP,
        },
        battle: {
          crit,
          specialization,
          domination,
          swiftness,
          endurance,
          expertise,
        },
        engrave: engraveList,
        virtues,
	};
	
	ctx.body = {
		result: "success",
		info
	};
    }
);

api.get("/jewel", async (ctx) => {
	log("GET /jewel detected");
	
	const { nickname } = ctx.query;
	const $ = await getHtmlData(nickname);
	
	log($("#profile-ability > script").html());
	
	if (!nickname) {
		ctx.body = {
			"result": "error",
			"result_error": "query에 nickname을 포함시켜 주십시오."
		}
		return;
	}
	
	if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-attention").html()) {
		ctx.body = {
		  "result": "Error",
		  "result_error": "일치하는 닉네임의 캐릭터가 없습니다." 
		}
		return;
    }
	
	const jewelList = [];
	
	if($("#profile-ability > script").html().match(/\s/).input === "\n") {
		ctx.body = {
			result: "success",
			jewelList: [
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
			]
		}
		return;
	}

    const profile = JSON.parse(
      $("#profile-ability > script")
        .html()
        .replace("$.Profile = {", "{")
        .replace("};", "}")
    );

	if($("#profile-jewel > div > div.jewel__wrap").find(".jewel_btn").toArray().length === 0) {
		for (let i = 0; i < 11; i++) {
			jewelList.push({});
		}
	}

    $("#profile-jewel > div > div.jewel__wrap")
		.find(".jewel_btn")
		.toArray()
		.forEach((v, i) => {
			const jewelData = profile["Equip"][$(v).attr("data-item")];
			
			if(!jewelData) {
				jewelList.push({});
			}

			const jewel = {
				name: jewelData["Element_000"]["value"].replace(/(<([^>]+)>)/gi, ""),
				grade: jewelData["Element_001"]["value"]["leftStr0"].replace(/(<([^>]+)>)/gi,""),
				tier: jewelData["Element_001"]["value"]["leftStr2"].replace(/(<([^>]+)>)/gi,""),
				effect: jewelData["Element_004"]["value"]["Element_001"].replace(/(<([^>]+)>)/gi,""),
				image: jewelData["Element_001"]["value"]["slotData"]["iconPath"]
			};
			jewelList.push(jewel);
			
			return;
		});
		
	ctx.body = {
		result: "success",
		jewelList
	};
});

api.get("/card", async (ctx) => {
	log("GET /card detected");
	
	const { nickname } = ctx.query;
	const $ = await getHtmlData(nickname);
	
	if (!nickname) {
		ctx.body = {
			"result": "error",
			"result_error": "query에 nickname을 포함시켜 주십시오."
		}
		return;
	}
	
	if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-attention").html()) {
		ctx.body = {
		  "result": "Error",
		  "result_error": "일치하는 닉네임의 캐릭터가 없습니다." 
		}
		return;
    }
	
	let cardList = [];
    let cardEffectList = [];
	
	if($("#profile-jewel > div > div.jewel__wrap").find(".jewel_btn").length === 0) {
		cardList = [...Array(6)].map((_, i) => {});
		cardEffect = {};
		ctx.body = {
			"result": "success",
			cardList,
			cardEffectList
		};
		return;
	}
	
    const profile = JSON.parse(
		$("#profile-ability > script")
			.html()
			.replace("$.Profile = {", "{")
			.replace("};", "}")
    );

    $("#cardList")
		.find("li")
		.toArray()
		.forEach((v, i) => {
			const cardData = profile["Card"][$(v).find("div.card-slot").attr("data-item")];

			cardList[i] = {
				name: cardData["Element_000"]["value"].replace(/(<([^>]+)>)/gi, ""),
				description: cardData["Element_002"]["value"],
				awake: {
					count: cardData["Element_001"]["value"]["awakeCount"],
					total: cardData["Element_001"]["value"]["awakeTotal"],
				},
				rarity: cardData["Element_001"]["value"]["tierGrade"],
				image: cardData["Element_001"]["value"]["iconData"]["iconPath"],
			};
    });

    $("#cardSetList")
		.find("li")
		.toArray()
		.forEach((v, i) => {
			const title = $(v).find("div.card-effect__title").text();
			const description = $(v).find("div.card-effect__dsc").text();

			cardEffectList[i] = ({ title, description });
    });

    const card = {
		"result": "success",
		cardList,
		cardEffectList,
    };
	
	ctx.body = card;
});

api.get("/skill", async (ctx) => {
	log("GET /skill detected");
	
	const { nickname } = ctx.query;
	const $ = await getHtmlData(nickname);
	
	if (!nickname) {
		ctx.body = {
			"result": "error",
			"result_error": "query에 nickname을 포함시켜 주십시오."
		}
		return;
	}
	
	if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-attention").html()) {
		ctx.body = {
		  "result": "Error",
		  "result_error": "일치하는 닉네임의 캐릭터가 없습니다." 
		}
		return;
    }

	let skillList = [];
	
	if($("#profile-skill > div.profile-skill-battle > div.profile-skill__list").find("div.profile-skill__item").length === 0) {
		skillList = "사용할 수 있는 스킬이 없습니다.";
		ctx.body = {
			"result": "success",
			skillList,
		};
		return;
	}

    $("#profile-skill > div.profile-skill-battle > div.profile-skill__list")
		.find("div.profile-skill__item")
		.toArray()
		.forEach((v, skillIndex) => {
			const skillData = JSON.parse(
				$(v).find("a.button--profile-skill").attr("data-skill")
			);
			
			if (skillData["tripodList"].length === 0) {
				skillList[skillIndex] = {
					name: skillData["name"],
					level: skillData["level"],
					type: skillData["type"].replace(/(<([^>]+)>)/gi, ""),
					image: skillData["slotIcon"],
				};
			} else {
				skillList[skillIndex] = {
					name: skillData["name"],
					level: skillData["level"],
					type: skillData["type"].replace(/(<([^>]+)>)/gi, ""),
					image: skillData["slotIcon"],
					tripod: [
						[
							{
								name: skillData["tripodList"][0]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][0]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][0]["featureLevel"],
								image: skillData["tripodList"][0]["slotIcon"],
							},
							{
								name: skillData["tripodList"][1]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][1]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][1]["featureLevel"],
								image: skillData["tripodList"][1]["slotIcon"],
							},
							{
								name: skillData["tripodList"][2]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][2]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][2]["featureLevel"],
								image: skillData["tripodList"][2]["slotIcon"],
							},
						],
						[
							{
								name: skillData["tripodList"][3]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][3]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][3]["featureLevel"],
								image: skillData["tripodList"][3]["slotIcon"],
							},
							{
								name: skillData["tripodList"][4]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][4]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][4]["featureLevel"],
								image: skillData["tripodList"][4]["slotIcon"],
							},
							{
								name: skillData["tripodList"][5]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][5]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][5]["featureLevel"],
								image: skillData["tripodList"][5]["slotIcon"],
							},
						],
						[
							{
								name: skillData["tripodList"][6]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][6]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][6]["featureLevel"],
								image: skillData["tripodList"][6]["slotIcon"],
							},
							{
								name: skillData["tripodList"][7]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][7]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][7]["featureLevel"],
								image: skillData["tripodList"][7]["slotIcon"],
							}
						],
					],
					selectedTripodList: [],
					rune: {},
				};
			}
			
			skillData["selectedTripodTier"].forEach((tripodTier, tripodIndex) => {
				if (!skillList[skillIndex]["tripod"]) {
					return;
				}
				if (tripodTier === 0) {
					return;
				}
				skillList[skillIndex]["selectedTripodList"][tripodIndex] = skillList[skillIndex]["tripod"][tripodIndex][tripodTier - 1];
			});
			
			if (skillData["rune"]) {
				const runeData = JSON.parse(skillData["rune"]["tooltip"]);
				
				skillList[skillIndex]["rune"] = {
					name: runeData["Element_000"]["value"].replace(/(<([^>]+)>)/gi, ""),
					grade: runeData["Element_001"]["value"]["leftStr0"].replace(/(<([^>]+)>)/gi, ""),
					description: runeData["Element_002"]["value"]["Element_001"],
				};
			}
		});
	
	ctx.body = {
		"result": "success",
		skillList,
	};
});

api.get("/equipment", async (ctx) => {
	log("GET /equipment detected");
	
	const { nickname } = ctx.query;
	const $ = await getHtmlData(nickname);
	
	if (!nickname) {
		ctx.body = {
			"result": "error",
			"result_error": "query에 nickname을 포함시켜 주십시오."
		}
		return;
	}
	
	if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-attention").html()) {
		ctx.body = {
		  "result": "Error",
		  "result_error": "일치하는 닉네임의 캐릭터가 없습니다." 
		}
		return;
    }
	
	let equipmentList = [];
	
	if($("#profile-ability > script").html().match(/\s/).input === "\n") {
		ctx.body = {
			result: "success",
			equipmentList: [
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
			]
		}
		return;
	}
	
	const profile = JSON.parse(
		$("#profile-ability > script")
			.html()
			.replace("$.Profile = {", "{")
			.replace("};", "}")
    );

    $("#profile-equipment > div.profile-equipment__slot")
		.find("div")
		.toArray()
		.forEach((v) => {
			const equipmentData = profile["Equip"][$(v).attr("data-item")];
			if (!equipmentData) {
				equipmentList.push({});
				return;
			}
        
			let equipmentName = equipmentData["Element_000"]["value"].replace(/(<([^>]+)>)/gi, "");
			let equipmentUpgrade = "0";
			const equipmentImage = equipmentData["Element_001"]["value"]["slotData"]["iconPath"];

			if (equipmentName.includes("+")) {
				equipmentUpgrade = equipmentName.split(" ")[0];
				equipmentName = equipmentName.replace(equipmentUpgrade, "");
			}

			const equipmentParts = equipmentData["Element_001"]["value"]["leftStr0"].replace(/(<([^>]+)>)/gi, "");
			const equipmentLevel = equipmentData["Element_001"]["value"]["leftStr2"].replace(/(<([^>]+)>)/gi, "");
			const equipmentQuality =equipmentData["Element_001"]["value"]["qualityValue"];
			const equipmentOption = {};
			const equipmentSet = {};

			if (equipmentData["Element_001"]["value"]["leftStr0"].includes("팔찌")) { // 팔찌
				equipmentOption["braceletEffects"] = {};
				
				const equipmentBraceletEffectList = equipmentData["Element_004"]["value"]["Element_001"].split(/<img[^>]*>((\n|\r|.)*?)<\/img>/gim);
				const equipmentBraceletEffectLetters = {};
				
				equipmentBraceletEffectList.filter((v) => v !== undefined).filter((v) => v !== "").forEach((v, i) => {
					equipmentBraceletEffectLetters[i] = v.trim().split("<BR>").filter((v) => v!== "").map((v) => v.replace(/(<([^>]+)>)/gi, ""));
				})
				
				Object.values(equipmentBraceletEffectLetters).forEach((v, i) => {
					equipmentOption["braceletEffects"][i] = v;
				});
				
				equipmentList.push({
					name: equipmentName,
					upgrade: equipmentUpgrade,
					parts: equipmentParts,
					level: equipmentLevel,
					quality: equipmentQuality,
					option: equipmentOption,
					image: equipmentImage
				});
				return;
			}

			if (equipmentData["Element_005"]["value"]["Element_000"].includes("기본 효과")) {
				equipmentOption["basic"] = {};
				const equipmentBasicList = equipmentData["Element_005"]["value"]["Element_001"].split("<BR>");
				for (let i = 0; equipmentBasicList.length > i; i++) {
					if (equipmentBasicList[i].includes("<")) {
						equipmentBasicList[i] = equipmentBasicList[i].replace(/(<([^>]+)>)/gi, "");
					}
					
					const equipmentBasicName = equipmentBasicList[i].split("+")[0];
					const equipmentBasicValue = equipmentBasicList[i].split("+")[1];
					equipmentOption["basic"][equipmentBasicName] = equipmentBasicValue;
				}

				if (equipmentData["Element_006"]["value"]["Element_000"].includes("추가 효과")) {
					equipmentOption["plus"] = {};
					const equipmentPlusList = equipmentData["Element_006"]["value"]["Element_001"].split("<BR>");
					for (let i = 0; equipmentPlusList.length > i; i++) {
						const equipmentPlusName = equipmentPlusList[i].split("+")[0];
						const equipmentPlusValue = equipmentPlusList[i].split("+")[1];
						equipmentOption["plus"][equipmentPlusName] = equipmentPlusValue;
					}
				}
				
				if (equipmentData["Element_000"]["value"].includes("+25") ) { // 25 재련 장비
					equipmentOption["tripod"] = {};
					const equipmentTripodList = equipmentData["Element_007"]["value"]["Element_000"]["contentStr"];
					Object.keys(equipmentTripodList).forEach((tripodIndex, i) => {
						const tripod = equipmentTripodList[tripodIndex]["contentStr"].split("Lv")[0].replace(/(<([^>]+)>)/gi, "");
						const tripodLevel = equipmentTripodList[tripodIndex]["contentStr"].split("Lv")[1].replace(/(<([^>]+)>)/gi, "");
						equipmentOption["tripod"][i] = {
							name: tripod,
							level: tripodLevel
						}
					});
					
					if (equipmentData["Element_009"]["value"] && equipmentData["Element_009"]["value"]["Element_000"] && equipmentData["Element_009"]["value"]["Element_000"]["contentStr"]) { // 세트 효과 있는 장비
						const setItemEnableList = [];
						const setItemDisableList = [];
						const setEffectList = [];
						let setEnableOverview = "";
						
						const equipmentSetItemList = equipmentData["Element_009"]["value"]["Element_000"]["contentStr"];
						Object.keys(equipmentSetItemList).forEach((setItemIndex, i) => {
							if (equipmentSetItemList[setItemIndex]["contentStr"].includes("FFD200")) {
								setItemEnableList.push(equipmentSetItemList[setItemIndex]["contentStr"].replace(/(<([^>]+)>)/gi, ""));
								setEnableOverview = equipmentSetItemList[setItemIndex]["contentStr"].replace(/(<([^>]+)>)/gi, "").replace(/ (\(([^\)]+)\))/gi, "");
							} else {
								setItemDisableList.push(equipmentSetItemList[setItemIndex]["contentStr"].replace(/(<([^>]+)>)/gi, ""));
							}
						});
						equipmentSet["setItemEnableList"] = setItemEnableList;
						equipmentSet["setItemDisableList"] = setItemDisableList;
						equipmentSet["setEnableOverview"] = setEnableOverview;
						
						for (const property in equipmentData["Element_009"]["value"]) {
							if (property === "Element_000") continue;
							
							const setEffect = {};
							const setEffectLetters = equipmentData["Element_009"]["value"][property]["contentStr"]["Element_000"]["contentStr"].split("<BR>");
							setEffectLetters.forEach((setEffectLetter, i) => {
								setEffect[i] = setEffectLetter.replace(/(<([^>]+)>)/gi, "");
								return;
							});
							
							const setEffectLevel = equipmentData["Element_009"]["value"][property]["topStr"].replace(/(<([^>]+)>)/gi, "");
							let setEnable = false;
							if (equipmentData["Element_009"]["value"][property]["topStr"].includes("FFD200")) {
								setEnable = true;
							}
							
							setEffectList.push({
								setEffect,
								setEffectLevel,
								setEnable,
							});
						}
						equipmentSet["setEffect"] = setEffectList;
					}
				} else if (equipmentData["Element_008"]["value"]["Element_000"] && equipmentData["Element_008"]["value"]["Element_000"]["topStr"].includes("트라이포드 효과")) { // 25 재련 이하 장비
					equipmentOption["tripod"] = {};
					const equipmentTripodList = equipmentData["Element_008"]["value"]["Element_000"]["contentStr"];
					Object.keys(equipmentTripodList).forEach((tripodIndex, i) => {
						const tripod = equipmentTripodList[tripodIndex]["contentStr"].split("Lv")[0].replace(/(<([^>]+)>)/gi, "");
						const tripodLevel = equipmentTripodList[tripodIndex]["contentStr"].split("Lv")[1].replace(/(<([^>]+)>)/gi, "");
						equipmentOption["tripod"][i] = {
							name: tripod,
							level: tripodLevel
						}
					});
					
					if (equipmentData["Element_010"]["value"] && equipmentData["Element_010"]["value"]["Element_000"] && equipmentData["Element_010"]["value"]["Element_000"]["contentStr"]) { // 세트 효과 있는 장비
						const setItemEnableList = [];
						const setItemDisableList = [];
						const setEffectList = [];
						let setEnableOverview = "";
						
						const equipmentSetItemList = equipmentData["Element_010"]["value"]["Element_000"]["contentStr"];
						Object.keys(equipmentSetItemList).forEach((setItemIndex, i) => {
							if (equipmentSetItemList[setItemIndex]["contentStr"].includes("FFD200")) {
								setItemEnableList.push(equipmentSetItemList[setItemIndex]["contentStr"].replace(/(<([^>]+)>)/gi, ""));
								setEnableOverview = equipmentSetItemList[setItemIndex]["contentStr"].replace(/(<([^>]+)>)/gi, "").replace(/ (\(([^\)]+)\))/gi, "");
							} else {
								setItemDisableList.push(equipmentSetItemList[setItemIndex]["contentStr"].replace(/(<([^>]+)>)/gi, ""));
							}
						});
						equipmentSet["setItemEnableList"] = setItemEnableList;
						equipmentSet["setItemDisableList"] = setItemDisableList;
						equipmentSet["setEnableOverview"] = setEnableOverview;
						
						for (const property in equipmentData["Element_010"]["value"]) {
							if (property === "Element_000") continue;
							
							const setEffect = {};
							const setEffectLetters = equipmentData["Element_010"]["value"][property]["contentStr"]["Element_000"]["contentStr"].split("<BR>");
							setEffectLetters.forEach((setEffectLetter, i) => {
								setEffect[i] = setEffectLetter.replace(/(<([^>]+)>)/gi, "");
								return;
							});
							
							const setEffectLevel = equipmentData["Element_010"]["value"][property]["topStr"].replace(/(<([^>]+)>)/gi, "");
							let setEnable = false;
							if (equipmentData["Element_010"]["value"][property]["topStr"].includes("FFD200")) {
								setEnable = true;
							}
							
							setEffectList.push({
								setEffect,
								setEffectLevel,
								setEnable
							});
						}
						equipmentSet["setEffect"] = setEffectList;
					}
				}
				
				if (equipmentData["Element_007"]["value"]["Element_000"] && equipmentData["Element_007"]["value"]["Element_000"]["topStr"].includes("에스더 효과")) { // 에스더 무기 효과
					equipmentOption["esther"] = {};

					const equipmentEstherList = equipmentData["Element_007"]["value"]["Element_000"]["contentStr"];
					Object.keys(equipmentEstherList).forEach((estherIndex, i) => {
						const estherEffect = {};
						const estherEffectLetters = equipmentEstherList[estherIndex]["contentStr"].split("<BR>");
						estherEffectLetters.forEach((estherEffectLetter, i) => {
							estherEffect[i] = estherEffectLetter.replace(/(<([^>]+)>)/gi, "");
						});
						equipmentOption["esther"][i] = estherEffect;
					});

					equipmentSet["setEffect"] = [];
					
					const setEffect = {
						0: equipmentData["Element_009"]["value"]["Element_001"]
					};
					const setEffectLevel = equipmentData["Element_009"]["value"]["Element_000"].replace(/(<([^>]+)>)/gi, "");
					const setEnable = true;
					equipmentSet["setEffect"].push({
						setEffect,
						setEffectLevel,
						setEnable
					});
				}
				
				if (Object.keys(equipmentSet).length === 0) {
					equipmentList.push({
						name: equipmentName,
						upgrade: equipmentUpgrade,
						parts: equipmentParts,
						level: equipmentLevel,
						quality: equipmentQuality,
						option: equipmentOption,
						image: equipmentImage
					});	
				} else {
					equipmentList.push({
						name: equipmentName,
						upgrade: equipmentUpgrade,
						parts: equipmentParts,
						level: equipmentLevel,
						quality: equipmentQuality,
						option: equipmentOption,
						set: equipmentSet,
						image: equipmentImage
					});	
				}
				
				return;
			}
			
			if (equipmentData["Element_001"]["value"]["leftStr0"].includes("어빌리티 스톤")) { // 어빌리티 스톤
				equipmentOption["basic"] = {};
				const equipmentBasicName = equipmentData["Element_004"]["value"]["Element_001"].split("+")[0];
				const equipmentBasicValue = equipmentData["Element_004"]["value"]["Element_001"].split("+")[1];
				equipmentOption["basic"][equipmentBasicName] = equipmentBasicValue;

				if (equipmentData["Element_005"]["value"]["Element_000"].includes("세공 단계 보너스")) {
					equipmentOption["reforgeBonus"] = {};
					const equipmentReforgeName = equipmentData["Element_005"]["value"]["Element_001"].split("+")[0];
					const equipmentReforgeValue = equipmentData["Element_005"]["value"]["Element_001"].split("+")[1];
					equipmentOption["reforgeBonus"][equipmentReforgeName] = equipmentReforgeValue;
					
					equipmentOption["engravingEffects"] = {};
					const equipmentEngravingEffectList = equipmentData["Element_006"]["value"]["Element_001"].split("<BR>");
					equipmentEngravingEffectList.forEach((v, i) => {
						equipmentOption["engravingEffects"][i] = {};
						let isReduced = false;
						if (v.includes("FE2E2E")) {
							isReduced = true;
						}
						const engravingEffectName = v.replace(/(<([^>]+)>)/gi, "").split("+")[0];
						const engravingEffectValue = v.replace(/(<([^>]+)>)/gi, "").split("+")[1];
						equipmentOption["engravingEffects"][i]["name"] = engravingEffectName;
						equipmentOption["engravingEffects"][i]["value"] = engravingEffectValue;
						equipmentOption["engravingEffects"][i]["isReduced"] = isReduced;
					});
				} else {
					equipmentOption["engravingEffects"] = {};
					const equipmentEngravingEffectList = equipmentData["Element_005"]["value"]["Element_001"].split("<BR>");
					equipmentEngravingEffectList.forEach((v, i) => {
						equipmentOption["engravingEffects"][i] = {};
						let isReduced = false;
						if (v.includes("FE2E2E")) {
							isReduced = true;
						}
						const engravingEffectName = v.replace(/(<([^>]+)>)/gi, "").split("+")[0];
						const engravingEffectValue = v.replace(/(<([^>]+)>)/gi, "").split("+")[1];
						equipmentOption["engravingEffects"][i]["name"] = engravingEffectName;
						equipmentOption["engravingEffects"][i]["value"] = engravingEffectValue;
						equipmentOption["engravingEffects"][i]["isReduced"] = isReduced;
					});
				}
				
				equipmentList.push({
					name: equipmentName,
					upgrade: equipmentUpgrade,
					parts: equipmentParts,
					level: equipmentLevel,
					quality: equipmentQuality,
					option: equipmentOption,
					image: equipmentImage,
				});
				
				return;
			}
			
			if (equipmentData["Element_004"]["value"]["Element_000"].includes("기본 효과")) { // 반지, 귀걸이, 목걸이
				equipmentOption["basic"] = {};
				const equipmentBasicList = equipmentData["Element_004"]["value"]["Element_001"].split("<BR>");
				for (let i = 0; equipmentBasicList.length > i; i++) {
					if (equipmentBasicList[i].includes("<")) {
						equipmentBasicList[i] = equipmentBasicList[i].replace(/(<([^>]+)>)/gi, "");
					}
						
					const equipmentBasicName = equipmentBasicList[i].split("+")[0];
					const equipmentBasicValue = equipmentBasicList[i].split("+")[1];
					equipmentOption["basic"][equipmentBasicName] = equipmentBasicValue;
				}

				equipmentOption["plus"] = {};
				const equipmentPlusList = equipmentData["Element_005"]["value"]["Element_001"].split("<BR>");
				for (let i = 0; equipmentPlusList.length > i; i++) {
					const equipmentPlusName = equipmentPlusList[i].split("+")[0];
					const equipmentPlusValue = equipmentPlusList[i].split("+")[1];
					equipmentOption["plus"][equipmentPlusName] = equipmentPlusValue;
				}

				if (equipmentData["Element_006"]["value"]["Element_000"] && equipmentData["Element_006"]["value"]["Element_000"].includes("무작위 각인 효과")) {
					equipmentOption["engravingEffects"] = {};
					const equipmentEngravingEffectList = equipmentData["Element_006"]["value"]["Element_001"].split("<BR>");
					equipmentEngravingEffectList.forEach((v, i) => {
						equipmentOption["engravingEffects"][i] = {};
						let isReduced = false;
						if (v.includes("FE2E2E")) {
							isReduced = true;
						}
						const name = v.replace(/(<([^>]+)>)/gi, "").split("+")[0];
						const value = v.replace(/(<([^>]+)>)/gi, "").split("+")[1];
						equipmentOption["engravingEffects"][i]["name"] = name;
						equipmentOption["engravingEffects"][i]["value"] = value;
						equipmentOption["engravingEffects"][i]["isReduced"] = isReduced;
					});	
				}
				
			}

			equipmentList.push({
				name: equipmentName,
				upgrade: equipmentUpgrade,
				parts: equipmentParts,
				level: equipmentLevel,
				quality: equipmentQuality,
				option: equipmentOption,
				image: equipmentImage,
			});
		});
		
	equipmentList.splice(equipmentList.length - 2); // 각인 2개 제거
	
	ctx.body = {
		"result": "success",
		equipmentList,
	};
});

const characterAvatar = api.get("/avatar", async (ctx) => {
	log("GET /avatar detected");
	
	const { nickname } = ctx.query;
	const $ = await getHtmlData(nickname);
	
	if (!nickname) {
		ctx.body = {
			"result": "error",
			"result_error": "query에 nickname을 포함시켜 주십시오."
		}
		return;
	}
	
	if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-attention").html()) {
		ctx.body = {
		  "result": "Error",
		  "result_error": "일치하는 닉네임의 캐릭터가 없습니다." 
		}
		return;
    }

	let avatarList = [];
	let isThereAvatarLayered = false;
	
	if($("#profile-ability > script").html().match(/\s/).input === "\n") {
		ctx.body = {
			result: "success",
			avatarList: [
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
			]
		}
		return;
	}
	
	const profile = JSON.parse(
		$("#profile-ability > script")
		.html()
		.replace("$.Profile = {", "{")
		.replace("};", "}")
	);
	
	if ($("#profile-avatar > div.profile-avatar__slot").find("div").length > 7) {
		log("아바타 덧입기 있음");
		isThereAvatarLayered = true;
	}

    $("#profile-avatar > div.profile-avatar__slot")
		.find("div")
		.toArray()
		.forEach((v, i) => {
			
			const avatarData = profile["Equip"][$(v).attr("data-item")];

			if (!avatarData) {
				avatarList.push({});
				return;
			}

			const avatarName = avatarData["Element_000"]["value"].replace(/(<([^>]+)>)/gi, "");
			const avatarParts = avatarData["Element_001"]["value"]["leftStr0"].replace(/(<([^>]+)>)/gi, "");
			let avatarLayered = false;
			const avatarOption = {};
			const avatarImage = avatarData["Element_001"]["value"]["slotData"]["iconPath"];
			log(avatarName);

			if (avatarData["Element_005"]["value"]["Element_000"] && avatarData["Element_005"]["value"]["Element_000"].includes("기본 효과")) {
				avatarOption["basic"] = {};
				const avatarBasicName = avatarData["Element_005"]["value"]["Element_001"].replace(/(<([^>]+)>)/gi, "").split("+")[0].replace(/&/, "");
				const avatarBasicValue = avatarData["Element_005"]["value"]["Element_001"].replace(/(<([^>]+)>)/gi, "").split("+")[1];
				avatarOption["basic"]["name"] = avatarBasicName;
				avatarOption["basic"]["value"] = avatarBasicValue;
			}
			
			if (avatarData["Element_004"]["value"]["titleStr"] && avatarData["Element_004"]["value"]["titleStr"].includes("성향")) {
				avatarOption["tendency"] = {};

				const avatarTendencyList = avatarData["Element_004"]["value"]["contentStr"].split("<BR>");
				avatarTendencyList.forEach((v, i) => {
					if (v === "") {
						return;
					} else {
						avatarOption["tendency"][i] = {};
						const avatarTendencyName = v.split(" : ")[0].replace(/&.*?\s/g, "");
						const avatarTendencyValue = v.split(" : ")[1];
  
						avatarOption["tendency"][i]["name"] = avatarTendencyName;
						avatarOption["tendency"][i]["value"] = avatarTendencyValue;
					}
				});
			}

			if (avatarData["Element_005"]["value"]["titleStr"] && avatarData["Element_005"]["value"]["titleStr"].includes("성향")) {
				avatarOption["tendency"] = {};

				const avatarTendencyList = avatarData["Element_005"]["value"]["contentStr"].split("<BR>");
				avatarTendencyList.forEach((v, i) => {
					if (v === "") {
						return;
					} else {
						avatarOption["tendency"][i] = {};
						const avatarTendencyName = v.split(" : ")[0].replace(/&.*?\s/g, "");
						const avatarTendencyValue = v.split(" : ")[1];
  
						avatarOption["tendency"][i]["name"] = avatarTendencyName;
						avatarOption["tendency"][i]["value"] = avatarTendencyValue;
					}
				});
			}

			if (avatarData["Element_006"] && avatarData["Element_006"]["value"]["titleStr"] && avatarData["Element_006"]["value"]["titleStr"].includes("성향")) {
				avatarOption["tendency"] = {};
				const avatarTendencyList = avatarData["Element_006"]["value"]["contentStr"].split("<BR>");
				avatarTendencyList.forEach((v, i) => {
					if (v === "") {
						return;
					} else {
						avatarOption["tendency"][i] = {};
						const avatarTendencyName = v.split(" : ")[0].replace(/&.*?\s/g, "");
						const avatarTendencyValue = v.split(" : ")[1];
  
						avatarOption["tendency"][i]["name"] = avatarTendencyName;
						avatarOption["tendency"][i]["value"] = avatarTendencyValue;
					}
				});
			}

			if (avatarData["Element_005"]["value"] && typeof(avatarData["Element_005"]["value"]) === 'string' && avatarData["Element_005"]["value"].includes("아래 능력들이 적용되지 않는 상태입니다.")) { //덧입기 아바타
				avatarLayered = true;

				if (avatarData["Element_006"]["value"]["Element_000"] && avatarData["Element_006"]["value"]["Element_000"].includes("기본 효과")) {
					avatarOption["basic"] = {};
					const avatarBasicName = avatarData["Element_006"]["value"]["Element_001"].replace(/(<([^>]+)>)/gi, "").split("+")[0].replace(/&/, "");
					const avatarBasicValue = avatarData["Element_006"]["value"]["Element_001"].replace(/(<([^>]+)>)/gi, "").split("+")[1];
					avatarOption["basic"]["name"] = avatarBasicName;
					avatarOption["basic"]["value"] = avatarBasicValue;
				}

				if (avatarData["Element_007"]["value"]["titleStr"] && avatarData["Element_007"]["value"]["titleStr"].includes("성향")) {
					avatarOption["tendency"] = {};
					const avatarTendencyList = avatarData["Element_007"]["value"]["contentStr"].split("<BR>");
					avatarTendencyList.forEach((v, i) => {
						if (v === "") {
							return;
						} else {
							avatarOption["tendency"][i] = {};
							const avatarTendencyName = v.split(" : ")[0].replace(/&.*?\s/g, "");
							const avatarTendencyValue = v.split(" : ")[1];
		
							avatarOption["tendency"][i]["name"] = avatarTendencyName;
							avatarOption["tendency"][i]["value"] = avatarTendencyValue;
						}
					});
				}
			}

			avatarList.push({
				name: avatarName,
				parts: avatarParts,
				layered: avatarLayered,
				option: avatarOption,
				image: avatarImage
			});
		});
		
		if (!isThereAvatarLayered) {
			avatarList.splice(1, 0, {});
			avatarList.splice(4, 0, {});
			avatarList.splice(8, 0, {});
			avatarList.splice(10, 0, {});
		}
		
		let avatarListItem = avatarList.splice(2, 1);
		avatarList.splice(10, 0, avatarListItem);
		avatarListItem = avatarList.splice(4, 2);
		avatarList.splice(8, 0, avatarListItem);
		
	ctx.body = {
		result: "success",
		avatarList: avatarList.flat(),
	};
});

module.exports = api;