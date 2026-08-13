/***
 * 原脚本：https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/streaming-ui-check.js
 * 适配 Surge Panel 版本
 * 支持：YouTube Premium / Netflix / Disney+ / DAZN / Paramount+ / Discovery+ / ChatGPT
 ***/

const BASE_URL = 'https://www.netflix.com/title/';
const BASE_URL_YTB = "https://www.youtube.com/premium";
const BASE_URL_Dazn = "https://startup.core.indazn.com/misl/v5/Startup";
const BASE_URL_Param = "https://www.paramountplus.com/";
const FILM_ID = 81280792;
const BASE_URL_Discovery_token = "https://us1-prod-direct.discoveryplus.com/token?deviceId=d1a4a5d25212400d1e6985984604d740&realm=go&shortlived=true";
const BASE_URL_Discovery = "https://us1-prod-direct.discoveryplus.com/users/me";
const BASE_URL_GPT = 'https://chat.openai.com/';
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36';
const arrow = " ➟ ";

const STATUS_COMING = 2;
const STATUS_AVAILABLE = 1;
const STATUS_NOT_AVAILABLE = 0;
const STATUS_TIMEOUT = -1;
const STATUS_ERROR = -2;

const flags = new Map([
  ["AC","🇦🇨"],["AE","🇦🇪"],["AF","🇦🇫"],["AI","🇦🇮"],["AL","🇦🇱"],["AM","🇦🇲"],["AQ","🇦🇶"],["AR","🇦🇷"],["AS","🇦🇸"],["AT","🇦🇹"],["AU","🇦🇺"],["AW","🇦🇼"],["AX","🇦🇽"],["AZ","🇦🇿"],
  ["BA","🇧🇦"],["BB","🇧🇧"],["BD","🇧🇩"],["BE","🇧🇪"],["BF","🇧🇫"],["BG","🇧🇬"],["BH","🇧🇭"],["BI","🇧🇮"],["BJ","🇧🇯"],["BM","🇧🇲"],["BN","🇧🇳"],["BO","🇧🇴"],["BR","🇧🇷"],["BS","🇧🇸"],["BT","🇧🇹"],["BV","🇧🇻"],["BW","🇧🇼"],["BY","🇧🇾"],["BZ","🇧🇿"],
  ["CA","🇨🇦"],["CF","🇨🇫"],["CH","🇨🇭"],["CK","🇨🇰"],["CL","🇨🇱"],["CM","🇨🇲"],["CN","🇨🇳"],["CO","🇨🇴"],["CP","🇨🇵"],["CR","🇨🇷"],["CU","🇨🇺"],["CV","🇨🇻"],["CW","🇨🇼"],["CX","🇨🇽"],["CY","🇨🇾"],["CZ","🇨🇿"],
  ["DE","🇩🇪"],["DG","🇩🇬"],["DJ","🇩🇯"],["DK","🇩🇰"],["DM","🇩🇲"],["DO","🇩🇴"],["DZ","🇩🇿"],["EA","🇪🇦"],["EC","🇪🇨"],["EE","🇪🇪"],["EG","🇪🇬"],["EH","🇪🇭"],["ER","🇪🇷"],["ES","🇪🇸"],["ET","🇪🇹"],["EU","🇪🇺"],
  ["FI","🇫🇮"],["FJ","🇫🇯"],["FK","🇫🇰"],["FM","🇫🇲"],["FO","🇫🇴"],["FR","🇫🇷"],["GA","🇬🇦"],["GB","🇬🇧"],["HK","🇭🇰"],["HU","🇭🇺"],["ID","🇮🇩"],["IE","🇮🇪"],["IL","🇮🇱"],["IM","🇮🇲"],["IN","🇮🇳"],["IS","🇮🇸"],["IT","🇮🇹"],
  ["JP","🇯🇵"],["KR","🇰🇷"],["LU","🇱🇺"],["MO","🇲🇴"],["MX","🇲🇽"],["MY","🇲🇾"],["NL","🇳🇱"],["PH","🇵🇭"],["RO","🇷🇴"],["RS","🇷🇸"],["RU","🇷🇺"],["RW","🇷🇼"],["SA","🇸🇦"],["SB","🇸🇧"],["SC","🇸🇨"],["SD","🇸🇩"],["SE","🇸🇪"],["SG","🇸🇬"],
  ["TH","🇹🇭"],["TN","🇹🇳"],["TO","🇹🇴"],["TR","🇹🇷"],["TV","🇹🇻"],["TW","🇨🇳"],["UK","🇬🇧"],["UM","🇺🇲"],["US","🇺🇸"],["UY","🇺🇾"],["UZ","🇺🇿"],["VA","🇻🇦"],["VE","🇻🇪"],["VG","🇻🇬"],["VI","🇻🇮"],["VN","🇻🇳"],["ZA","🇿🇦"]
]);

