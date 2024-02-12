const apiKey = "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";

document.getElementById('input_icon').addEventListener('click', () => {
  const inputText = document.getElementById('input').value.trim();
  if (inputText !== '') {
      document.getElementsByClassName('search')[0].style.boxShadow = `
      5px 5px 10px rgb(0, 0, 0,.5), inset 5px 5px 10px rgb(0, 0, 0,.5)`;
      document.getElementsByClassName('loading')[0].style.display = 'flex';
      document.getElementsByClassName('loading')[0].innerHTML = ` <div class="load">
      <h6></h6>
      <h6></h6>
      <h6></h6>
      </div>`;
      document.getElementById('input_icon').style.cursor ='not-allowed';
      runMessage(inputText);
  } else {
      document.getElementsByClassName('search')[0].style.boxShadow = `
      5px 5px 10px rgb(0, 0, 0,.5), inset 5px 5px 10px rgb(255, 0, 0,.5)`;
  }
})

let offButton = () => {
  Array.from(document.getElementsByClassName('button')).forEach((el) => {
      el.classList.remove('lan');
  })
}

Array.from(document.getElementsByClassName('button')).forEach((el) => {
  el.addEventListener('click', () => {
      offButton();
      el.classList.add('lan');
  })
})

let runMessage = (message) => {
  let lan = document.getElementsByClassName('lan')[0].innerText;

  fetch("https://api.openai.com/v1/completions", {
      method: 'POST',
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
      }, 
      body : JSON.stringify({
          model : "text-davinci-003",
          prompt : message + ' in ' + lan,
          "temperature": 0.5,
          max_tokens : 3000
      })
  }).then((Response) => Response.json())
  .then((result) => {
      messageBox(message, result.choices[0]['text']);
      document.getElementsByClassName('loading')[0].style.display = 'none';
  }).catch((err) => {
      console.error(err);
      document.getElementsByClassName('loading')[0].innerHTML = 'Error Occurred';
  }).finally(() => {
      document.getElementById('input').value = '';
      document.getElementById('input_icon').style.cursor ='pointer';
  })
}

let count = 0;

let messageBox = (msg, res) => {
  let history = document.getElementById('history');
  
  let myMessageBx = document.createElement('pre');
  myMessageBx.classList.add('qus_bx');
  let myMessage = document.createElement('p');
  myMessage.innerText = msg;
  myMessageBx.append(myMessage);
  history.append(myMessageBx);
  
  let ansMessageBx = document.createElement('pre');
  ansMessageBx.classList.add('ans_bx');
  let ansMessage = document.createElement('p');
  ansMessage.innerText = res;
  ansMessage.id = 'ans'+ count;
  let copyIcon = document.createElement('i');
  copyIcon.className = 'bi bi-clipboard-fill';
  copyIcon.id = 'copy'+count;
  ansMessageBx.append(copyIcon);
  ansMessageBx.append(ansMessage);
  history.append(ansMessageBx);

  copyIcon.onclick = () => {
      inputCopy(ansMessage.id);
      copyIcon.classList.remove('bi-clipboard-fill');
      copyIcon.classList.add('bi-clipboard2-check-fill');
      setTimeout(() => {
          copyIcon.classList.add('bi-clipboard-fill');
          copyIcon.classList.remove('bi-clipboard2-check-fill');
      }, 3000);
  }

  count++;
}

const inputCopy = (id) => {
  let message = document.getElementById(id).innerText;
  navigator.clipboard.writeText(message).then(() => {
    console.log('Text copied to clipboard successfully');
  }).catch((error) => {
    console.error('Unable to copy text: ', error);
  });
}
