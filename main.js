const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
  try {
    // return await axios.get(
    //   "https://lostark.game.onstove.com/Profile/Character/%EB%AA%A8%EC%BD%94%EC%BD%94%EB%B3%BC%EB%94%B0%EA%B5%AC%EB%B9%A0%EB%8A%94%EC%86%8C%EB%A6%AC"
    // ); // 내 캐릭
    // return await axios.get(
    //   "https://lostark.game.onstove.com/Profile/Character/%EB%B0%A9%EC%9A%B8%ED%86%A0%EB%A7%88%ED%86%A0%EB%9D%BC%EB%A9%B4"
    // ); // 에스더 무기
    // return await axios.get(
    //   "https://lostark.game.onstove.com/Profile/Character/%EC%95%84%EC%9D%B8%EA%B1%B0%EA%B0%80%ED%8A%BC%EB%8D%B0"
    // ); // 장비 없는
    return await axios.get(
      "https://lostark.game.onstove.com/Profile/Character/%EB%91%90%EB%9D%BC%EB%94%94%EC%95%84"
    ); // 존재하지 않는
    
  } catch (error) {
    console.error(error);
  }
};

// 같은 서버의 다른 캐릭터 얻어오기
const characterAnother = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div")) {
      axios.response
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
        return;
      });

    return {
      characterServer,
      characterAnotherList,
    };
  });
};

const characterInfo = () => {
  getHtml()
    .then((html) => {
      const $ = cheerio.load(html.data);

      if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div")) {
        log("존재하지 않는 닉네임");
      }

      const nickname = $(
        "#lostark-wrapper > div > main > div > div.profile-character-info > span.profile-character-info__name"
      ).text();
      const server = $(
        "#lostark-wrapper > div > main > div > div.profile-character-info > span.profile-character-info__server"
      )
        .text()
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

      return {
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
    })
    .then(log);
};

const characterJewel = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div")) {
      log("존재하지 않는 닉네임");
    }

    const jewelList = [];

    const profile = JSON.parse(
      $("#profile-ability > script")
        .html()
        .replace("$.Profile = {", "{")
        .replace("};", "}")
    );

    $("#profile-jewel > div > div.jewel__wrap")
      .find(".jewel_btn")
      .toArray()
      .forEach((v) => {
        const jewelData = profile["Equip"][$(v).attr("data-item")];

        jewelList.push({
          name: jewelData["Element_000"]["value"].replace(/(<([^>]+)>)/gi, ""),
          grade: jewelData["Element_001"]["value"]["leftStr0"].replace(
            /(<([^>]+)>)/gi,
            ""
          ),
          tier: jewelData["Element_001"]["value"]["leftStr2"].replace(
            /(<([^>]+)>)/gi,
            ""
          ),
          effect: jewelData["Element_004"]["value"]["Element_001"].replace(
            /(<([^>]+)>)/gi,
            ""
          ),
        });
        return;
      });
  });
};

const characterCard = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div")) {
      log("존재하지 않는 닉네임");
    }

    const cardList = [];
    const cardEffect = [];
    const profile = JSON.parse(
      $("#profile-ability > script")
        .html()
        .replace("$.Profile = {", "{")
        .replace("};", "}")
    );

    $("#cardList")
      .find("li")
      .toArray()
      .forEach((v) => {
        const cardData =
          profile["Card"][$(v).find("div.card-slot").attr("data-item")];

        cardList.push({
          name: cardData["Element_000"]["value"].replace(/(<([^>]+)>)/gi, ""),
          description: cardData["Element_002"]["value"],
          awake: {
            count: cardData["Element_001"]["value"]["awakeCount"],
            total: cardData["Element_001"]["value"]["awakeTotal"],
          },
        });
      });

    $("#cardSetList")
      .find("li")
      .toArray()
      .forEach((v) => {
        const title = $(v).find("div.card-effect__title").text();
        const description = $(v).find("div.card-effect__dsc").text();

        cardEffect.push({ title, description });
      });

    const card = {
      card: cardList,
      set: cardEffect,
    };
  });
};

