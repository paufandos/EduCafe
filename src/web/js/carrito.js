class Carrito {
	constructor(id, fecha, estado = null, id_usuario = null, productos = []) {
		this.id = id;
		this.fecha = fecha;
		this.estado = estado;
		this.id_usuario = id_usuario;
		this.precioTotal = 0;
		this.productos = productos;
	}

	anyadeArticulo(articulo) {
		let posicion = this.productos.findIndex(e => e.id_producto == articulo.id_producto);
		if (posicion >= 0) {
			this.productos[posicion].cantidad++
		} else {
			this.productos.push(articulo);
		}
	}

	borraArticulo(id_producto) {
		let posicion = this.productos.findIndex(e => e.id_producto == id_producto)
		this.productos.splice(posicion, 1);
		this.actualizarCarrito();
	}

	modificaUnidades(id_producto, n) {
		let posicion = this.productos.findIndex(e => e.id_producto == id_producto)
		if (n == "suma") {
			this.productos[posicion].cantidad++
		} else if (n == "resta" && this.productos[posicion].cantidad > 1) {
			this.productos[posicion].cantidad--
		} else {
			this.borraArticulo(id_producto);
		}
		this.actualizarCarrito();
	}

	actualizarCarrito() {
		if (this.productos != 0) {
			let dialog = document.getElementById("dialog");
			dialog.classList = "c-modal c-modal--large carritoModal";
			let htmlCarrito = ` <div class="c-bubble">
									<div class="l-flex l-flex--align-items-center l-flex--justify-content-space-between g--margin-bottom-5">
										<div class="c-title">Carrito 247</div>
										<i class="c-icon c-icon--close fa-sharp fa-solid fa-xmark close"></i>
									</div>
									<div class="c-cart-row c-cart-row--bold">
										<div></div>
										<div>Nombre</div>
										<div>Descripción</div>
										<div>Precio</div>
										<div>Unidades</div>
										<div>Total</div>
										<div></div>
									</div>`;

			let htmlProductos = "";
			this.getProductos(this, 0, htmlProductos).then((htmlProductos) => {
				htmlCarrito += htmlProductos
				htmlCarrito += `	<div class="c-cart-row__footer l-flex l-flex--align-items-center l-flex--justify-content-space-between">
										<div class="c-title">Importe: ${this.precioTotal.toFixed(2)}€</div>
										<button id="pago" class="c-button">Confirmar carrito</button>
									</div>
								</div`;
				dialog.innerHTML = htmlCarrito;
				animacionSalidaModal("carritoModal");

				
				Array.from(document.getElementsByClassName("mas")).forEach(boton => boton.addEventListener("click", () => { this.modificaUnidades(boton.parentNode.parentNode.id.split("-")[1], "suma") }))
				Array.from(document.getElementsByClassName("menos")).forEach(boton => boton.addEventListener("click", () => { this.modificaUnidades(boton.parentNode.parentNode.id.split("-")[1], "resta") }))
				Array.from(document.getElementsByClassName("eliminar")).forEach(boton => boton.addEventListener("click", () => { this.borraArticulo(boton.parentNode.parentNode.id.split("-")[1]) }))
				document.getElementById("pago").onclick = modalPago;

				if (!dialog.open) {
					dialog.showModal();
				}
			})
		} else {
			dialog.close();
		}
	}

	getProductos(carrito, posicionProducto, htmlProductos) {
		return new Promise(function (resolve, reject) {
			let productos = carrito.productos;
			if (posicionProducto < productos.length) {
				request("GET", "productos/" + productos[posicionProducto].id_producto).then(p => {
					htmlProductos += `<div class="c-cart-row" id="row-${p.id}">
										<img src="./assets/img/fotosProductos/producto_${p.id}.jpg" class="c-cart-row__img">
										<div>${p.nombre}</div>
										<div>${p.descripcion}</div>
										<div>${p.precio.toFixed(2)}€</div>
										<div>${productos[posicionProducto].cantidad}</div>
										<div>${(p.precio * productos[posicionProducto].cantidad).toFixed(2)}€</div>
										<div>
											<button class="c-button mas" >+</button>
											<button class="c-button menos">-</button>
											<button class="c-button c-button--terciario eliminar">Eliminar</button>
										</div>
									</div>`;
					carrito.precioTotal += p.precio * carrito.productos[posicionProducto].cantidad;
					resolve(carrito.getProductos(carrito, posicionProducto + 1, htmlProductos))
				}).catch(e => reject("ERROR -> " + e))
			} else {
				resolve(htmlProductos);
			}
		});
	}
}