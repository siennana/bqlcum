"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const backButton = document.getElementById("backButton");
    let count = 0;
    if (backButton) {
        count++;
        console.log(count);
        backButton.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }
    const ddPostButton = document.getElementById("ddPost");
    if (ddPostButton) {
        console.log("post button click");
        const ddInput = document.getElementById("ddInput");
        if (ddInput) {
            console.log(ddInput.value);
        }
    }
});
