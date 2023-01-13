const ESTADO_CARRITO = { 0: "Pago realizado", 1: "Pendiente de pago", 2: "Pendiente de pago (actual)" };

window.onload = () => {
    document.getElementById("login_icon").onclick = modalLogin;
    document.getElementById("cart_icon").onclick = verCarrito();
    document.getElementById("cart-list_icon").onclick = () => historialCarritos(1);
    addRefreshEvents();
    mostrarCategorias();
};

function addRefreshEvents() {
    let refreshElements = document.getElementsByClassName("refresh");
    for (let element of refreshElements) {
        element.addEventListener('click', () => {
            location.reload();
        })
    }
}

function mostrarCategorias() {
    //declaracion de parametros que pasaremos al request
    const parametro = "categorias";
    const method = "get";

    //promesa para pintar las categorias
    request(method, parametro, null)
        //resolve de la promesa
        .then(listadoCategorias => {
            let main = document.getElementById("main");
            main.innerHTML = `<div id="categorias" class="l-columns-3"></div>`;
            let layout = document.getElementById("categorias");

            JSON.parse(listadoCategorias).forEach(cat => {
                layout.innerHTML += `<div id="${cat.id}" class="c-card">
                                <div class="c-card__nombre">${cat.nombre.toUpperCase()}</div>
                                <img src="./assets/img/${cat.nombre}.jpg" class="c-card__imagen" alt="${cat.nombre}" />
                            </div>`;
            });
            //
            let cartas = layout.getElementsByClassName("c-card");
            Array.from(cartas).forEach(c => {
                c.onclick = () => mostrarProductos(c.id);
            });
        })
        //catch de la promesa
        .catch(error => {
            console.log("Error");
        });

}

function mostrarProductos(id) {
    //declaracion de parametros que pasaremos al request
    const parametro = "productos";
    const method = "get";

    request(method, parametro, null)
        //resolve de la promesa
        .then(listadoProductos => {
            let main = document.getElementById("main");
            main.classList = "c-main c-main--background-dark"
            main.innerHTML = `<div id="products" class="c-products"></div>`;

            let layout = document.getElementById("products");
            let productosCategoriaSeleccionada = JSON.parse(listadoProductos).filter(p => p.id_categoria == id);

            productosCategoriaSeleccionada.forEach(p => {
                layout.innerHTML += `<div class="c-item">
                                    <div class="c-item__title l-flex l-flex--align-items-center l-flex--justify-content-center">${p.nombre.toUpperCase()}</div>
                                    <div id="${p.id}" class="c-item__img"></div>
                                    <div class="c-item__footer l-flex l-flex--align-items-center">
                                        <div class="c-item__icon c-item__icon--left">
                                            <i id="${p.id}" class="c-icon fa-solid fa-circle-info"></i>
                                        </div>
                                        <div class="c-item__price">${p.precio.toFixed(2)} €</div>
                                        <div class="c-item__icon c-item__icon--right">
                                            <i class="c-icon c-icon--alternativo fa-solid fa-cart-plus" ></i>
                                        </div>
                                    </div>
                                </div>`;
            });

            let images = layout.getElementsByClassName("c-item__img");
            for (let img of images) {
                let rutaImg = "url('./assets/img/fotosProductos/producto_" + img.id + ".jpg')";
                img.style.backgroundImage = "linear-gradient(to bottom, rgba(255, 255, 255, 0),80%, rgb(227, 219, 206))," + rutaImg;
            }

            let infoIcon = layout.getElementsByClassName("fa-circle-info");
            for (let icon of infoIcon) {
                icon.onclick = () => mostrarDetalleProducto(id, icon.id)
            }
        });

    let images = layout.getElementsByClassName("c-item__img");
    for (let img of images) {
        let rutaImg = "url('./assets/img/fotosProductos/producto_" + img.id + ".jpg')";
        img.style.backgroundImage = "linear-gradient(to bottom, rgba(255, 255, 255, 0),80%, rgb(227, 219, 206))," + rutaImg;
    }

    let infoIcon = layout.getElementsByClassName("fa-circle-info");
    for (let icon of infoIcon) {
        icon.onclick = () => mostrarDetalleProducto(icon.id)
    }

}

