const ESTADO_CARRITO = { 0: "Pago realizado", 1: "Pendiente de pago", 2: "Pendiente de pago (actual)" };
let activeUser
let carrito;

window.onload = () => {
    localStorage.clear()
    if (!localStorage.getItem('carrito')) {
        if (!localStorage.getItem("isLogin") == "true") {
            console.log(activeUser.id)
            window.localStorage.setItem("carrito", JSON.stringify(new Carrito(Date.now(), new Date().getFormattedDate(), 1, activeUser.id)));
        } else {
            window.localStorage.setItem("carrito", JSON.stringify(new Carrito(Date.now(), new Date().getFormattedDate(), 1)));
        }
    }
    if (!localStorage.getItem("isLogin")) {
        localStorage.setItem("isLogin", "false")
    }

    document.getElementById("login_icon").onclick = modalLogin;
    document.getElementById("cart_icon").onclick = verCarrito;

    addRefreshEvents();
    mostrarCategorias();
};


//TIENDA
function mostrarCategorias() {
    //promesa para pintar las categorias
    request("GET", "categorias", null)
        //resolve de la promesa
        .then(listadoCategorias => {
            let main = document.getElementById("main");
            main.innerHTML = `<div id="categorias" class="l-columns-3"></div>`;
            let layout = document.getElementById("categorias");

            listadoCategorias.forEach(cat => {
                layout.innerHTML += `<div id="card-${cat.id}" class="c-card">
                                        <div class="c-card__nombre">${cat.nombre.toUpperCase()}</div>
                                        <img src="./assets/img/${cat.nombre}.jpg" class="c-card__imagen" alt="${cat.nombre}" />
                                    </div>`;
            });
            asignarEvento("c-card__imagen", "click", mostrarProductos)
        })
        .catch(e => alert("La operación no se ha podido completar. (" + e.statusCode + " - " + e.statusText + ")", "ERROR"))
}

function mostrarProductos(id) {
    request("GET", "productos", null)
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
                                    <div  class="c-item__footer l-flex l-flex--align-items-center">
                                        <div id="producto-${p.id}" class="c-item__icon c-item__icon--left">
                                            <i class="c-icon fa-solid fa-circle-info"></i>
                                        </div>
                                        <div class="c-item__price">${p.precio.toFixed(2)} €</div>
                                        <div id="producto-${p.id}" class="c-item__icon c-item__icon--right">
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
            asignarEvento("fa-circle-info", "click", mostrarDetalleProducto);
            asignarEvento("fa-cart-plus", "click", anyadirArticulo);
        })
        .catch(e => alert("La operación no se ha podido completar. (" + e.statusCode + " - " + e.statusText + ")", "ERROR"))

}

function mostrarDetalleProducto(idProducto) {
    let dialog = document.getElementById("dialog");
    dialog.close();

    //promesa para pintar las categorias
    request("GET", "productos", null)
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
                                        <div class="c-bubble c-bubble--dark g--margin-horizontal-5 l-flex l-flex--direction-column l-flex--justify-content-space-between">
                                            <div class="c-text">${articulo.descripcion}</div>
                                            <div id="articulo-${articulo.id}" class="l-flex l-flex--justify-content-space-between">
                                                <div class="c-title c-title--alternativo-secundario c-title--medium">${articulo.precio.toFixed(2)} €</div>
                                                <button class="c-button add"><i class="fa-solid fa-cart-plus g--margin-right-4"></i>Añadir</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

            asignarEvento("add", "click", anyadirArticulo);
            animacionSalidaModal("detalleProductoModal", "c-modal--close");
            dialog.showModal();
        })
        .catch(e => alert("La operación no se ha podido completar. (" + e.statusCode + " - " + e.statusText + ")", "ERROR"))
}


//CARRITO
function carritoSerialize(carrito) {
    return new Carrito(carrito.id, carrito.fecha, carrito.estado, carrito.id_usuario, carrito.productos)
}

