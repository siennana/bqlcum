var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const leaderboardUrl = 'https://40ae5vnl08.execute-api.eu-central-1.amazonaws.com/default/dailydeductions';
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
            formattedData.forEach((obj) => {
                const s = `${obj.name} completed at ${new Date(obj.created_at).toLocaleTimeString()}`;
                const newHtml = `<div>${s}</div>`;
                dataElement.innerHTML += newHtml;
            });
        }
    });
}
getLeaderboardData();