const characterSkill = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div")) {
      log("존재하지 않는 닉네임");
    }

    const skillList = [];

    $("#profile-skill > div.profile-skill-battle > div.profile-skill__list")
      .find("div.profile-skill__item")
      .toArray()
      .forEach((v) => {
        const skillData = JSON.parse(
          $(v).find("a.button--profile-skill").attr("data-skill")
        );
        if (skillData["tripodList"].length === 0) {
          skillList.push({
            name: skillData["name"],
            level: skillData["level"],
            type: skillData["type"].replace(/(<([^>]+)>)/gi, ""),
            tripod: {},
          });
        } else {
          skillList.push({
            name: skillData["name"],
            level: skillData["level"],
            type: skillData["type"].replace(/(<([^>]+)>)/gi, ""),
            tripod: {
              "0": {
                "0": {
                  name: skillData["tripodList"][0]["name"].replace(
                    /(<([^>]+)>)/gi,
                    ""
                  ),
                  description: skillData["tripodList"][0][
                    "description"
                  ].replace(/(<([^>]+)>)/gi, ""),
                  level: skillData["tripodList"][0]["featureLevel"],
                },
                "1": {
                  name: skillData["tripodList"][1]["name"].replace(
                    /(<([^>]+)>)/gi,
                    ""
                  ),
                  description: skillData["tripodList"][1][
                    "description"
                  ].replace(/(<([^>]+)>)/gi, ""),
                  level: skillData["tripodList"][1]["featureLevel"],
                },
                "2": {
                  name: skillData["tripodList"][2]["name"].replace(
                    /(<([^>]+)>)/gi,
                    ""
                  ),
                  description: skillData["tripodList"][2][
                    "description"
                  ].replace(/(<([^>]+)>)/gi, ""),
                  level: skillData["tripodList"][2]["featureLevel"],
                },
              },
              "1": {
                "0": {
                  name: skillData["tripodList"][3]["name"].replace(
                    /(<([^>]+)>)/gi,
                    ""
                  ),
                  description: skillData["tripodList"][3][
                    "description"
                  ].replace(/(<([^>]+)>)/gi, ""),
                  level: skillData["tripodList"][3]["featureLevel"],
                },
                "1": {
                  name: skillData["tripodList"][4]["name"].replace(
                    /(<([^>]+)>)/gi,
                    ""
                  ),
                  description: skillData["tripodList"][4][
                    "description"
                  ].replace(/(<([^>]+)>)/gi, ""),
                  level: skillData["tripodList"][4]["featureLevel"],
                },
                "2": {
                  name: skillData["tripodList"][5]["name"].replace(
                    /(<([^>]+)>)/gi,
                    ""
                  ),
                  description: skillData["tripodList"][5][
                    "description"
                  ].replace(/(<([^>]+)>)/gi, ""),
                  level: skillData["tripodList"][5]["featureLevel"],
                },
              },
              "2": {
                "0": {
                  name: skillData["tripodList"][6]["name"].replace(
                    /(<([^>]+)>)/gi,
                    ""
                  ),
                  description: skillData["tripodList"][6][
                    "description"
                  ].replace(/(<([^>]+)>)/gi, ""),
                  level: skillData["tripodList"][6]["featureLevel"],
                },
                "1": {
                  name: skillData["tripodList"][7]["name"].replace(
                    /(<([^>]+)>)/gi,
                    ""
                  ),
                  description: skillData["tripodList"][7][
                    "description"
                  ].replace(/(<([^>]+)>)/gi, ""),
                  level: skillData["tripodList"][7]["featureLevel"],
                },
              },
            },
          });
        }
      });
    log(skillList);
  });
};