function verCarrito() {
    carrito = carritoSerialize(JSON.parse(window.localStorage.getItem("carrito")));
    if (carrito.productos.length != 0) {
        carrito.actualizarCarrito()
        window.localStorage.setItem("carrito", JSON.stringify(carrito))
    } else {
        alert("El carrito está vacío.")
    }
}

function anyadirArticulo(id) {
    request("GET", "productos/" + id)
        .then(p => {
            carrito = carritoSerialize(JSON.parse(window.localStorage.getItem("carrito")))
            let nuevoArticulo = {
                "id_producto": p.id,
                "cantidad": 1
            }
            carrito.anyadeArticulo(nuevoArticulo);
            carrito.numeroArticulosTotal()
            window.localStorage.setItem("carrito", JSON.stringify(carrito))
        })
        .catch(e => alert("La operación no se ha podido completar. (" + e.statusCode + " - " + e.statusText + ")", "ERROR"))
}


//USUARIO
function userSerialize(user) {
    return new User(user.id, user.nombre, user.correo)
}

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

    request("POST", "usuarios", newUser)
        .then((usuario) => {
            console.log(usuario)
            alert("Bienvenido <b>" + newUser.nombre + "</b>, se ha completado tu registro correctamente.", "Bienvenido")
            window.localStorage.setItem("isLogin", "true");
            window.localStorage.setItem("user", JSON.stringify(new User(usuario.id, usuario.nombre, usuario.correo)));
            activeUser = userSerialize(JSON.parse(window.localStorage.getItem("user")));
            document.getElementById("dialog").close();
        }).catch(e => alert("La operación no se ha podido completar. (" + e.statusCode + " - " + e.statusText + ")", "ERROR"))
}

function iniciarSesion(e, dialog) {
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
                window.localStorage.setItem("isLogin", "true");
                window.localStorage.setItem("user", JSON.stringify(new User(usuario.id, usuario.nombre, usuario.correo)));
                activeUser = userSerialize(JSON.parse(window.localStorage.getItem("user")));
                alert("Bienvenido <b>" + activeUser.nombre + "</b>", "Bienvenido")
                dialog.close()
            } else {
                alert("Contraseña incorrecta")
            }
        })
        .catch(e => alert("Usuario y/o contraseña incorrectos."))
}

function changeLogInInterface(user) {
    console.log(user)
    let dialog = document.getElementById("dialog");
    dialog.close();

    dialog.classList = "c-modal c-modal--xsmall miCuenta";
    dialog.innerHTML = `<div class="c-bubble">
                            <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-bottom-5">
                                <div class="c-title c-title--medium"><i class="c-icon fa-solid fa-user"></i>Hola, ${user.nombre}!</div>
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
                            <div id="user-${user.id}">
                                <i id="cart-list_icon" class="c-icon fa-solid fa-list"></i>
                                Historial de carritos
                            </div>
                        </div>`;
    animacionSalidaModal("miCuenta", "c-modal--close");
    asignarEvento("fa-list", "click", historialCarritos);
    dialog.showModal()
}

