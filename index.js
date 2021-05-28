import { Escena } from './js/escena.js';
import { posicionRelativa, TAMANO_ENTIDADES } from './js/util.js';

window.mostrarPathfind = false;

// new FontFace('GameOver', 'url(\'./ttf/game_over.ttf\')').load();

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

    document.addEventListener('keydown', function(event) {
        if (escena.estado >= 1) {
            if (event.keyCode == 32) {
                escena.reiniciar();
            } else return;
        }
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            nuevaDireccion = event.keyCode - 36;
            revisarTecla();
        }
    }, false);

    document.addEventListener('mousedown', function(event) {
        var rect = event.target.getBoundingClientRect();
        var x = Math.floor((event.clientX - rect.left) / TAMANO_ENTIDADES);
        var y = Math.floor((event.clientY - rect.top) / TAMANO_ENTIDADES);
        escena.click(x, y);
    }, false);

    function revisarTecla() {
        // if (nuevaDireccion === 0) return;
        let { nuevoX, nuevoY } = posicionRelativa(escena.pacman.x, escena.pacman.y, nuevaDireccion);
        if (escena.nivel[nuevoY][nuevoX] !== 1 && escena.nivel[nuevoY][nuevoX] !== 3) {
            escena.direccion = nuevaDireccion;
        } 
    }

    window.escena = escena;
    window.ctx = ctx;
}