let result = {
  "YouTube": "YouTube: 检测失败 ❗️",
  "Netflix": "Netflix: 检测失败 ❗️",
  "Dazn": "DAZN: 检测失败 ❗️",
  "Disney": "Disney+: 检测失败 ❗️",
  "Paramount": "Paramount+: 检测失败 ❗️",
  "Discovery": "Discovery+: 检测失败 ❗️",
  "ChatGPT": "ChatGPT: 检测失败 ❗️"
};

const support_countryCodes = ["T1","XX","AL","DZ","AD","AO","AG","AR","AM","AU","AT","AZ","BS","BD","BB","BE","BZ","BJ","BT","BA","BW","BR","BG","BF","CV","CA","CL","CO","KM","CR","HR","CY","DK","DJ","DM","DO","EC","SV","EE","FJ","FI","FR","GA","GM","GE","DE","GH","GR","GD","GT","GN","GW","GY","HT","HN","HU","IS","IN","ID","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KW","KG","LV","LB","LS","LR","LI","LT","LU","MG","MW","MY","MV","ML","MT","MH","MR","MU","MX","MC","MN","ME","MA","MZ","MM","NA","NR","NP","NL","NZ","NI","NE","NG","MK","NO","OM","PK","PW","PA","PG","PE","PH","PL","PT","QA","RO","RW","KN","LC","VC","WS","SM","ST","SN","RS","SC","SL","SG","SK","SI","SB","ZA","ES","LK","SR","SE","CH","TH","TG","TO","TT","TN","TR","TV","UG","AE","US","UY","VU","ZM","BO","BN","CG","CZ","VA","FM","MD","PS","KR","TW","TZ","TL","GB"];

(async () => {
  let panel = {
    title: "📺 流媒体解锁查询",
    content: "检测中...",
    icon: "play.tv.fill",
    "icon-color": "#FF2D55"
  };

  try {
    await Promise.all([
      testYTB(),
      testNf(FILM_ID),
      testDazn(),
      testParam(),
      testDiscovery(),
      testChatGPT(),
      (async () => {
        let { region, status } = await testDisneyPlus();
        if (status === STATUS_COMING) {
          result["Disney"] = "Disney+: 即将登陆 " + arrow + "⟦" + (flags.get(region?.toUpperCase()) || region) + "⟧ ⚠️";
        } else if (status === STATUS_AVAILABLE) {
          result["Disney"] = "Disney+: 支持 " + arrow + "⟦" + (flags.get(region?.toUpperCase()) || region) + "⟧ 🎉";
        } else if (status === STATUS_NOT_AVAILABLE) {
          result["Disney"] = "Disney+: 未支持 🚫";
        } else if (status === STATUS_TIMEOUT) {
          result["Disney"] = "Disney+: 检测超时 🚦";
        } else {
          result["Disney"] = "Disney+: 检测异常 ❗️";
        }
      })()
    ]);

    panel.content = [
      result["YouTube"],
      result["Netflix"],
      result["Disney"],
      result["Dazn"],
      result["Paramount"],
      result["Discovery"],
      result["ChatGPT"]
    ].join("\n");

  } catch (e) {
    panel.content = "检测异常，请重试";
    console.log(e);
  }

  $done(panel);
})();

function timeout(delay = 5000) {
  return new Promise((_, reject) => setTimeout(() => reject('Timeout'), delay));
}

// ---------- Disney+ ----------
async function testDisneyPlus() {
  try {
    let { region, cnbl } = await Promise.race([testHomePage(), timeout(7000)]);
    let { countryCode, inSupportedLocation } = await Promise.race([getLocationInfo(), timeout(7000)]);
    region = countryCode ?? region;
    if (inSupportedLocation === false || inSupportedLocation === 'false') {
      return { region, status: STATUS_COMING };
    }
    return { region, status: STATUS_AVAILABLE };
  } catch (error) {
    if (error === 'Not Available') return { status: STATUS_NOT_AVAILABLE };
    if (error === 'Timeout') return { status: STATUS_TIMEOUT };
    return { status: STATUS_ERROR };
  }
}