const characterEquipment = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    if ($("#lostark-wrapper > div > main > div > div.profile-ingame > div")) {
      log("존재하지 않는 닉네임");
    }

    const equipmentList = [];
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
          return {};
        }
        
        let equipmentName = equipmentData["Element_000"][
          "value"
        ].replace(/(<([^>]+)>)/gi, "");
        let equipmentUpgrade = "0";

        if (equipmentName.includes("+")) {
          equipmentUpgrade = equipmentName.split(" ")[0];
          equipmentName = equipmentName.replace(equipmentUpgrade, "");
        }

        const equipmentParts = equipmentData["Element_001"]["value"][
          "leftStr0"
        ].replace(/(<([^>]+)>)/gi, "");
        const equipmentLevel = equipmentData["Element_001"]["value"][
          "leftStr2"
        ].replace(/(<([^>]+)>)/gi, "");
        const equipmentQuality =
          equipmentData["Element_001"]["value"]["qualityValue"];
        const equipmentOption = {};

        if (
          equipmentData["Element_005"]["value"]["Element_000"].includes(
            "기본 효과"
          )
        ) {
          equipmentOption["basic"] = {};
          const equipmentBasicList =
            equipmentData["Element_005"]["value"]["Element_001"].split("<BR>");
          for (let i = 0; equipmentBasicList.length > i; i++) {
            if (equipmentBasicList[i].includes("<")) {
              equipmentBasicList[i] = equipmentBasicList[i].replace(/(<([^>]+)>)/gi, "");
            }
            const equipmentBasicName = equipmentBasicList[i].split("+")[0];
            const equipmentBasicValue = equipmentBasicList[i].split("+")[1];
            equipmentOption["basic"][equipmentBasicName] = equipmentBasicValue;
          }

          if (
            equipmentData["Element_006"]["value"]["Element_000"].includes("추가 효과")
          ) {
            equipmentOption["plus"] = {};
            const equipmentPlusList = equipmentData["Element_006"]["value"]["Element_001"].split("<BR>");
            for (let i = 0; equipmentPlusList.length > i; i++) {
              const equipmentPlusName = equipmentPlusList[i].split("+")[0];
              const equipmentPlusValue = equipmentPlusList[i].split("+")[1];
              equipmentOption["plus"][equipmentPlusName] = equipmentPlusValue;
            }
          }

          if (
            equipmentData["Element_000"]["value"].includes("+25") // 25 재련 장비
          ) {
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
          }
          else if (
            equipmentData["Element_008"]["value"]["Element_000"] && equipmentData["Element_008"]["value"]["Element_000"]["topStr"].includes("트라이포드 효과") // 에스더 등급 이하 장비
          ) {
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
          } else if (
            equipmentData["Element_009"]["value"]["Element_000"] && equipmentData["Element_009"]["value"]["Element_000"]["topStr"].includes("트라이포드 효과") // 에스더 무기
          ) {
            log("에스더 무기");
          } else { // 목걸이, 귀걸이, 반지
            equipmentOption["engraving Effects"] = {};
            const equipmentEngravingEffectList = equipmentData["Element_007"]["value"]["Element_001"].split("<BR>");
            equipmentEngravingEffectList.forEach((v, i) => {
              equipmentOption["engraving Effects"][i] = {};
              const name = v.replace(/(<([^>]+)>)/gi, "").split("+")[0];
              const value = v.replace(/(<([^>]+)>)/gi, "").split("+")[1];
              equipmentOption["engraving Effects"][i]["name"] = name;
              equipmentOption["engraving Effects"][i]["value"] = value;
            });
          }
      }

        if (
          equipmentData["Element_001"]["value"]["leftStr0"].includes("어빌리티 스톤") // 어빌리티 스톤
        ) {
          equipmentOption["basic"] = {};
          const equipmentBasicName = equipmentData["Element_004"]["value"]["Element_001"].split("+")[0];
          const equipmentBasicValue = equipmentData["Element_004"]["value"]["Element_001"].split("+")[1];
          equipmentOption["basic"][equipmentBasicName] = equipmentBasicValue;

          if (equipmentData["Element_005"]["value"]["Element_001"].includes("세공 단계 보너스")) {
            equipmentOption["reforge Bonus"]["Element_000"] = equipmentData["Element_005"]["vlaue"]["Element_001"];
          }

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

        if (
          equipmentData["Element_005"]["value"]["Element_000"].includes("팔찌 효과") // 팔찌
        ) {
          equipmentOption["bracelet Effects"] = {};
          const equipmentBraceletEffectList = equipmentData["Element_005"]["value"]["Element_001"].split("<BR>");
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
      log(equipmentList);
  });
};

characterAnother();
