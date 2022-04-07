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

    const characterServer = $("#expand-character-list > strong")
      .text()
      .replace("@", "");

    const characterAnotherList = [];
    $("#expand-character-list > ul > li")
      .toArray()
      .forEach((v) => {
        const characterLevel = $(v)
          .find("button")
          .text()
          .replace($(v).find("button > span").text(), "")
          .trim();
        const characterName = $(v).find("button > span").text();
        characterAnotherList.push({ characterLevel, characterName });
      });

    ctx.body = {
      characterServer,
      characterAnotherList,
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

    ctx.body = {
        nickname,
        server,
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
	
	let jewel = {};
	
	if($("#profile-jewel > div > div.jewel__wrap").find(".jewel_btn").length === 0) {
		jewel = "장착된 보석이 없습니다.";
		ctx.body = {
			"result": "success",
			jewel
		};
		return;
	}

    const profile = JSON.parse(
      $("#profile-ability > script")
        .html()
        .replace("$.Profile = {", "{")
        .replace("};", "}")
    );

    $("#profile-jewel > div > div.jewel__wrap")
		.find(".jewel_btn")
		.toArray()
		.forEach((v, i) => {
			const jewelData = profile["Equip"][$(v).attr("data-item")];
			
			if (!jewelData) {
				jewel[`${i+1} 번째 보석`] = { name: "장착되지 않음" }
				return;
			}

			jewel[`${i+1} 번째 보석`] = {
				name: jewelData["Element_000"]["value"].replace(/(<([^>]+)>)/gi, ""),
				grade: jewelData["Element_001"]["value"]["leftStr0"].replace(/(<([^>]+)>)/gi,""),
				tier: jewelData["Element_001"]["value"]["leftStr2"].replace(/(<([^>]+)>)/gi,""),
				effect: jewelData["Element_004"]["value"]["Element_001"].replace(/(<([^>]+)>)/gi,""),
				image: jewelData["Element_001"]["value"]["slotData"]["iconPath"]
			};
			return;
		});
		
	ctx.body = {
		result: "success",
		jewel
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
	
	let cardList = {};
    let cardEffect = {};
	
	if($("#profile-jewel > div > div.jewel__wrap").find(".jewel_btn").length === 0) {
		cardList = "장착된 카드가 없습니다.";
		cardEffect = "장착된 카드가 없습니다.";
		ctx.body = {
			"result": "success",
			cardList,
			cardEffect
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
			const cardData =
				profile["Card"][$(v).find("div.card-slot").attr("data-item")];

        cardList[i] = {
			name: cardData["Element_000"]["value"].replace(/(<([^>]+)>)/gi, ""),
			description: cardData["Element_002"]["value"],
			awake: {
				count: cardData["Element_001"]["value"]["awakeCount"],
				total: cardData["Element_001"]["value"]["awakeTotal"],
			},
			image: cardData["Element_001"]["value"]["iconData"]["iconPath"],
        };
    });

    $("#cardSetList")
		.find("li")
		.toArray()
		.forEach((v, i) => {
			const title = $(v).find("div.card-effect__title").text();
			const description = $(v).find("div.card-effect__dsc").text();

        cardEffect[i] = ({ title, description });
    });

    const card = {
		card: cardList,
		set: cardEffect,
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

	let skillList = {};
	
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
		.forEach((v, i) => {
			const skillData = JSON.parse(
				$(v).find("a.button--profile-skill").attr("data-skill")
			);
			
			log(skillData);
			
			if (skillData["tripodList"].length === 0) {
				skillList[i] = {
					name: skillData["name"],
					level: skillData["level"],
					type: skillData["type"].replace(/(<([^>]+)>)/gi, ""),
					image: skillData["slotIcon"],
					tripod: {},
				};
			} else {
				skillList[i] = {
					name: skillData["name"],
					level: skillData["level"],
					type: skillData["type"].replace(/(<([^>]+)>)/gi, ""),
					image: skillData["slotIcon"],
					tripod: {
						"0": {
							"0": {
								name: skillData["tripodList"][0]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][0]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][0]["featureLevel"],
								image: skillData["tripodList"][0]["slotIcon"],
							},
							"1": {
								name: skillData["tripodList"][1]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][1]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][1]["featureLevel"],
								image: skillData["tripodList"][1]["slotIcon"],
							},
							"2": {
								name: skillData["tripodList"][2]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][2]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][2]["featureLevel"],
								image: skillData["tripodList"][2]["slotIcon"],
							},
						},
						"1": {
							"0": {
								name: skillData["tripodList"][3]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][3]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][3]["featureLevel"],
								image: skillData["tripodList"][3]["slotIcon"],
							},
							"1": {
								name: skillData["tripodList"][4]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][4]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][4]["featureLevel"],
								image: skillData["tripodList"][4]["slotIcon"],
							},
							"2": {
								name: skillData["tripodList"][5]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][5]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][5]["featureLevel"],
								image: skillData["tripodList"][5]["slotIcon"],
							},
						},
						"2": {
							"0": {
								name: skillData["tripodList"][6]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][6]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][6]["featureLevel"],
								image: skillData["tripodList"][6]["slotIcon"],
							},
							"1": {
								name: skillData["tripodList"][7]["name"].replace(/(<([^>]+)>)/gi, ""),
								description: skillData["tripodList"][7]["description"].replace(/(<([^>]+)>)/gi, ""),
								level: skillData["tripodList"][7]["featureLevel"],
								image: skillData["tripodList"][7]["slotIcon"],
							},
						},
					},
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
			log($(v).html());
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

			if (equipmentData["Element_001"]["value"]["leftStr0"].includes("팔찌")) { // 팔찌
				equipmentOption["bracelet Effects"] = {};
				const equipmentBraceletEffectList = equipmentData["Element_004"]["value"]["Element_001"].split("<BR>");
				equipmentBraceletEffectList.forEach((v, i) => {
					equipmentOption["bracelet Effects"][i] = {};
					let name = v.replace(/(<([^>]+)>)/gi, "").split("+")[0];
					let value = v.replace(/(<([^>]+)>)/gi, "").split("+")[1];
					if (!value) {
						name = v.replace(/(<([^>]+)>)/gi, "").split(":")[0];
						value = v.replace(/(<([^>]+)>)/gi, "").split(":")[0];
					}
					equipmentOption["bracelet Effects"][i]["name"] = name.trim();
					equipmentOption["bracelet Effects"][i]["value"] = value.trim();
				})
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
				} else if (equipmentData["Element_008"]["value"]["Element_000"] && equipmentData["Element_008"]["value"]["Element_000"]["topStr"].includes("트라이포드 효과")) {
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
				}
				
				if (equipmentData["Element_007"]["value"]["Element_000"] && equipmentData["Element_007"]["value"]["Element_000"]["topStr"].includes("에스더 효과")) {
					equipmentOption["esther"] = {};
					const equipmentEstherList = equipmentData["Element_007"]["value"]["Element_000"]["contentStr"];
					Object.keys(equipmentEstherList).forEach((estherIndex, i) => {
						const estherEffect = equipmentEstherList[estherIndex]["contentStr"].replace(/(<([^>]+)>)/gi, "");
						equipmentOption["esther"][i] = estherEffect;
					});
				}
				
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
			
			if (equipmentData["Element_001"]["value"]["leftStr0"].includes("어빌리티 스톤")) { // 어빌리티 스톤
				equipmentOption["basic"] = {};
				const equipmentBasicName = equipmentData["Element_004"]["value"]["Element_001"].split("+")[0];
				const equipmentBasicValue = equipmentData["Element_004"]["value"]["Element_001"].split("+")[1];
				equipmentOption["basic"][equipmentBasicName] = equipmentBasicValue;

				if (equipmentData["Element_005"]["value"]["Element_000"].includes("세공 단계 보너스")) {
					equipmentOption["reforge Bonus"] = {};
					const equipmentReforgeName = equipmentData["Element_005"]["value"]["Element_001"].split("+")[0];
					const equipmentReforgeValue = equipmentData["Element_005"]["value"]["Element_001"].split("+")[1];
					equipmentOption["reforge Bonus"][equipmentReforgeName] = equipmentReforgeValue;
					
					equipmentOption["engraving Effects"] = {};
					const equipmentEngravingEffectList = equipmentData["Element_006"]["value"]["Element_001"].split("<BR>");
					equipmentEngravingEffectList.forEach((v, i) => {
						equipmentOption["engraving Effects"][i] = {};
						const engravingEffectName = v.replace(/(<([^>]+)>)/gi, "").split("+")[0];
						const engravingEffectValue = v.replace(/(<([^>]+)>)/gi, "").split("+")[1];
						equipmentOption["engraving Effects"][i]["name"] = engravingEffectName;
						equipmentOption["engraving Effects"][i]["value"] = engravingEffectValue;
					});
				} else {
					equipmentOption["engraving Effects"] = {};
					const equipmentEngravingEffectList = equipmentData["Element_005"]["value"]["Element_001"].split("<BR>");
					equipmentEngravingEffectList.forEach((v, i) => {
						equipmentOption["engraving Effects"][i] = {};
						const engravingEffectName = v.replace(/(<([^>]+)>)/gi, "").split("+")[0];
						const engravingEffectValue = v.replace(/(<([^>]+)>)/gi, "").split("+")[1];
						equipmentOption["engraving Effects"][i]["name"] = engravingEffectName;
						equipmentOption["engraving Effects"][i]["value"] = engravingEffectValue;
					});
				}
				
				equipmentList.push({
					name: equipmentName,
					upgrade: equipmentUpgrade,
					parts: equipmentParts,
					level: equipmentLevel,
					quality: equipmentQuality,
					option: equipmentOption
				});
				
				return;
			}
			
			if (equipmentData["Element_004"]["value"]["Element_000"].includes("기본 효과")) { // 반지, 귀걸이, 목걸이
				log(equipmentName);
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

				equipmentOption["engraving Effects"] = {};
				const equipmentEngravingEffectList = equipmentData["Element_006"]["value"]["Element_001"].split("<BR>");
				equipmentEngravingEffectList.forEach((v, i) => {
					equipmentOption["engraving Effects"][i] = {};
					const name = v.replace(/(<([^>]+)>)/gi, "").split("+")[0];
					const value = v.replace(/(<([^>]+)>)/gi, "").split("+")[1];
					equipmentOption["engraving Effects"][i]["name"] = name;
					equipmentOption["engraving Effects"][i]["value"] = value;
				});
			}

			equipmentList.push({
				name: equipmentName,
				upgrade: equipmentUpgrade,
				parts: equipmentParts,
				level: equipmentLevel,
				quality: equipmentQuality,
				option: equipmentOption
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

    $("#profile-avatar > div.profile-avatar__slot")
		.find("div")
		.toArray()
		.forEach((v, i) => {
			const profile = JSON.parse(
				$("#profile-ability > script")
				.html()
				.replace("$.Profile = {", "{")
				.replace("};", "}")
			);

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

			if (avatarData["Element_005"]["value"]["Element_000"] && avatarData["Element_005"]["value"]["Element_000"].includes("기본 효과")) {
				avatarOption["basic"] = {};
				const avatarBasicName = avatarData["Element_005"]["value"]["Element_001"].replace(/(<([^>]+)>)/gi, "").split("+")[0].replace(/&/, "");
				const avatarBasicValue = avatarData["Element_005"]["value"]["Element_001"].replace(/(<([^>]+)>)/gi, "").split("+")[1];
				avatarOption["basic"]["name"] = avatarBasicName;
				avatarOption["basic"]["value"] = avatarBasicValue;
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

			if (avatarData["Element_006"]["value"]["titleStr"] && avatarData["Element_006"]["value"]["titleStr"].includes("성향")) {
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
		
	ctx.body = {
		result: "success",
		avatarList
	};
});

module.exports = api;