function getLocationInfo() {
  return new Promise((resolve, reject) => {
    $httpClient.post({
      url: 'https://disney.api.edge.bamgrid.com/graph/v1/device/graphql',
      headers: {
        'Accept-Language': 'en',
        "Authorization": 'ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84',
        'Content-Type': 'application/json',
        'User-Agent': UA,
      },
      body: JSON.stringify({
        query: 'mutation registerDevice($input: RegisterDeviceInput!) { registerDevice(registerDevice: $input) { grant { grantType assertion } } }',
        variables: {
          input: {
            applicationRuntime: 'chrome',
            attributes: {
              browserName: 'chrome',
              browserVersion: '94.0.4606',
              manufacturer: 'apple',
              model: null,
              operatingSystem: 'macintosh',
              operatingSystemVersion: '10.15.7',
              osDeviceIds: [],
            },
            deviceFamily: 'browser',
            deviceLanguage: 'en',
            deviceProfile: 'macosx',
          },
        },
      }),
    }, (error, response, data) => {
      if (error || response.status !== 200) {
        reject('Not Available');
        return;
      }
      try {
        let json = JSON.parse(data);
        let { token: { accessToken }, session: { inSupportedLocation, location: { countryCode } } } = json?.extensions?.sdk;
        resolve({ inSupportedLocation, countryCode, accessToken });
      } catch (e) {
        reject('Not Available');
      }
    });
  });
}

function testHomePage() {
  return new Promise((resolve, reject) => {
    $httpClient.get({
      url: 'https://www.disneyplus.com/',
      headers: { 'Accept-Language': 'en', 'User-Agent': UA },
    }, (error, response, data) => {
      if (error || response.status !== 200 || data.indexOf('not available in your region') !== -1) {
        reject('Not Available');
        return;
      }
      let match = data.match(/Region: ([A-Za-z]{2})[\s\S]*?CNBL: ([12])/);
      if (!match) {
        resolve({ region: '', cnbl: '' });
      } else {
        resolve({ region: match[1], cnbl: match[2] });
      }
    });
  });
}

// ---------- Netflix ----------
function testNf(filmId) {
  return new Promise((resolve) => {
    $httpClient.get({
      url: BASE_URL + filmId,
      headers: { 'User-Agent': UA },
    }, (error, response, data) => {
      if (error) {
        result["Netflix"] = "Netflix: 检测超时 🚦";
        resolve();
        return;
      }
      if (response.status === 404) {
        result["Netflix"] = "Netflix: 支持自制剧集 ⚠️";
      } else if (response.status === 403) {
        result["Netflix"] = "Netflix: 未支持 🚫";
      } else if (response.status === 200) {
        let url = response.headers['x-originating-url'] || response.headers['X-Originating-URL'] || '';
        let region = url.split('/')[3] || 'us';
        region = region.split('-')[0];
        if (region === 'title') region = 'us';
        result["Netflix"] = "Netflix: 完整支持" + arrow + "⟦" + (flags.get(region.toUpperCase()) || region) + "⟧ 🎉";
      } else {
        result["Netflix"] = "Netflix: 检测失败 ❗️";
      }
      resolve();
    });
  });
}

// ---------- YouTube ----------
function testYTB() {
  return new Promise((resolve) => {
    $httpClient.get({
      url: BASE_URL_YTB,
      headers: { 'User-Agent': UA },
    }, (error, response, data) => {
      if (error || response.status !== 200) {
        result["YouTube"] = "YouTube Premium: 检测失败 ❗️";
        resolve();
        return;
      }
      if (data.indexOf('Premium is not available in your country') !== -1) {
        result["YouTube"] = "YouTube Premium: 未支持 🚫";
      } else {
        let region = '';
        let re = new RegExp('"GL":"(.*?)"', 'gm');
        let ret = re.exec(data);
        if (ret && ret.length === 2) region = ret[1];
        else if (data.indexOf('www.google.cn') !== -1) region = 'CN';
        else region = 'US';
        result["YouTube"] = "YouTube Premium: 支持 " + arrow + "⟦" + (flags.get(region.toUpperCase()) || region) + "⟧ 🎉";
      }
      resolve();
    });
  });
}

