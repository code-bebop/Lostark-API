const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
  try {
    return await axios.get(
      "https://lostark.game.onstove.com/Profile/Character/%EB%AA%A8%EC%BD%94%EC%BD%94%EB%B3%BC%EB%94%B0%EA%B5%AC%EB%B9%A0%EB%8A%94%EC%86%8C%EB%A6%AC"
    );
  } catch (error) {
    console.error(error);
  }
};

// 같은 서버의 다른 캐릭터 얻어오기
const characterAnother = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    const characterServer = $("#expand-character-list > strong")
      .text()
      .replace("@", "");
      
    const characterAnotherList = [];
    $("#expand-character-list > ul > li")
      .toArray()
      .forEach((v) => {
        const characterLevel = $(v).find("button").text().replace($(v).find("button > span").text(), "").trim();
        const characterName = $(v).find("button > span").text();
        characterAnotherList.push({ characterLevel ,characterName });
        return;
      });

    return {
      characterServer,
      characterAnotherList
    };
  })
};

const characterInfo = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    const nickname = $('#lostark-wrapper > div > main > div > div.profile-character-info > span.profile-character-info__name').text();
    const server = $('#lostark-wrapper > div > main > div > div.profile-character-info > span.profile-character-info__server').text().replace("@", "");
    const expeditionLevel = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info > div.level-info__expedition > span:nth-child(2)').text().trim();
    const battleLevel = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info > div.level-info__item > span:nth-child(2)').text().trim();
    const gearLevel = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info2 > div.level-info2__expedition > span:nth-child(2)').text().trim();
    const gearMaxLevel = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info2 > div.level-info2__item > span:nth-child(2)').text().trim();
    const title = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.game-info__title > span:nth-child(2)').text();
    const guild = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.game-info__guild > span:nth-child(2)').text();
    const pvp = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.level-info__pvp > span:nth-child(2)').text();
    const wisdomName = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.game-info__wisdom > span:nth-child(3)').text();
    const wisdomLevel = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.game-info > div.game-info__wisdom > span:nth-child(2)').text();
    const basicAttack = $('#profile-ability > div.profile-ability-basic > ul > li:nth-child(1) > span:nth-child(2)').text();
    const basicHP = $('#profile-ability > div.profile-ability-basic > ul > li:nth-child(2) > span:nth-child(2)').text();
    const crit = $('#profile-ability > div.profile-ability-battle > ul > li:nth-child(1) > span:nth-child(2)').text();
    const specialization = $('#profile-ability > div.profile-ability-battle > ul > li:nth-child(2) > span:nth-child(2)').text();
    const domination = $('#profile-ability > div.profile-ability-battle > ul > li:nth-child(3) > span:nth-child(2)').text();
    const swiftness = $('#profile-ability > div.profile-ability-battle > ul > li:nth-child(4) > span:nth-child(2)').text();
    const endurance = $('#profile-ability > div.profile-ability-battle > ul > li:nth-child(5) > span:nth-child(2)').text();
    const expertise = $('#profile-ability > div.profile-ability-battle > ul > li:nth-child(6) > span:nth-child(2)').text();
    const engraveList = [];
    $('#profile-ability > div.profile-ability-engrave > div > div.swiper-wrapper').find('li').toArray().forEach((v) => {
      const engraveName = $(v).find('span').text();
      const engraveDescription = $(v).find('p').text();
      engraveList.push({
        name: engraveName,
        description: engraveDescription
      })
    });
    const virtuesList = $('body > script:nth-child(12)').html().split("value: [")[1].split("],")[0].replace(/\n/g, "").replace(/\s*/g, "").split(",");
    const virtues = {
      'wisdom': virtuesList[0],
      'courage': virtuesList[1],
      'charisma': virtuesList[2],
      'kindness': virtuesList[3]
    };

    return {
      nickname,
      server,
      level: {
        expedition: expeditionLevel,
        battle: battleLevel,
        gear: {
          level: gearLevel,
          maxLevel: gearMaxLevel 
        }
      },
      title,
      guild,
      pvp,
      wisdom: {
        level: wisdomLevel,
        name: wisdomName
      },
      basic: {
        attack: basicAttack,
        HP: basicHP
      },
      battle: {
        crit,
        specialization,
        domination,
        swiftness,
        endurance,
        expertise
      },
      engrave: engraveList,
      virtues
    }
  })
  .then(log);
}

characterInfo();