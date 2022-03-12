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
  .then((res) => log(res));
};
