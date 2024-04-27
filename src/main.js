var ddUrl = '';
var DD_PSWD = 'titties';
var sendDDPostRequest = function (str) {
};
document.addEventListener("DOMContentLoaded", function () {
    var ddPostButton = document.getElementById("ddPost");
    var pswdModal = document.querySelector("dialog");
    var ddInput = document.getElementById("ddInput");
    var pswdButton = document.getElementById("pswdBtn");
    var pswdInput = document.getElementById("pswdInput");
    ddPostButton.addEventListener("click", function (event) {
        console.log(ddInput.value);
        pswdModal.showModal();
        pswdButton.addEventListener("click", function (event) {
            console.log(pswdInput.value);
            if (pswdInput.value === DD_PSWD) {
                console.log('match!');
                pswdModal.close();
            }
        });
    });
});
