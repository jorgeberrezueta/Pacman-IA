import { nivel, nuevoNivel, TAMANO_ENTIDADES, TRANSPARENTES } from './util.js';
import { Pacman } from './pacman.js';
import { Fantasma } from './fantasma.js';

export class Escena {

    width;
    height;
    pacman;
    fantasma;
    ctx;

    ultimoFrame = 0;

    estado = 0; // 0 = jugando, 1 = game over

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.inicializarEntidades();
        setInterval(() => {
            if (!this.fantasma) return;
            if (this.fantasma.distanciaAPacmanEnPixeles() < TAMANO_ENTIDADES) {
                this.perdida();
                return;
            }
        }, 1)
    }

    inicializarEntidades() {
        this.pacman = new Pacman(this);
        this.fantasma = new Fantasma(this);
    }

    dibujarFondo(ctx) {
        ctx.fillStyle="#000000";
        ctx.fillRect(0, 0, 1500, 750);
    }

    ubicacionVaciaAleatoria() {
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * 29),
                y: Math.floor(Math.random() * 31)
            }
        } while (TRANSPARENTES.includes(nivel[pos.x][pos.y]));
        return pos;
    }

    click(x, y) {
        if (this.estado != 1) return;
        this.reiniciar();
    }

    perdida() {
        this.estado = 1;
    }

    reiniciar() {
        this.estado = 0;
        nuevoNivel();
        this.inicializarEntidades();
    }
    
    render(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        this.dibujarFondo(ctx)
        let now = performance.now();
        if (this.ultimoFrame > 0) {
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#FFFFFF";
            this.fps = Math.floor(1000 / (now - this.ultimoFrame));
            ctx.fillText(this.fps + " FPS", 5, 210)
        }
        this.ultimoFrame = now;
        if (true) {
            ctx.beginPath();
            ctx.strokeStyle = "#0000FF";
            ctx.lineWidth = "3"
            for (let i = 0; i < nivel.length; i++) {
                for (let j = 0; j < nivel[i].length; j++) {
                    if (nivel[i][j] === 1) {
                        ctx.fillStyle = "#0000FF";
                        ctx.fillRect(j * TAMANO_ENTIDADES + 2, i * TAMANO_ENTIDADES + 2, TAMANO_ENTIDADES - 4, TAMANO_ENTIDADES - 4);
                    } else if (nivel[i][j] === 2) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(j * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2, i * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2, 2, 2)
                    } else if (nivel[i][j] === 3) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(j * TAMANO_ENTIDADES, i * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2 - 1, 20, 2)
                    } else if (nivel[i][j] === 6) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(j * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2 - 4, i * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2 - 4, 8, 8)
                    }
                }
            } 
            ctx.stroke();
        }
        this.fantasma.render(ctx);
        this.pacman.render(ctx);
    }

}