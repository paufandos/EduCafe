const ESTADO_CARRITO = { 0: "Pago realizado", 1: "Pendiente de pago", 2: "Pendiente de pago (actual)" };
let isLogin = false;
let activeUser;
let carrito;

window.onload = () => {
    Date.prototype.getFormattedDate = function () {
        let dia = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
        let mes = this.getMonth() < 10 ? "0" + this.getMonth() : this.getMonth();
        return dia + "-" + mes + "-" + this.getFullYear()
    }

    carrito = new Carrito(Date.now(), new Date().getFormattedDate());

    document.getElementById("login_icon").onclick = modalLogin;
    document.getElementById("cart_icon").onclick = verCarrito;

    addRefreshEvents();
    mostrarCategorias();


};

function verCarrito() {
    if (isLogin) {
        request("GET", "carritoActual/" + activeUser.id)
            .then(c => {
                carrito = new Carrito(c.id, c.fecha, c.estado, c.id_usuario, c.productos)
                carrito.actualizarCarrito()
            })

    } else if (carrito.productos.length != 0) {
        carrito.actualizarCarrito();
        console.log(carrito)
    } else {
        alert("carrito vacio")
    }

}

function ponArticuloEnCarrito(id) {
    request("GET", "productos/" + id)
        .then(p => {
            carrito.anyadeArticulo(p)
        })
        .catch(e => console.log(e + " no se ha encontrado articulo"))
}

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

            listadoCategorias.forEach(cat => {
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

/*function alPulsarCarrito(){
    let classIcon = document.getElementsByClassName("c-icon")
    classIcon.innerHTML="c-icon--alternativo"
}*/

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
            let productosCategoriaSeleccionada = listadoProductos.filter(p => p.id_categoria == id);

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
                                            <i id="producto-${p.id}" class="c-icon c-icon--alternativo fa-solid fa-cart-plus" ></i>
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
                let id = icon.id;
                icon.onclick = () => mostrarDetalleProducto(id)
            }

            let articulos = layout.getElementsByClassName("fa-cart-plus");
            for (let art of articulos) {
                let id = art.id.split("-")[1]
                art.addEventListener('click', () => { ponArticuloEnCarrito(id) });
            };
        });

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
    dialog.close();
    if (isLogin) {
        changeLogInInterface(activeUser);
    } else {
        dialog.classList = "c-modal c-modal--medium loginModal"
        dialog.innerHTML = `<div>
                            <div class="l-flex l-flex--align-items-center l-flex--justify-content-end g--margin-bottom-5">
                            <i class="c-icon c-icon--small c-icon--close-light fa-sharp fa-solid fa-xmark close"></i>
                            </div>
                        </div>
                        <div class="l-columns">
                            <form id="formLogin" class="c-bubble">
                                <div class="c-title">Inicio de sesión</div>
                                <label class="c-label" for="usuario">Email</label>
                                <input id="usuario" class="c-input c-input--w-100" name="usuario" type="text"
                                    placeholder="Escribe aquí tu correo">

                                <label class="c-label" for="password">Contraseña</label>
                                <input id="password" class="c-input c-input--w-100" name="password" type="password"
                                    placeholder="Escribe aquí tu contraseña">
                                <div class="g--text-align-center">
                                    <button id="botonInicioSesion" class="c-button g--margin-top-10" type="submit">Inicia sesión</button><br>
                                    <button class="c-button c-button--principal-terciario g--margin-top-2">¿Has olvidado tu contraseña?</button>
                                </div>
                            </form>
                           
                            <div class="g--text-align-center">
                                <div class="c-title c-title--alternativo">Bienvenido a</div>
                                <img src="./assets/img/EducaCafe-2-08.png" alt="educafe_logo" class="c-img">
                                <div>
                                    <button class="c-button c-button--alternativo-terciario g--margin-bottom-2">¿No tienes cuenta? Regístrate</button><br>
                                    <button id="registro" class="c-button c-button--secuendario">Regístrarse</button>
                                </div>
                            </div>
                        </div>`;

        fadeAnimation("loginModal");
        document.getElementById("registro").onclick = modalRegistro;
        document.getElementById("formLogin").onsubmit = () => iniciarSesion(event);
        dialog.showModal();
    }
}

