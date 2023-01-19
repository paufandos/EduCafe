const ESTADO_CARRITO = { 0: "Pago realizado", 1: "Pendiente de pago", 2: "Pendiente de pago (actual)" };
let activeUser
let carrito;

window.onload = () => {
    //localStorage.clear()
    if (!localStorage.getItem('carrito')) {
        window.localStorage.setItem("carrito", JSON.stringify(new Carrito(Date.now(), new Date().getFormattedDate())));
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
                layout.innerHTML += `<div id="card-${cat.id}" class="c-card">
                                        <div class="c-card__nombre">${cat.nombre.toUpperCase()}</div>
                                        <img src="./assets/img/${cat.nombre}.jpg" class="c-card__imagen" alt="${cat.nombre}" />
                                    </div>`;
            });
            asignarEvento("c-card__imagen", "click", mostrarProductos)
        })
        //catch de la promesa
        .catch(error => {
            console.log("Error" + error);
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
            animacionSalidaModal("detalleProductoModal");
            dialog.showModal();
        })
        .catch(error => {
            console.log("Error" + error)
        });


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
        alert("carrito vacio")
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
            window.localStorage.setItem("carrito", JSON.stringify(carrito))
        })
        .catch(e => console.log(e + " no se ha encontrado articulo"))
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
                window.localStorage.setItem("isLogin", "true");
                window.localStorage.setItem("user", JSON.stringify(new User(usuario.id, usuario.nombre, usuario.correo)));
                activeUser = userSerialize(JSON.parse(window.localStorage.getItem("user")))
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
                            <div id="user-${user.id}">
                                <i id="cart-list_icon" class="c-icon fa-solid fa-list"></i>
                                Historial de carritos
                            </div>
                        </div>`;
    animacionSalidaModal("miCuenta");
    asignarEvento("fa-list", "click", historialCarritos)
    dialog.showModal();
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
            asignarEvento("borrar", "click", borrarCarrito);

            //Añadimos la animación de salida al modal
            animacionSalidaModal("historialCarritoModal");
            if (!dialog.open) {
                // dialog.close();
                dialog.showModal();
            }
        });
}

function verDetalleCarrito(carritoId) {
    console.log("Detalle"+carritoId);
}


function realizarPago(carritoId) {
    let formData = new FormData(document.forms.formPago);
    let newPay = {};
    for (const [key, value] of formData) {
        newPay[key] = value;
    }

    if (!newPay["nombreTarjeta"] || !newPay["numeroTarjeta"] || !newPay["mesTarjeta"] || !newPay["anyoTarjeta"] || !newPay["codigoSeguridad"]) {
        alert("Por favor rellene todos los campos");
        return;
    }

    newPay.fechaCaducidad = newPay.mesTarjeta + "/" + newPay.anyoTarjeta
    newPay.id_carrito = carritoId;
    delete newPay.mesTarjeta;
    delete newPay.anyoTarjeta;
    request("POST", "pagos", newPay)
        .then(request("PATCH", "carritos/" + carritoId, { "estado": 0 })
            .then(historialCarritos(activeUser.id))
            .catch(e => console.log(e)))
        .catch(e => console.log(e))
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

function borrarCarrito(carritoId) {
    request("DELETE", "carritos/" + carritoId, null)
    .then(res => {
        console.log(res);
        historialCarritos(activeUser.id);
    })
    .catch(e => console.log(e));;
}