function historialCarritos(id_usuario) {
    let dialog = document.getElementById("dialog");
    
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
            console.log(historialCarritos)
            Array.from(historialCarritos).forEach(carrito => {
                //Pintamos todos los carritos
                modalHistorialCarrito.innerHTML += `<div id="cartRow-${carrito.id}" class="c-cart-list l-flex l-flex--align-items-center">
                                                        <div id="cartList-${carrito.id}" class="c-cart-list__title-cart">
                                                            <i class="c-icon c-icon--small fa-solid fa-eye"></i>
                                                            Carrito ${carrito.id}
                                                        </div>
                                                        <div class="c-cart-list__item c-cart-list__item--right">${ESTADO_CARRITO[carrito.estado]}</div>`;
                if (carrito.estado != 0) {
                    document.getElementById("cartRow-" + carrito.id).innerHTML += `
                                                        <div id="cartPay-${carrito.id}" class="c-cart-list__item">
                                                            <button class="c-button pagar">Pagar</button>
                                                        </div>
                                                        <div id="cartRecuperar-${carrito.id}" class="c-cart-list__item">
                                                            <button class="c-button recuperar">Recuperar</button>
                                                        </div>
                                                        <div id="cartDelete-${carrito.id}" class="c-cart-list__item">
                                                            <button class="c-button c-button--danger borrar">Borrar</button>
                                                        </div>                                                        
                                                    </div>
                                                </div>`;
                };
            });
            //Asignamos las respectivas funciones a los botones de los carritos
            asignarEvento("fa-eye", "click", verDetalleCarrito);
            asignarEvento("pagar", "click", modalPago);
            asignarEvento("recuperar", "click", recuperarCarrito);
            asignarEvento("borrar", "click", confirmarBorrar);

            //Añadimos la animación de salida al modal
            animacionSalidaModal("historialCarritoModal", "c-modal--close");
            dialog.showModal();
        }).catch(alert("No tienes ningún carrito guardado", "Aviso"));
}

function verDetalleCarrito(carritoId) {
    let dialog = document.getElementById("dialog");
    dialog.close();

    //Añadimos las clases y la estructura básica del carrito en el contenedor dialog
    dialog.classList = "c-modal c-modal--medium detalleCarritoModal";
    let htmlCarritoDetalle = `<div class="c-bubble">
                                    <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-bottom-5">
                                        <div class="c-title">Carrito ${carritoId}</div>
                                        <i class="c-icon c-icon--close fa-sharp fa-solid fa-xmark volverHistorial"></i>
                                    </div>
                                    <div class="c-cart-row c-cart-row--bold c-cart-row--6-columns">
                                        <div></div>
                                        <div>Nombre</div>
                                        <div>Descripción</div>
                                        <div>Precio</div>
                                        <div>Unidades</div>
                                        <div>Total</div>
                                    </div>`

    //Hacemos la petición para obtener los datos del carrito
    request("GET", "carritos/" + carritoId, null)
        .then(carrito => {
            //Llamamos al método que devuelve los productos
            getProductsDetalleCarrito(carrito.productos)
            .then(response => {
                let htmlProductos = response[0];
                let precioTotal = response[1];
                htmlCarritoDetalle += htmlProductos
                htmlCarritoDetalle += `	    <div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-vertical-8">
                                                <div class="c-title">Importe: ${precioTotal.toFixed(2)}€</div>
                                                <div id="detalleCarrito-${carrito.id}" class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-vertical-8"></div>
                                            </div>
                                       </div>`;
                
                // Pintamos el html
                dialog.innerHTML = htmlCarritoDetalle;
                
                // Añadimos los botones en los carritos pendientes de pago
                if (carrito.estado != 0) {
                    document.getElementById("detalleCarrito-" + carrito.id).innerHTML = `<div class="pagarDetalleCarrito c-cart-list__item"><button class="c-button">Pagar</button></div>
                                                                                         <div class="recuperarDetalleCarrito c-cart-list__item"><button class="c-button">Recuperar</button></div>
                                                                                         <div class="borrarDetalleCarrito c-cart-list__item"><button class="c-button c-button--danger">Borrar</button></div>`;                     
                }

                //Asignamos los eventos a los botones
                asignarEvento("pagarDetalleCarrito", "click", modalPago);
                asignarEvento("recuperarDetalleCarrito", "click", recuperarCarrito);
                asignarEvento("borrarDetalleCarrito", "click", confirmarBorrar);
                document.getElementsByClassName("volverHistorial")[0].addEventListener("click", () => historialCarritos(activeUser.id));

                dialog.showModal();
            });
        });
}

