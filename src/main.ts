const ddUrl = '';
const DD_PSWD = 'titties';

const sendDDPostRequest = (str: string) => {
  
};

document.addEventListener("DOMContentLoaded", function() {
  const ddPostButton = document.getElementById("ddPost");
  const pswdModal = document.querySelector("dialog");
  const ddInput = document.getElementById("ddInput") as HTMLInputElement | null;
  const pswdButton = document.getElementById("pswdBtn");
  const pswdInput = document.getElementById("pswdInput") as HTMLInputElement | null;

  ddPostButton.addEventListener("click", function(event) {
    console.log(ddInput.value);
    pswdModal.showModal();

    pswdButton.addEventListener("click", function(event) {
      console.log(pswdInput.value);
      if (pswdInput.value === DD_PSWD) {
        console.log('match!');
      }
      pswdModal.close();
    });
  });
});

