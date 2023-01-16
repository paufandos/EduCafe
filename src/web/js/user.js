class User {
    constructor(id, nombre, correo) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
    }

    cambiarNombre(nombre) {
        this.nombre = nombre;
    }

    cambiarCorreo(correo) {
        this.correo = correo;
    }
}