function modalRegistro() {
    let dialog = document.getElementById("dialog");
    dialog.close();

    dialog.classList = "c-modal c-modal--xsmall registroModal";
    dialog.innerHTML = `<div class="c-bubble">
                            <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-bottom-5">
                                <div class="c-title">Formulario de registro</div>
                                <i class="c-icon c-icon--close fa-sharp fa-solid fa-xmark close"></i>
                            </div>
                            <form id="formRegistro">
                                <label class="c-label" for="nombre">Nombre</label>
                                <input id="nombre" class="c-input c-input--w-100" name="nombre" type="text"
                                    placeholder="Escribe tu nombre">

                                <label class="c-label" for="apellidos">Apellidos</label>
                                <input id="apellidos" class="c-input c-input--w-100" type="text" name="apellidos"
                                    placeholder="Escribe tus apellidos">

                                <label class="c-label" for="correo">Correo electrónico</label>
                                <input id="correo" class="c-input c-input--w-100" name="correo" type="text"
                                    placeholder="Escribe tu correo electrónico">

                                <label class="c-label" for="password">Contraseña</label>
                                <input id="password" class="c-input c-input--w-100" type="password" name="password"
                                    placeholder="Escribe tu contraseña">

                                <label class="c-label" for="confirmPassword">Confirmar contraseña</label>
                                <input id="confirmPassword" class="c-input c-input--w-100" type="password"
                                    name="confirmPassword" placeholder="Confirma tu contraseña">
                            </form>
                            <div class="g--text-align-right g--margin-top-10">
                                <button id="botonRegistro" class="c-button">Confirmar registro</button>
                            </div>
                        </div>`;
    document.getElementById("botonRegistro").onclick = registrarUsuario;
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
        .then(historialCarritos => {
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

    //promesa para pintar las categorias
    request(method, parametro, null)
        //resolve de la promesa
        .then(listadoProductos => {
            let articulo = listadoProductos.find(p => p.id == idProducto);
            dialog.classList = "c-modal c-modal--small detalleProductoModal";
            dialog.innerHTML = `<div class="c-bubble">
                                    <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-bottom-5">
                                        <div class="c-title">${articulo.nombre}</div>
                                        <i class="c-icon c-icon--close fa-sharp fa-solid fa-xmark close"></i>
                                    </div>
                                    <div class="l-flex l-flex--justify-content-center">
                                        <img src="assets/img/fotosProductos/producto_${articulo.id}.jpg" class="c-img c-img--small">
                                        <div id="articulo-${articulo.id}" class="c-bubble c-bubble--dark g--margin-horizontal-5 l-flex l-flex--direction-column l-flex--justify-content-space-between">
                                            <div class="c-text">${articulo.descripcion}</div>
                                            <div class="l-flex l-flex--justify-content-space-between">
                                                <div class="c-title c-title--alternativo-secundario c-title--medium">${articulo.precio.toFixed(2)} €</div>
                                                <button class="c-button add"><i class="fa-solid fa-cart-plus g--margin-right-4"></i>Añadir</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

            /* let carroIcon = layout.getElementsByClassName("fa-cart-plus");
             let id = articulo.id;
             carroIcon.onclick = () => ponArticuloEnCarrito(id); */
            asignarEvento("add", "click", ponArticuloEnCarrito);
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
        xhr.send(JSON.stringify(body));
        xhr.onload = () => {
            if ((xhr.status == 200 || xhr.status == 201) && JSON.parse(xhr.response).length != 0) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(console.log("ERROR " + xhr.status + " " + xhr.statusText));
            }
        }
    }
    )
};

function registrarUsuario() {
    let formData = new FormData(document.forms.formRegistro);
    let newUser = {};
    for (const [key, value] of formData) {
        newUser[key] = value;
    }

    if (!newUser["nombre"] || !newUser["apellidos"] || !newUser["correo"] || !newUser["password"] || !newUser["confirmPassword"]) {
        alert("Por favor rellene todos los campos");
        return;
    }
    if (newUser["password"] !== newUser["confirmPassword"]) {
        alert("Las contraseñas no coinciden");
        return;
    }

    delete newUser.confirmPassword;
    newUser.nombre = newUser.nombre + " " + newUser.apellidos
    delete newUser.apellidos;

    request("POST", "usuarios", newUser);
}

function iniciarSesion(e) {
    e.preventDefault();

    let formData = new FormData(document.forms.formLogin);
    let user = {};
    for (const [key, value] of formData) {
        user[key] = value;

    }
    if (!user['usuario'] || !user['password']) {
        alert("Por favor rellene todos los campos");
        return;
    }

    request("GET", "login/" + user.usuario)
        .then(u => {
            usuario = u[0];
            if (usuario.password == user.password) {
                isLogin = true;
                activeUser = new User(usuario.id, usuario.nombre, usuario.correo);
                changeLogInInterface(activeUser);
            } else {
                alert("Contraseña incorrecta")
            }
        }).catch(e => { alert("El usuario no existe") })
}

function changeLogInInterface(user) {
    let dialog = document.getElementById("dialog");
    dialog.close();

    dialog.classList = "c-modal c-modal--xsmall miCuenta";
    dialog.innerHTML = `<div class="c-bubble">
                            <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-bottom-5">
                                <div class="c-title"><i class="c-icon fa-solid fa-user"></i> Mi cuenta</div>
                                <i class="c-icon c-icon--close fa-sharp fa-solid fa-xmark close"></i>
                            </div>
                            <label class="c-label" for="nombre">Nombre</label>
                            <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between">
                                <input id="nombre" class="c-input c-input--w-80" name="nombre" type="text" value="${user.nombre}">
                                <button id="cambiarNombre" class="c-button">Editar</button>
                            </div>
                            <label class="c-label" for="correo">Correo electrónico</label>
                            <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between">
                                <input id="correo" class="c-input c-input--w-80" name="correo" type="text" value="${user.correo}">
                                <button id="cambiarCorreo" class="c-button">Editar</button>
                            </div>
                            <hr class="g--margin-vertical-8 g--color-principal-1">
                            <label class="c-label" for="password">Contraseña</label>
                            <input id="password" class="c-input c-input--w-100" type="password" name="password"
                                placeholder="Escribe su nueva contraseña">
                            <label class="c-label" for="confirmPassword">Confirmar contraseña</label>
                            <input id="confirmPassword" class="c-input c-input--w-100" type="password"
                                name="confirmPassword" placeholder="Confirme su  nueva contraseña">
                            <div class="l-flex l-flex--justify-content-end">
                                <button id="cambiarCorreo" class="c-button">Confirmar nueva contraseña</button>
                            </div>
                            <hr class="g--margin-vertical-8 g--color-principal-1">
                            <div>
                                <i id="cart-list_icon" class="c-icon fa-solid fa-list"></i>
                                Historial de carritos
                            </div>
                        </div>`;
    fadeAnimation("miCuenta");
    document.getElementById("cart-list_icon").addEventListener("click", () => historialCarritos(user.id));
    dialog.showModal();
}

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

let asignarEvento = function (className, event, callback, optional = null) {
    let botones = document.getElementsByClassName(className);
    for (let boton of botones) {
        let id = boton.parentNode.parentNode.id.split("-")[1];
        boton.addEventListener(event, () => callback(id, optional));
    }
}
