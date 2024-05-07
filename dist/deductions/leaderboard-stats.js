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
const getLatestIssue = () => {
    const currentDate = new Date();
    currentDate.setMilliseconds(0);
    currentDate.setSeconds(0);
    currentDate.setMinutes(0);
    if (currentDate.getHours() < 18) {
        currentDate.setTime(currentDate.getTime() - (24 * 60 * 60 * 1000));
    }
    currentDate.setHours(17);
    return Math.floor(currentDate.getTime() / 1000);
};
const getUrlForIssue = () => {
    const issueDate = getLatestIssue();
    return `${leaderboardUrl}?issue=${issueDate}`;
};
/**
 * fetches leaderboard data for a given issue
 */
function fetchLeaderboardData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = getUrlForIssue();
            const response = yield fetch(url);
            return response.json();
        }
        catch (e) {
            console.log(`error fetching data`);
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
