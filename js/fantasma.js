import { TAMANO_ENTIDADES, FANTASMA_COMIBLE_SPRITE, VELOCIDAD, VELOCIDAD_COMIBLE, crearImagen, escalar } from "./util.js";
import { Pathfinder } from './pathfinder.js';

const fantasma_comible_sprite = crearImagen(FANTASMA_COMIBLE_SPRITE);

export class Fantasma {
    xi; // Posicion inicial
    yi;
    x; // Posicion actual
    y;
    nx; // Posicion actual exacta (pixeles)
    ny;
    direccion = 0;
    escena;
    pathfinder;
    fechaMoviendose = 0;
    moviendoseDesde = {x: this.x, y: this.y}; // {x,y}
    siguiendoAPacman = true;
    velocidad = VELOCIDAD;
    sprite;
    rango;
    fechaMuerte = -100000;

    tareaID;

    constructor(escena, x, y, urlSprite, rango, color, limites) {
        this.escena = escena;
        this.xi = x;
        this.yi = y;
        this.x = x;
        this.y = y;
        this.sprite = crearImagen(urlSprite);
        this.rango = rango;
        this.pathfinder = new Pathfinder(this, color, limites)
        this.buscar = this.buscar.bind(this);
        this.tarea = this.tarea.bind(this);
        this.buscar();
        this.actualizarVelocidad();
    }

    actualizarVelocidad() {
        clearInterval(this.tareaID)
        if (!this.escena.pacman.invulnerable) this.velocidad = VELOCIDAD;
        else this.velocidad = VELOCIDAD_COMIBLE;
        this.pathfinder.camino = [];
        this.buscar();
        this.tareaID = setInterval(this.tarea, this.velocidad);
    }

    tarea() {
        if (escena.estado > 0) return; // Fin del juego
        if (this.estaMuerto()) return;
        let pos = this.pathfinder.camino.shift();
        if (pos) this.moverse(pos.x, pos.y);
        else if (!this.siguiendoAPacman) {
            this.pathfinder.asignarNuevaUbicacionAleatoria();
            this.tarea();
        }
    }

    buscar() {
        let pacman = this.escena.pacman;
        this.pathfinder.src.x = this.x;
        this.pathfinder.src.y = this.y;
        if (this.distanciaAPacman() > Math.pow(this.rango, 2)) { // Distancia de busqueda
            if (this.siguiendoAPacman) {
                this.siguiendoAPacman = false
                this.pathfinder.asignarNuevaUbicacionAleatoria();
            }
        } else {
            this.pathfinder.destino.x = pacman.x;
            this.pathfinder.destino.y = pacman.y;
            this.pathfinder.buscar();
        }
    }

    moverse(x ,y) {
        if (escena.estado > 0) return; // Game over
        if (Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <= 1) {
            this.moviendoseDesde = {x: this.x, y: this.y};
            this.fechaMoviendose = performance.now();
        }
        this.x = x;
        this.y = y;
        if (this.estaMuerto()) return;
        this.buscar();
    }

    distanciaAPacman() {
        let dx = this.x - this.escena.pacman.x;
        let dy = this.y - this.escena.pacman.y;
        return dx * dx + dy * dy;
    }

    distanciaAPacmanEnPixeles() {
        let dx = this.nx - this.escena.pacman.nx;
        let dy = this.ny - this.escena.pacman.ny;
        return dx * dx + dy * dy;
    }

    estaMuerto() {
        return performance.now() - this.fechaMuerte < 10000;
    }

    matar() {
        this.moverse(this.xi, this.yi);
        this.fechaMuerte = performance.now();
        this.pathfinder.camino = [];
    }

    render(ctx) {
        if (this.estaMuerto()) return;
        let spriteVisible;

        if (this.escena.pacman.invulnerable) spriteVisible = fantasma_comible_sprite;
        else spriteVisible = this.sprite;

        if (performance.now() - this.fechaMoviendose > this.velocidad) { // Reposo
            this.nx = escalar(this.x);
            this.ny = escalar(this.y);
        } else { // Animación fluida
            let dx = escalar(this.moviendoseDesde.x - this.x);
            let dy = escalar(this.moviendoseDesde.y - this.y);
            this.nx = escalar(this.moviendoseDesde.x) - dx * ((performance.now() - this.fechaMoviendose) / this.velocidad);
            this.ny = escalar(this.moviendoseDesde.y) - dy * ((performance.now() - this.fechaMoviendose) / this.velocidad);
        }
        ctx.drawImage(spriteVisible, this.nx, this.ny, TAMANO_ENTIDADES, TAMANO_ENTIDADES);
    }

}