async function getProductsDetalleCarrito(productos) {
    let htmlProductos = "";
    let precioTotal = 0
    for (const product of productos) {
        let p = await request("GET", "productos/" + product.id_producto)
        htmlProductos += `<div class="c-cart-row c-cart-row--6-columns">
                            <img src="./assets/img/fotosProductos/producto_${p.id}.jpg" class="c-cart-row__img">
                            <div>${p.nombre}</div>
                            <div>${p.descripcion}</div>
                            <div>${p.precio.toFixed(2)}€</div>
                            <div>${product.cantidad}</div>
                            <div>${(p.precio * product.cantidad).toFixed(2)}€</div>
                        </div>`;
        precioTotal += p.precio * product.cantidad;
    }
    return [htmlProductos, precioTotal];
}

function realizarPago(carritoId) {
    let formData = new FormData(document.forms.formPago);
    let newPay = {};
    for (const [key, value] of formData) {
        newPay[key] = value;
    }
    console.log(newPay)
    if (!newPay["nombreTarjeta"] || !newPay["numeroTarjeta"] || !newPay["mesTarjeta"] || !newPay["anyoTarjeta"] || !newPay["codigoSeguridad"]) {
        alert("Por favor rellene todos los campos", "Datos incorrectos");
        return;
    } else {
        console.log(carritoId)
        newPay.fechaCaducidad = newPay.mesTarjeta + "/" + newPay.anyoTarjeta
        newPay.id_carrito = carritoId;
        delete newPay.mesTarjeta;
        delete newPay.anyoTarjeta;
        request("POST", "pagos", newPay)
            .then(request("PATCH", "carritos/" + carritoId, { "estado": 0 })
                .then(() => {
                    document.getElementById("dialog").close()
                    alert("El pago del carrito con id " + carritoId + " se ha realizado correctamente")
                })
                .catch(e => alert("La operación no se ha podido completar. (" + e.statusCode + " - " + e.statusText + ")", "ERROR")))
            .catch(e => alert("La operación no se ha podido completar. (" + e.statusCode + " - " + e.statusText + ")", "ERROR"))
    }
}

function recuperarCarrito(carritoId) {
    //Petición para recuperar el carrito actual (devuelve un array)
    request("GET", "carritoActual/"+activeUser.id, null)
    .then(c => {
        //Con el id, localizamos del array el carrito actual y modificamos su estado para que deje de ser el actual
        request("PATCH", "carritos/"+c[0].id, {"estado": 1})
        .then(() => {
            //Petición para marcar como actual el carrito seleccionado por el usuario
            request("PATCH", "carritos/"+carritoId, {"estado": 2})
            .then(() => {
                //Vaciamos el carrito
                c.productos = [];
                window.localStorage.setItem("carrito", JSON.stringify(c)); 
                //Pintamos el nuevo carrito
                pintarCarritoRecuperado(carritoId);           
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    })
    .catch(() => {
        //Petición para cuando no existe un carrito actual
        request("PATCH", "carritos/"+carritoId, {"estado": 2})
        .then(() => pintarCarritoRecuperado(carritoId))
        .catch(e => console.log(e));
    });
}

function pintarCarritoRecuperado(carritoId) {
    //Petición para recuperar el carrito seleccionado por el usuario
    request("GET", "carritos/" + carritoId, null)
    .then(carritoActual => {
        console.log(carritoActual);
        carritoActual.productos.forEach(p => {
            // carrito = carritoSerialize(JSON.parse(window.localStorage.getItem("carrito")));
            carrito = carritoSerialize(carritoActual);
            let nuevoArticulo = {
                "id_producto": p.id_producto,
                "cantidad": p.cantidad--
            }
            carrito.anyadeArticulo(nuevoArticulo);
            window.localStorage.setItem("carrito", JSON.stringify(carrito));
            carrito.actualizarCarrito();
        }) 
    })
    .catch(e => console.log(e));
}

function confirmarBorrar(carritoId){
    confirmar(carritoId);
}

function borrarCarrito(carritoId) {
    request("DELETE", "carritos/" + carritoId, null)
    .then(res => {
        console.log(res);
        historialCarritos(activeUser.id);
    })
    .catch(e => console.log(e));
}