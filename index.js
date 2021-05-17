import { Escena } from './js/classes.js';
import { posicionRelativa, TAMANO_ENTIDADES, VELOCIDAD } from './js/util.js';

window.mostrarPathfind = false;

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

    document.addEventListener('mousedown', function(event) {
        var rect = event.target.getBoundingClientRect();
        var x = Math.floor((event.clientX - rect.left) / TAMANO_ENTIDADES);
        var y = Math.floor((event.clientY - rect.top) / TAMANO_ENTIDADES);
        console.log(x, y);
    }, false);

    function revisarTecla() {
        // if (nuevaDireccion === 0) return;
        let { nuevoX, nuevoY } = posicionRelativa(escena.pacman.x, escena.pacman.y, nuevaDireccion);
        if (nivel[nuevoY][nuevoX] !== 1 && nivel[nuevoY][nuevoX] !== 3) {
            direccion = nuevaDireccion;
        } 
    }

    let ultimoSonido = 0;

    setInterval(() => {
        let { nuevoX, nuevoY } = posicionRelativa(escena.pacman.x, escena.pacman.y, direccion);
        if (nivel[nuevoY][nuevoX] === 1 || nivel[nuevoY][nuevoX] === 3) {
            return;
        }
        escena.pacman.moverse(nuevoX, nuevoY);
        escena.pacman.direccion = direccion;
        if ([2, 6].includes(nivel[nuevoY][nuevoX])) {
            if (nivel[nuevoY][nuevoX] == 6) {
                escena.pacman.darInvulnerabilidad();
            }
            nivel[nuevoY][nuevoX] = 0;
        }
    }, VELOCIDAD);

    window.escena = escena;
    window.ctx = ctx;
}