function fadeAnimation(modalId) {
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

function modalLogin() {
    let dialog = document.getElementById("dialog");
    let modal = modals.find(m => m.id == "login");

    dialog.classList.add(modal.tamanyo);
    dialog.classList.add("loginModal");
    dialog.innerHTML = modal.code;

    fadeAnimation("loginModal");
    document.getElementById("registro").onclick = modalRegistro;
    dialog.showModal();
}

function modalRegistro() {
    let dialog = document.getElementById("dialog");
    dialog.close();
    let modal = modals.find(m => m.id == "registro");

    dialog.classList = "c-modal " + modal.tamanyo + " registroModal";
    dialog.innerHTML = modal.code;

    fadeAnimation("registroModal");
    dialog.showModal();
}

function modalCarrito() {
    let dialog = document.getElementById("dialog");
    dialog.close();
    let modal = modals.find(m => m.id == "carrito");

    dialog.classList = "c-modal " + modal.tamanyo + " carritoModal";
    dialog.innerHTML = modal.code;

    fadeAnimation("carritoModal");
    document.getElementById("pago").onclick = modalPago;
    dialog.showModal();
}

function modalPago() {
    let dialog = document.getElementById("dialog");
    dialog.close();
    let modal = modals.find(m => m.id == "pago");

    dialog.classList = "c-modal " + modal.tamanyo + " pagoModal";
    dialog.innerHTML = modal.code;

    fadeAnimation("pagoModal");
    dialog.showModal();
}

function historialCarritos(id_usuario) {
    let dialog = document.getElementById("dialog");
    dialog.close();

    //Añadimos el encabezado del modal a la etiqueta dialog
    dialog.classList = "c-modal c-modal--large historialCarritoModal";
    dialog.innerHTML = `<div id='modalHistorialCarrito' class='c-bubble'>
                            <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-bottom-5">
                                <div class="c-title">Listado carritos</div>
                                <i class="c-icon c-icon--close fa-sharp fa-solid fa-xmark close"></i>
                            </div>
                        </div>`;

    //Cogemos el contenedor donde irán todos los carritos
    let modalHistorialCarrito = document.getElementById("modalHistorialCarrito");

    //Preparamos y ejecutamos la petición del historial de carritos al servidor
    const parametro = "historial_carritos/" + id_usuario;
    const method = "get";
    request(method, parametro, null)
        .then(response => {
            let historialCarritos = JSON.parse(response)
            Array.from(historialCarritos).forEach(carrito => {
                //Pintamos todos los carritos
                modalHistorialCarrito.innerHTML += `<div id="carrito-${carrito.id}" class="c-cart-list l-flex l-flex--align-items-center">
                                                        <div class="c-cart-list__title-cart">
                                                            <i class="c-icon c-icon--small fa-solid fa-eye"></i>
                                                            Carrito ${carrito.id}
                                                        </div>
                                                        <div class="c-cart-list__item c-cart-list__item--right">${ESTADO_CARRITO[carrito.estado]}</div>`;
                if (carrito.estado != 0) {
                    document.getElementById("carrito-" + carrito.id).innerHTML += `<div class="c-cart-list__item"><button class="c-button pagar">Pagar</button></div>
                                                        <div class="c-cart-list__item"><button class="c-button recuperar">Recuperar</button></div>
                                                        <div class="c-cart-list__item"><button class="c-button c-button--danger borrar">Borrar</button></div>                                                        
                                                    </div>
                                                </div>`;
                };
            });
            //Asignamos las respectivas funciones a los botones de los carritos
            asignarEvento("fa-eye", "click", verDetalleCarrito);
            asignarEvento("pagar", "click", realizarPago);
            asignarEvento("recuperar", "click", recuperarCarrito);
            asignarEvento("borrar", "click", borrarCarrito);

            //Añadimos la animación de salida al modal
            fadeAnimation("historialCarritoModal");
            dialog.showModal();
        });
}

function mostrarDetalleProducto(idProducto) {
    let dialog = document.getElementById("dialog");
    dialog.close();

    //declaracion de parametros que pasaremos al request
    const parametro = "productos";
    const method = "get";
    console.log(idProducto)

    //promesa para pintar las categorias
    request(method, parametro, null)
        //resolve de la promesa
        .then(listadoProductos => {
            let articulo = JSON.parse(listadoProductos).find(p => p.id == idProducto);

            dialog.classList = "c-modal c-modal--small detalleProductoModal";
            dialog.innerHTML = `<div class="c-bubble">
            <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-bottom-5">
            <div class="c-title">${articulo.nombre}</div>
            <i class="c-icon c-icon--close fa-sharp fa-solid fa-xmark close"></i>
            </div>
            <div class="l-flex l-flex--justify-content-center">
            <img src="assets/img/fotosProductos/producto_${articulo.id}.jpg" class="c-img c-img--small">
            <div
                class="c-bubble c-bubble--dark g--margin-horizontal-5 l-flex l-flex--direction-column l-flex--justify-content-space-between">
                <div class="c-text">${articulo.descripcion}</div>
                <div class="l-flex l-flex--justify-content-space-between">
                <div class="c-title c-title--alternativo-secundario c-title--medium">${articulo.precio.toFixed(2)} €</div>
                <button class="c-button"><i class="fa-solid fa-cart-plus g--margin-right-4"></i>Añadir</button>
                </div>
            </div>
            </div>
        </div>`;
            fadeAnimation("detalleProductoModal");
            dialog.showModal();
        })
        .catch(error => {
            console.log("Error")
        });
}

function request(method, parametro, body = null) {

    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();

        xhr.open(method, `http://localhost:3000/${parametro}`);

        xhr.setRequestHeader("Content-type", "application/Json;charset=utf-8");

        xhr.response = "JSON";

        xhr.send();

        xhr.onload = () => {

            if (xhr.status == 200) {
                resolve(xhr.response);
            } else {
                reject(console.log("ERROR " + xhr.status + " " + xhr.statusText));
            }
        }
    }

    )

};

function verDetalleCarrito(carritoId) {
    console.log("Detalle carrito - " + carritoId)
}

function realizarPago(carritoId) {
    console.log("Pagar carrito - " + carritoId)
}

function recuperarCarrito(carritoId) {
    console.log("Recuperar carrito - " + carritoId)
}

function borrarCarrito(carritoId) {
    console.log("Borrar carrito - " + carritoId)
}

let asignarEvento = function (className, event, callback) {
    let botones = document.getElementsByClassName(className);
    for (let boton of botones) {
        let id = boton.parentNode.parentNode.id.split("-")[1];
        boton.addEventListener(event, () => callback(id));
    }
}