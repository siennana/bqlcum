const leaderboardUrl = 'https://40ae5vnl08.execute-api.eu-central-1.amazonaws.com/default/dailydeductions';
const issueDate = '1707948000';

const getUrlForIssue = () => {
  return `${leaderboardUrl}?issue=${issueDate}`;
};

type DDResponse = {
  flag: string,
  name: string,
  type: string,
  issue: string,
  created_at: string,
}

async function fetchLeaderboardData() {
  try {
    console.log('fuck');
    const url = getUrlForIssue();
    const response = await fetch(url);
    const data = await response.json();

    const formattedData = data.map((resObj: DDResponse) => {
      console.log(new Date(resObj['created_at']));
      return {
        name: resObj['name'],
        created_at: new Date(resObj['created_at'])
      }
    });

    const dataElement = document.getElementById('data');
    if (dataElement) {
      dataElement.innerText = JSON.stringify(formattedData, null, 2);
    }
  } catch {
    console.log('error fetching data');
  }
};

fetchLeaderboardData();

