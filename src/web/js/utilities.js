let hideTimeOut;

function addRefreshEvents() {
  let refreshElements = document.getElementsByClassName("refresh");
  for (let element of refreshElements) {
    element.addEventListener("click", () => {
      location.reload();
    });
  }
}

function request(method, parametro, body = null) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, `http://localhost:3000/${parametro}`);
    xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
    if(body!=null){
      body = JSON.stringify(body);
    }
    xhr.send(body);

    xhr.onload = () => {
      if ((xhr.status == 200 && JSON.parse(xhr.response).length != 0) || xhr.status == 201) {
        resolve(JSON.parse(xhr.response));
      } else {
        let e = { "statusCode": xhr.status, "statusText": xhr.statusText };
        reject(e);
      }
    };
    xhr.onerror = () => {
      let e = { "statusCode": 500, "statusText": "Error del servidor" };
      reject(e);
    }
  });
}

function hideModal(modal, animation, timeOut = false) {
  modal.classList.add(animation);
  modal.addEventListener('webkitAnimationEnd', function () {
    modal.classList.remove(animation);
    if (modal.tagName != "DIALOG") {
      modal.style.display = "none";
    } else {
      modal.close();
    }
    modal.removeEventListener('webkitAnimationEnd', arguments.callee, false);
  }, false);
}

function animacionSalidaModal(modalId, animation, timeOut) {
  let modal = document.getElementsByClassName(modalId);
  let close = modal[0].getElementsByClassName("close");
  close[0].onclick = () => { hideModal(modal[0], animation, timeOut) }
}

function alert(body, title = "Aviso",) {
  let alert = document.getElementById("alert");
  alert.innerHTML = `<div class="c-alert__header l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-bottom-5">
                      <div class="c-title c-title--small c-title--lighter">${title}</div>
                    </div>
                    <div class="c-alert__body">
                      <p class="c-text c-text--dark c-text--medium">${body}</p>
                    </div>`;
  alert.style.display = "block";
  hideTimeOut = setTimeout(() => {
    hideModal(alert, "c-alert--close")
  }, "5000")
}

function asignarEvento(className, event, callback, optional = null) {
  let botones = document.getElementsByClassName(className);
  for (let boton of botones) {
    let id = boton.parentNode.id.split("-")[1];
    boton.addEventListener(event, () => callback(id, optional));
  }
}

Date.prototype.getFormattedDate = function () {
  let dia = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
  let mes = this.getMonth() < 10 ? "0" + this.getMonth() : this.getMonth();
  return dia + "-" + mes + "-" + this.getFullYear()
}