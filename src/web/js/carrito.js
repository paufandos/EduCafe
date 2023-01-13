class Carrito{
	constructor(id){
		this.id=id;
		this.listaCarrito=[];
						
	}
						
	anyadeArticulo(articulo){	
		let codigo=articulo.codigo;
		if(this.listaCarrito.find(e=> e.codigo==codigo)){
			articulo.unidades++;
			//this.modificaUnidades(codigo,1)
		}else{
			articulo.unidades=1;
			this.listaCarrito.push(articulo);
			//console.log(this.listaCarrito);
		}
		
		}			
				
	borraArticulo(codigo){		
		console.log(codigo);
		let indice = this.listaCarrito.findIndex(e=> e.codigo==codigo)
		this.listaCarrito.splice(indice,1);
		this.actualizarCarrito();
	}
	
	modificaUnidades(codigo,n){
		let articulo = this.listaCarrito.find(e=> e.codigo==codigo)
		console.log(articulo)
		if(n=="suma"){
			articulo.unidades++;
		}else if(n=="resta"&& articulo.unidades>1){
			articulo.unidades--;			
		}else{
			this.borraArticulo(articulo.codigo);
		}
		this.actualizarCarrito();
	}	
			
	actualizarCarrito(){	
		if(this.listaCarrito!=0){		
			let precioTotal=0;				
			let dialog = document.getElementById("dialog");
			dialog.close();
			dialog.classList = "c-modal c-modal--large carritoModal";
			let codigo="";
				codigo+=` 
				<div class="c-bubble">
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
                </div>
                <div class="c-cart-row">`;
				this.listaCarrito.forEach(element => {
				codigo+=`
					<img src="./assets/img/fotosProductos/${element.codigo}" class="c-cart-row__img">
					<div>${element.nombre}</div>
					<div>${element.descripcion}</div>
					<div>${element.precio+"€"}</div>
					<div>${element.unidades}</div>
					<div>${element.precio*element.unidades+"€"}</div>
					<div>
						<button class="c-button mas" >+</button>
						<button class="c-button menos">-</button>
						<button class="c-button c-button--terciario eliminar">Eliminar</button>
					</div>`	
					precioTotal+=element.precio*element.unidades;
			});
			codigo+=`</div>`;			

				//let botones=document.getElementsByClassName("borrar");
				//añadir click a los botones y asociarle los metodos
				codigo+=`<div class="c-cart-row__footer l-flex l-flex--align-items-center l-flex--justify-content-space-between">
                <div class="c-title">${precioTotal}</div>
                <button id="pago" class="c-button">Confirmar carrito</button>
                </div>`
				dialog.innerHTML+=codigo;

				fadeAnimation("carritoModal");
    			document.getElementById("pago").onclick = modalPago;
    			dialog.showModal();
		}else{
			dialog.close();
		}
	}			
}
