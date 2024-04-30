"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leaderboard_stats_ts_1 = require("./deductions/leaderboard-stats.ts");
var ddUrl = '';
var DD_PSWD = 'titties';
document.addEventListener("DOMContentLoaded", function () {
    var ddPostButton = document.getElementById("ddPost");
    var pswdModal = document.querySelector("dialog");
    var ddInput = document.getElementById("ddInput");
    var pswdButton = document.getElementById("pswdBtn");
    var pswdCancel = document.getElementById("pswdCancel");
    var pswdInput = document.getElementById("pswdInput");
    ddPostButton.addEventListener("click", function (event) {
        console.log(ddInput.value);
        pswdModal.showModal();
        pswdButton.addEventListener("click", function (event) {
            console.log(pswdInput.value);
            if (pswdInput.value === DD_PSWD) {
                (0, leaderboard_stats_ts_1.postLeaderboardData)(ddInput.value);
                console.log('match!');
            }
            pswdModal.close();
        });
        pswdCancel.addEventListener("click", function (event) {
            pswdModal.close();
        });
    });
});
