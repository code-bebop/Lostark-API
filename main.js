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
    const expeditionLevel = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info > div.level-info__expedition > span:nth-child(2)').text();
    const battleLevel = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info > div.level-info__item > span:nth-child(2)').text();
    const gearLevel = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info2 > div.level-info2__expedition > span:nth-child(2)').text();
    const gearMaxLevel = $('#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info2 > div.level-info2__item > span:nth-child(2)').text();
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

const characterJewel = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    const jewelList = [];

    const profile = JSON.parse($('#profile-ability > script').html().replace('$.Profile = {', '{').replace('};', '}'));

    $('#profile-jewel > div > div.jewel__wrap').find('.jewel_btn').toArray().forEach((v) => {
      const jewelData = profile['Equip'][$(v).attr('data-item')];

      jewelList.push({
        name: jewelData['Element_000']['value'].replace(/(<([^>]+)>)/ig,""),
        grade: jewelData['Element_001']['value']['leftStr0'].replace(/(<([^>]+)>)/ig,""),
        tier: jewelData['Element_001']['value']['leftStr2'].replace(/(<([^>]+)>)/ig,""),
        effect: jewelData['Element_004']['value']['Element_001'].replace(/(<([^>]+)>)/ig,"")
      });
      return;
    });
  })
}

const characterCard = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);
    
    const cardList = [];
    const cardEffect = [];
    const profile = JSON.parse($('#profile-ability > script').html().replace('$.Profile = {', '{').replace('};', '}'));

    $('#cardList').find('li').toArray().forEach((v) => {
      const cardData = profile['Card'][$(v).find('div.card-slot').attr('data-item')];

      cardList.push({
        name: cardData['Element_000']['value'].replace(/(<([^>]+)>)/ig,""),
        description: cardData['Element_002']['value'],
        awake: {
          count: cardData['Element_001']['value']['awakeCount'],
          total: cardData['Element_001']['value']['awakeTotal']
        }
      });
      
    });

    $('#cardSetList').find('li').toArray().forEach((v) => {
      const title = $(v).find('div.card-effect__title').text();
      const description = $(v).find('div.card-effect__dsc').text();

      cardEffect.push({ title, description });
    })

    const card = {
      'card': cardList,
      'set': cardEffect
    };
  })
}

const characterSkill = () => {
  getHtml().then((html) => {
    const $ = cheerio.load(html.data);

    const skillList = [];

    $('#profile-skill > div.profile-skill-battle > div.profile-skill__list').find('div.profile-skill__item').toArray().forEach((v) => {
      const skillData = JSON.parse($(v).find('a.button--profile-skill').attr('data-skill'));
      if(skillData['tripodList'].length === 0) {
        skillList.push({
          'name': skillData['name'],
          'level': skillData['level'],
          'type': skillData['type'].replace(/(<([^>]+)>)/ig,""),
          'tripod': {}
        });
      } else {
        skillList.push({
          'name': skillData['name'],
          'level': skillData['level'],
          'type': skillData['type'].replace(/(<([^>]+)>)/ig,""),
          'tripod': {
            '0': {
              '0': {
                'name': skillData['tripodList'][0]['name'].replace(/(<([^>]+)>)/ig,""),
                'description': skillData['tripodList'][0]['description'].replace(/(<([^>]+)>)/ig,""),
                'level': skillData['tripodList'][0]['featureLevel'],
              },
              '1': {
                'name': skillData['tripodList'][1]['name'].replace(/(<([^>]+)>)/ig,""),
                'description': skillData['tripodList'][1]['description'].replace(/(<([^>]+)>)/ig,""),
                'level': skillData['tripodList'][1]['featureLevel'],
              },
              '2': {
                'name': skillData['tripodList'][2]['name'].replace(/(<([^>]+)>)/ig,""),
                'description': skillData['tripodList'][2]['description'].replace(/(<([^>]+)>)/ig,""),
                'level': skillData['tripodList'][2]['featureLevel'],
              }
            },
            '1': {
              '0': {
                'name': skillData['tripodList'][3]['name'].replace(/(<([^>]+)>)/ig,""),
                'description': skillData['tripodList'][3]['description'].replace(/(<([^>]+)>)/ig,""),
                'level': skillData['tripodList'][3]['featureLevel'],
              },
              '1': {
                'name': skillData['tripodList'][4]['name'].replace(/(<([^>]+)>)/ig,""),
                'description': skillData['tripodList'][4]['description'].replace(/(<([^>]+)>)/ig,""),
                'level': skillData['tripodList'][4]['featureLevel'],
              },
              '2': {
                'name': skillData['tripodList'][5]['name'].replace(/(<([^>]+)>)/ig,""),
                'description': skillData['tripodList'][5]['description'].replace(/(<([^>]+)>)/ig,""),
                'level': skillData['tripodList'][5]['featureLevel'],
              }
            },
            '2': {
              '0': {
                'name': skillData['tripodList'][6]['name'].replace(/(<([^>]+)>)/ig,""),
                'description': skillData['tripodList'][6]['description'].replace(/(<([^>]+)>)/ig,""),
                'level': skillData['tripodList'][6]['featureLevel'],
              },
              '1': {
                'name': skillData['tripodList'][7]['name'].replace(/(<([^>]+)>)/ig,""),
                'description': skillData['tripodList'][7]['description'].replace(/(<([^>]+)>)/ig,""),
                'level': skillData['tripodList'][7]['featureLevel'],
              }
            }
          }
        })
      }        
    })
    log(skillList);
  })
}

characterSkill();