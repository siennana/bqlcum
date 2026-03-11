var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from './leaderboard-users.js';
const leaderboardUrl = 'https://40ae5vnl08.execute-api.eu-central-1.amazonaws.com/default/dailydeductions';
const users = {};
/**
 * returns latest date which has passed 5pm EST
 */
function getLatestIssue() {
    const now = new Date();
    // Read the current wall-clock time in New York
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const get = (type) => { var _a, _b; return (_b = (_a = parts.find((p) => p.type === type)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ""; };
    let year = Number(get("year"));
    let month = Number(get("month"));
    let day = Number(get("day"));
    const hour = Number(get("hour"));
    // Before 6 PM NY time, use the previous day's issue
    if (hour < 18) {
        const nyMidnightUtc = new Date(Date.UTC(year, month - 1, day));
        nyMidnightUtc.setUTCDate(nyMidnightUtc.getUTCDate() - 1);
        year = nyMidnightUtc.getUTCFullYear();
        month = nyMidnightUtc.getUTCMonth() + 1;
        day = nyMidnightUtc.getUTCDate();
    }
    // Build 5:00 PM in New York for that date, accounting for DST automatically
    return getZonedTimestamp(year, month, day, 17, 0, 0, "America/New_York");
}
function getZonedTimestamp(year, month, day, hour, minute, second, timeZone) {
    var _a, _b, _c;
    // Start with the naive UTC time for those components
    const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
    // Figure out what offset the target timezone has at that instant
    const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "shortOffset",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
    const parts = dtf.formatToParts(new Date(utcGuess));
    const tzName = (_b = (_a = parts.find((p) => p.type === "timeZoneName")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "GMT-5";
    // Examples: GMT-5, GMT-4
    const match = tzName.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
    if (!match) {
        throw new Error(`Could not parse timezone offset: ${tzName}`);
    }
    const sign = match[1] === "+" ? 1 : -1;
    const offsetHours = Number(match[2]);
    const offsetMinutes = Number((_c = match[3]) !== null && _c !== void 0 ? _c : "0");
    const totalOffsetMinutes = sign * (offsetHours * 60 + offsetMinutes);
    // Convert "5 PM in New York" into UTC timestamp
    return Math.floor((utcGuess - totalOffsetMinutes * 60000) / 1000);
}
const getUrlForIssue = () => {
    const issueDate = getLatestIssue();
    console.log(issueDate);
    return `${leaderboardUrl}?issue=${issueDate}`;
};
/**
 * fetches leaderboard data for a given issue
 */
function fetchLeaderboardData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = getUrlForIssue();
            console.log(url);
            const response = yield fetch(url);
            return response.json();
        }
        catch (e) {
            console.log(`error fetching data`, e);
            return [];
        }
    });
}
;
export function postLeaderboardData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = getUrlForIssue();
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(`{'flag': 'US', 'name': ${data}}`)
            });
            return response.json();
        }
        catch (e) {
            console.log('error posting to leaderboard');
        }
    });
}
const statusButtonClick = (id) => {
    var _a;
    const statusBtn = document.getElementById(id);
    const parentId = ((_a = statusBtn === null || statusBtn === void 0 ? void 0 : statusBtn.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode).id;
    const btnData = id.split('_');
    const user = users[parentId];
    let txt = 0;
    if (btnData[1] === 'like') {
        user.likes++;
        txt = user.likes;
    }
    else if (btnData[1] === 'dislike') {
        user.dislikes++;
        txt = user.dislikes;
    }
    if (statusBtn instanceof HTMLButtonElement) {
        if (statusBtn.lastChild) {
            statusBtn.removeChild(statusBtn.lastChild);
            statusBtn.appendChild(document.createTextNode(`${txt}`));
        }
        const stats = JSON.stringify(users, null, 2);
    }
};
const createButton = (id, val) => {
    const button = document.createElement("button");
    const btnData = id.split('_');
    const img = document.createElement("img");
    if (btnData[1] === 'like') {
        img.src = './../assets/noun-love-6212830.png';
    }
    else if (btnData[1] === 'dislike') {
        img.src = './../assets/noun-middle-finger-241675.png';
    }
    button.id = id;
    button.onclick = () => statusButtonClick(button.id);
    button.appendChild(img);
    button.appendChild(document.createTextNode(`${val}`));
    return button;
};
/*
 * gets formatted leaderboard data and adds to DOM
 */
function getLeaderboardData() {
    return __awaiter(this, void 0, void 0, function* () {
        const rawData = yield fetchLeaderboardData();
        if (!rawData || !Array.isArray(rawData)) {
            console.log('no leaderboard data available');
            return;
        }
        // sort by created_by date
        const sortedData = rawData.sort((a, b) => {
            return a.created_at - b.created_at;
        });
        const formattedData = sortedData.map((resObj) => {
            return {
                name: resObj['name'],
                created_at: new Date(resObj['created_at'])
            };
        });
        const dataElement = document.getElementById('data');
        if (dataElement) {
            formattedData.forEach((obj, i) => {
                let ext = '';
                switch (obj.name) {
                    case 'BCQ': {
                        ext = '8==D~~~';
                        break;
                    }
                    case 'ABF': {
                        ext = 'ಠ__ಠ';
                        break;
                    }
                    case 'SKB': {
                        ext = '(-_-)';
                        break;
                    }
                    case 'TLM': {
                        ext = '(/◕ヮ◕)/';
                        break;
                    }
                    case 'LLB': {
                        ext = 'ᕕ( ᐛ )ᕗ ';
                        break;
                    }
                    case 'TRI': {
                        ext = '(╯°□°）╯︵ ┻━┻';
                        break;
                    }
                }
                const s = `${i + 1}. ${obj.name} completed at ${new Date(obj.created_at).toLocaleTimeString()} ${ext}`;
                const newDiv = document.createElement("div");
                newDiv.id = `${i}`;
                newDiv.textContent = s;
                //const btnDiv = document.createElement('div');
                //btnDiv.appendChild(createButton(`${i}_like`, 0));
                //btnDiv.appendChild(createButton(`${i}_dislike`, 0));
                //newDiv.appendChild(btnDiv);
                dataElement.appendChild(newDiv);
                users[newDiv.id] = new User(0, 0);
            });
        }
    });
}
getLeaderboardData();
