function request(method, parametro, body = null) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, `http://localhost:3000/${parametro}`);
    xhr.setRequestHeader("Content-type", "application/Json;charset=utf-8");
    xhr.response = "JSON";
    xhr.send(JSON.stringify(body));
    xhr.onload = () => {
      if ((xhr.status == 200 && JSON.parse(xhr.response).length != 0) || xhr.status == 201) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(console.log("ERROR " + xhr.status + " " + xhr.statusText));
      }
    };
  });
}

function addRefreshEvents() {
  let refreshElements = document.getElementsByClassName("refresh");
  for (let element of refreshElements) {
    element.addEventListener("click", () => {
      location.reload();
    });
  }
}

function animacionSalidaModal(modalId) {
  let modal = document.getElementsByClassName(modalId);
  let close = modal[0].getElementsByClassName("close");
  close[0].onclick = function () {
    modal[0].classList.add('c-modal--close');
    modal[0].addEventListener('webkitAnimationEnd', function () {
      modal[0].classList.remove('c-modal--close');
      modal[0].close();
      modal[0].removeEventListener('webkitAnimationEnd', arguments.callee, false);
    }, false);
  };
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