// ---------- DAZN ----------
function testDazn() {
  return new Promise((resolve) => {
    $httpClient.post({
      url: BASE_URL_Dazn,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
        "Content-Type": "application/json"
      },
      body: `{"LandingPageKey":"generic","Platform":"web","PlatformAttributes":{},"Manufacturer":"","PromoCode":"","Version":"2"}`
    }, (error, response, data) => {
      if (error || response.status !== 200) {
        result["Dazn"] = "DAZN: 检测失败 ❗️";
        resolve();
        return;
      }
      let re = new RegExp('"GeolocatedCountry":"(.*?)"', 'gm');
      let ret = re.exec(data);
      if (ret && ret.length === 2) {
        let region = ret[1];
        result["Dazn"] = "DAZN: 支持 " + arrow + "⟦" + (flags.get(region.toUpperCase()) || region) + "⟧ 🎉";
      } else {
        result["Dazn"] = "DAZN: 未支持 🚫";
      }
      resolve();
    });
  });
}

// ---------- Paramount+ ----------
function testParam() {
  return new Promise((resolve) => {
    $httpClient.get({
      url: BASE_URL_Param,
      headers: { 'User-Agent': UA },
    }, (error, response, data) => {
      if (error) {
        result["Paramount"] = "Paramount+: 检测超时 🚦";
      } else if (response.status === 200) {
        result["Paramount"] = "Paramount+: 支持 🎉";
      } else {
        result["Paramount"] = "Paramount+: 未支持 🚫";
      }
      resolve();
    });
  });
}

// ---------- Discovery+ ----------
function testDiscovery() {
  return new Promise((resolve) => {
    $httpClient.get({
      url: BASE_URL_Discovery_token,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36' },
    }, (error, response, data) => {
      if (error || response.status !== 200) {
        result["Discovery"] = "Discovery+: 检测失败 ❗️";
        resolve();
        return;
      }
      try {
        let token = JSON.parse(data)["data"]["attributes"]["token"];
        let cookie = `_gcl_au=1.1.858579665.1632206782; st=${token}; gi_ls=0`;
        $httpClient.get({
          url: BASE_URL_Discovery,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
            "Cookie": cookie,
          },
        }, (err2, resp2, body2) => {
          if (err2 || resp2.status !== 200) {
            result["Discovery"] = "Discovery+: 检测失败 ❗️";
          } else {
            try {
              let locationd = JSON.parse(body2)["data"]["attributes"]["currentLocationTerritory"];
              result["Discovery"] = locationd === "us" ? "Discovery+: 支持 🎉" : "Discovery+: 未支持 🚫";
            } catch (e) {
              result["Discovery"] = "Discovery+: 检测失败 ❗️";
            }
          }
          resolve();
        });
      } catch (e) {
        result["Discovery"] = "Discovery+: 检测失败 ❗️";
        resolve();
      }
    });
  });
}

// ---------- ChatGPT ----------
function testChatGPT() {
  return new Promise((resolve) => {
    $httpClient.get({
      url: BASE_URL_GPT,
    }, (error, response, data) => {
      if (error) {
        result["ChatGPT"] = "ChatGPT: 检测失败 ❗️";
        resolve();
        return;
      }
      // 简单判断是否被拦截
      let respStr = JSON.stringify(response);
      if (respStr.indexOf("text/plain") !== -1) {
        result["ChatGPT"] = "ChatGPT: 未支持 🚫";
        resolve();
        return;
      }
      $httpClient.get({
        url: Region_URL_GPT,
      }, (err2, resp2, body2) => {
        if (err2 || !body2) {
          result["ChatGPT"] = "ChatGPT: 检测失败 ❗️";
          resolve();
          return;
        }
        try {
          let region = body2.split("loc=")[1].split("\n")[0];
          if (support_countryCodes.indexOf(region) !== -1) {
            result["ChatGPT"] = "ChatGPT: 支持 " + arrow + "⟦" + (flags.get(region.toUpperCase()) || region) + "⟧ 🎉";
          } else {
            result["ChatGPT"] = "ChatGPT: 未支持 🚫";
          }
        } catch (e) {
          result["ChatGPT"] = "ChatGPT: 检测失败 ❗️";
        }
        resolve();
      });
    });
  });
}
