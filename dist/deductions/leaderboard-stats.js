"use strict";
const leaderboardUrl = 'https://40ae5vnl08.execute-api.eu-central-1.amazonaws.com/default/dailydeductions';
/**
 * returns latest date which has passed 5pm EST
 */
const getLatestIssue = () => {
    const currentDate = new Date();
    currentDate.setMilliseconds(0);
    currentDate.setSeconds(0);
    currentDate.setMinutes(0);
    if (currentDate.getHours() < 17) {
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
async function fetchLeaderboardData() {
    try {
        const url = getUrlForIssue();
        const response = await fetch(url);
        return response.json();
    }
    catch (e) {
        console.log(`error fetching data`);
    }
}
;
/*
 * gets formatted leaderboard data and adds to DOM
 */
async function getLeaderboardData() {
    const rawData = await fetchLeaderboardData();
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
}
getLeaderboardData();
