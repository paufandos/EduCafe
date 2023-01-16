class Carrito{
	constructor(id, fecha, estado=null, id_usuario=null, productos=[]){
		this.id=id;
		this.fecha=fecha;
		this.estado=estado;
		this.id_usuario=id_usuario;
		this.productos=productos;
	}
						
	anyadeArticulo(articulo){	
		let pos=this.productos.findIndex(e=> e.id==articulo.id);
		if(pos>=0){
			this.productos[pos].unidades++
		}else{
			articulo.unidades=1;
			this.productos.push(articulo);
		}
	}			
				
	borraArticulo(id){		
		let indice = this.productos.findIndex(e=> e.id==id)
		this.productos.splice(indice,1);
		this.actualizarCarrito();
	}
	
	modificaUnidades(id,n){
		let pos = this.productos.findIndex(e=> e.id==id)
		if(n=="suma"){
			this.productos[pos].unidades++
		}else if(n=="resta"&& this.productos[pos].unidades>1){
			this.productos[pos].unidades--	
		}else{
			this.borraArticulo(id);
		}
		this.actualizarCarrito();


	}
			
	actualizarCarrito(){	
		if(this.productos!=0){		
			let precioTotal=0;				
			let dialog = document.getElementById("dialog");
			//dialog.close();
			dialog.innerHTML="";
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
                </div>`;
                
				this.productos.forEach(element => {
				codigo+=`
				<div class="c-cart-row" id="row-${element.id}">
					<img src="./assets/img/fotosProductos/producto_${element.id}.jpg" class="c-cart-row__img">
					<div>${element.nombre}</div>
					<div>${element.descripcion}</div>
					<div>${element.precio.toFixed(2)}€</div>
					<div>${element.unidades}</div>
					<div>${(element.precio*element.unidades).toFixed(2)}€</div>
					<div>
						<button class="c-button mas" >+</button>
						<button class="c-button menos">-</button>
						<button class="c-button c-button--terciario eliminar">Eliminar</button>
					</div>
				</div>`	
					precioTotal+=element.precio*element.unidades;
			});		
				//let botones=document.getElementsByClassName("borrar");

				codigo+=`<div class="c-cart-row__footer l-flex l-flex--align-items-center l-flex--justify-content-space-between">
                <div class="c-title">Importe: ${precioTotal.toFixed(2)}€</div>
                <button id="pago" class="c-button">Confirmar carrito</button>
                </div>`
				dialog.innerHTML+=codigo;
				fadeAnimation("carritoModal");

				Array.from(document.getElementsByClassName("mas")).forEach(boton=> boton.addEventListener("click",()=>{this.modificaUnidades(boton.parentNode.parentNode.id.split("-")[1],"suma")}))
				Array.from(document.getElementsByClassName("menos")).forEach(boton=> boton.addEventListener("click",()=>{this.modificaUnidades(boton.parentNode.parentNode.id.split("-")[1], "resta")}))
				Array.from(document.getElementsByClassName("eliminar")).forEach(boton=> boton.addEventListener("click",()=>{this.borraArticulo(boton.parentNode.parentNode.id.split("-")[1])}))
				
    			document.getElementById("pago").onclick = modalPago;
				if (!dialog.open) {
					dialog.showModal();
				}
    			
		}else{
			dialog.close();
		}
	}
	
	
}


