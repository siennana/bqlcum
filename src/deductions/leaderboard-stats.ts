import { User } from './leaderboard-users.js'; 

const leaderboardUrl = 'https://40ae5vnl08.execute-api.eu-central-1.amazonaws.com/default/dailydeductions';
const users: Record<string, User> = {};

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
}

const getUrlForIssue = () => {
  const issueDate = getLatestIssue();
  return `${leaderboardUrl}?issue=${issueDate}`;
};

type DDResponse = {
  flag: string,
  name: string,
  type: string,
  issue: number,
  created_at: number,
}
type LeaderData = Pick<DDResponse, 'name' | 'created_at'>

/**
 * fetches leaderboard data for a given issue
 */
async function fetchLeaderboardData() {
  try {
    const url = getUrlForIssue();
    const response = await fetch(url);
    return response.json();
 } catch (e){
    console.log(`error fetching data`);
  }
};

export async function postLeaderboardData(data: string) {
  try {
    const url = getUrlForIssue();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(`{'flag': 'US', 'name': ${data}}`)
    });
    return response.json();
  } catch (e) {
    console.log('error posting to leaderboard');
  }
}

const statusButtonClick = (id: string) => {
  const statusBtn = document.getElementById(id);
  const parentId = (statusBtn?.parentNode?.parentNode as HTMLElement).id;
  const btnData = id.split('_');
  const user = users[parentId];
  let txt = 0;
  if (btnData[1] === 'like') {
    user.likes++;
    txt = user.likes;
  } else if (btnData[1] === 'dislike') {
    user.dislikes++;
    txt = user.dislikes;
  }
  if (statusBtn instanceof HTMLButtonElement) {
    //statusBtn!.textContent = `${txt}`;
    statusBtn.removeChild(statusBtn.lastChild);
    statusBtn.appendChild(document.createTextNode(`${txt}`));
  }
}

const createButton = (id: string, val: number) => {
  const button = document.createElement("button");
  const btnData = id.split('_');
  const img = document.createElement("img");
  if (btnData[1] === 'like') {
    img.src = './../assets/noun-love-6212830.png';
  } else if (btnData[1] === 'dislike') {
    img.src = './../assets/noun-middle-finger-241675.png';
  }
  button.id = id;
  button.onclick = () => statusButtonClick(button.id);
  button.appendChild(img);
  button.appendChild(document.createTextNode(`${val}`));
  return button;
}

/*
 * gets formatted leaderboard data and adds to DOM
 */
async function getLeaderboardData() {
  const rawData = await fetchLeaderboardData();
  // sort by created_by date
  const sortedData = rawData.sort((a: DDResponse, b: DDResponse) => {
    return a.created_at - b.created_at;
  });
  const formattedData = sortedData.map((resObj: DDResponse) => {
    return {
      name: resObj['name'],
      created_at: new Date(resObj['created_at'])
    };
  });
  const dataElement = document.getElementById('data');
  if (dataElement) {
    formattedData.forEach((obj: LeaderData, i: number) => {
      const s = `${obj.name} completed at ${new Date(obj.created_at).toLocaleTimeString()}`
      const newDiv = document.createElement("div");
      newDiv.id=`${i}`;
      newDiv.textContent = s;
      const btnDiv = document.createElement('div');
      btnDiv.appendChild(createButton(`${i}_like`, 0));
      btnDiv.appendChild(createButton(`${i}_dislike`, 0));
      newDiv.appendChild(btnDiv);
      dataElement.appendChild(newDiv);

      users[newDiv.id] = new User(0, 0);
    });
  }
}

getLeaderboardData();
