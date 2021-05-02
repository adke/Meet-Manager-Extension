let clickIntervalId = null;

document.addEventListener('DOMContentLoaded', function() {
  var checkbox = document.querySelector('#auto-admit .mdc-switch__native-control');

  function isChecked() {
    if (checkbox.checked ) {
      // do this
      if(clickIntervalId) clearInterval(clickIntervalId);
        clickIntervalId = setInterval(
          function() {for (let element of document.getElementsByTagName('span')) {
          if (element.innerHTML === 'Admit') {
              console.log('There is someone waiting to join this meeting, automatically admitting them...');
              element.click();
          }
        } }, 1000);
        console.log('checked')
    } else {
      // do that
      clearInterval(clickIntervalId);
      console.log('not')
    }
  }
  checkbox.addEventListener('change', function() {
    isChecked();
  });

  function check() {
    isChecked();
  }
  setTimeout(check, 2000)
  

}

);



