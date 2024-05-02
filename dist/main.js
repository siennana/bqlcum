import { postLeaderboardData } from './deductions/leaderboard-stats.js';
const ddUrl = '';
const DD_PSWD = 'titties';
document.addEventListener("DOMContentLoaded", function () {
    const ddPostButton = document.getElementById("ddPost");
    const pswdModal = document.querySelector("dialog");
    const ddInput = document.getElementById("ddInput");
    const pswdButton = document.getElementById("pswdBtn");
    const pswdCancel = document.getElementById("pswdCancel");
    const pswdInput = document.getElementById("pswdInput");
    ddPostButton.addEventListener("click", function (event) {
        console.log(ddInput.value);
        pswdModal.showModal();
        pswdButton.addEventListener("click", function (event) {
            console.log(pswdInput.value);
            if (pswdInput.value === DD_PSWD) {
                postLeaderboardData(ddInput.value);
            }
            pswdModal.close();
        });
        pswdCancel.addEventListener("click", function (event) {
            pswdModal.close();
        });
    });
});
