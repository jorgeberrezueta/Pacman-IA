import { VELOCIDAD, plantilla, TAMANO_ENTIDADES, TRANSPARENTES, posicionRelativa, escalar, BLINKY_SPRITE, PINKY_SPRITE, INKY_SPRITE, CLYDE_SPRITE } from './util.js';
import { Pacman } from './pacman.js';
import { Fantasma } from './fantasma.js';

export class Escena {

    width;
    height;
    pacman;
    fantasmas = [];
    ctx;
    nivel;
    direccion = 0;

    ultimoFrame = 0;

    estado = 0; // 0 = jugando, 1 = game over

    puntosDisponibles = 0;
    puntos = 0;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.iniciarCasillas();
        this.iniciarEntidades();
        setInterval(() => {
            for (let fantasma of this.fantasmas) {
                if (fantasma.distanciaAPacmanEnPixeles() < Math.pow(TAMANO_ENTIDADES - 2, 2)) {
                    if (!this.pacman.invulnerable) {
                        this.perdida();
                    } else {
                        fantasma.matar();
                        this.puntos += 300;
                    }
                }
            }
        }, 1);
        setInterval(() => {
            if (this.puntosDisponibles <= 0) {
                this.estado = 2; // Ganar
                return;
            }
            if (this.estado > 0) return;
            let { nuevoX, nuevoY } = posicionRelativa(this.pacman.x, this.pacman.y, this.direccion);
            if (this.nivel[nuevoY][nuevoX] === 1 || this.nivel[nuevoY][nuevoX] === 3) {
                return;
            }
            this.pacman.moverse(nuevoX, nuevoY);
            this.pacman.direccion = this.direccion;
            if ([2, 6].includes(this.nivel[nuevoY][nuevoX])) {
                if (this.nivel[nuevoY][nuevoX] == 6) {
                    this.pacman.darInvulnerabilidad();
                    this.puntos += 100;
                }
                this.puntos += 50;
                this.nivel[nuevoY][nuevoX] = 0;
                this.puntosDisponibles--;
            }
        }, VELOCIDAD);
    }

    iniciarCasillas() {
        this.puntos = 0;
        this.puntosDisponibles = 0;
        this.nivel = plantilla.map((arr) => arr.slice());
        for (let fila of this.nivel) {
            for (let columna of fila) {
                if ([2,6].includes(columna)) this.puntosDisponibles++;
            }
        }
    }

    iniciarEntidades() {
        if (this.fantasmas) this.fantasmas.forEach(f => clearInterval(f.tareaID));
        this.pacman = new Pacman(this);
        this.fantasmas = [
            new Fantasma(this, 13, 15, BLINKY_SPRITE, 5, "#FF0000", {minX: 14, minY: 0, maxX: 27, maxY: 15}),
            new Fantasma(this, 14, 15, PINKY_SPRITE, 3, "#FFB8FF", {minX: 0, minY: 0, maxX: 13, maxY: 15}),
            new Fantasma(this, 15, 13, INKY_SPRITE, 5, "#00FFFF", {minX: 14, minY: 15, maxX: 27, maxY: 30}),
            new Fantasma(this, 16, 15, CLYDE_SPRITE, 4, "#FFB852", {minX: 0, minY: 15, maxX: 13, maxY: 30})
        ];
    }

    dibujarFondo(ctx) {
        ctx.fillStyle="#000000";
        ctx.fillRect(0, 0, 1500, 750);
    }

    ubicacionVaciaAleatoria(limites) {
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * 29),
                y: Math.floor(Math.random() * 31)
            }
        } while (
            pos.x < limites.minX || pos.x > limites.maxX ||
            pos.y < limites.minY || pos.y > limites.maxY ||
            !TRANSPARENTES.includes(this.nivel[pos.y][pos.x])
        );
        return pos;
    }

    click(x, y) {
        console.log(x, y);
    }

    perdida() {
        this.estado = 1;
    }

    reiniciar() {
        this.estado = 0;
        this.iniciarCasillas();
        this.iniciarEntidades();
        this.direccion = 0;
    }

    dibujarPuntaje() {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "7px GameOver";
        ctx.fillText("PUNTOS: " + this.puntos, 5, 355);
        ctx.restore();
    }
    
    render(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        this.dibujarFondo(ctx)
        if (this.estado == 1) { // Perdida
            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "bold 30px GameOver";
            ctx.textAlign = "center";
            ctx.fillText("FIN DEL JUEGO", 280, 310);
            ctx.font = "10px GameOver";
            ctx.fillText("Presione espacio para reiniciar", 280, 340);
            ctx.restore();
            return;
        } else if (this.estado == 2) { // Ganador
            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "bold 30px GameOver";
            ctx.textAlign = "center";
            ctx.fillText("GANADOR!", 280, 310);
            ctx.font = "10px GameOver";
            ctx.fillText("Presione espacio para reiniciar", 280, 340);
            ctx.restore();
            return;
        }
        // let now = performance.now();
        // if (this.ultimoFrame > 0) {
        //     ctx.fillStyle = "#FFFFFF";
        //     ctx.strokeStyle = "#FFFFFF";
        //     this.fps = Math.floor(1000 / (now - this.ultimoFrame));
        //     ctx.fillText(this.fps + " FPS", 5, 210)
        // }
        // ctx.fillText(Math.floor(this.pacman.x) + " " + Math.floor(this.pacman.y), 5, 220)
        // this.ultimoFrame = now;
        this.dibujarPuntaje();
        if (true) {
            ctx.beginPath();
            ctx.strokeStyle = "#0000FF";
            ctx.lineWidth = "3"
            for (let i = 0; i < this.nivel.length; i++) {
                for (let j = 0; j < this.nivel[i].length; j++) {
                    if (this.nivel[i][j] === 1) {
                        ctx.fillStyle = "#0000FF";
                        ctx.fillRect(j * TAMANO_ENTIDADES + 2, i * TAMANO_ENTIDADES + 2, TAMANO_ENTIDADES - 4, TAMANO_ENTIDADES - 4);
                    } else if (this.nivel[i][j] === 2) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(j * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2, i * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2, 2, 2)
                    } else if (this.nivel[i][j] === 3) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(j * TAMANO_ENTIDADES, i * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2 - 1, 20, 2)
                    } else if (this.nivel[i][j] === 6) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(j * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2 - 4, i * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2 - 4, 8, 8)
                    }
                }
            } 
            ctx.stroke();
        }
        if (window.mostrarPathfind) this.fantasmas.forEach((f) => f.pathfinder.render(ctx));
        this.fantasmas.forEach((f) => f.render(ctx));
        this.pacman.render(ctx);
    }

}