import { Escena } from './js/classes.js';
import { TAMANO_ENTIDADES, VELOCIDAD } from './js/util.js';

window.onload = function() {
    const canvas = document.getElementById("juego");
    var ctx = canvas.getContext("2d");
    let escena = new Escena(canvas.width, canvas.height);

    function dibujar() {
        escena.render(ctx);
        window.requestAnimationFrame(dibujar);
    }

    window.requestAnimationFrame(dibujar);

    let nuevaDireccion = 0;
    let direccion = 0;
    let ultimaTecla = 0; 

    document.addEventListener('keydown', function(event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            nuevaDireccion = event.keyCode - 36;
            revisarTecla();
        }
    }, false);

    document.addEventListener('keyup', function(event) {
        if (ultimaTecla === event.key) {
            // direccion = 0;
        }
        // escena.pacman.direccion = direccion;
    }, false);

    function revisarTecla() {
        // if (nuevaDireccion === 0) return;
        let nuevoX = escena.pacman.x;
        let nuevoY = escena.pacman.y;
        switch (nuevaDireccion) {
            case 1:
                nuevoX -= 1;
                if (nuevoX < 0) nuevoX = (escena.width / TAMANO_ENTIDADES) - 1;
                break;
            case 2:
                nuevoY -= 1;
                if (nuevoY < 0) nuevoY = (escena.height / TAMANO_ENTIDADES) - 1;
                break;
            case 3:
                nuevoX += 1;
                nuevoX %= (escena.width / TAMANO_ENTIDADES);
                break;
            case 4:
                nuevoY += 1;
                nuevoY %= (escena.height / TAMANO_ENTIDADES);
                break;
        }
        if (nivel[nuevoY][nuevoX] !== 1 && nivel[nuevoY][nuevoX] !== 3) {
            direccion = nuevaDireccion;
        } 
    }

    let ultimoSonido = 0;

    setInterval(() => {
        // if (direccion === 0) return;
        let nuevoX = escena.pacman.x;
        let nuevoY = escena.pacman.y;
        switch (direccion) {
            case 1:
                nuevoX -= 1;
                if (nuevoX < 0) nuevoX = (escena.width / TAMANO_ENTIDADES) - 1;
                break;
            case 2:
                nuevoY -= 1;
                if (nuevoY < 0) nuevoY = (escena.height / TAMANO_ENTIDADES) - 1;
                break;
            case 3:
                nuevoX += 1;
                nuevoX %= (escena.width / TAMANO_ENTIDADES);
                break;
            case 4:
                nuevoY += 1;
                nuevoY %= (escena.height / TAMANO_ENTIDADES);
                break;
        }
        if (nivel[nuevoY][nuevoX] === 1 || nivel[nuevoY][nuevoX] === 3) {
            return;
        } 
        escena.pacman.moverse(nuevoX, nuevoY);
        escena.pacman.direccion = direccion;
        if ([2, 6].includes(nivel[nuevoY][nuevoX])) {
            nivel[nuevoY][nuevoX] = 0;
        }
    }, VELOCIDAD);

    window.escena = escena;
    window.ctx = ctx;
}