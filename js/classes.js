import { nivel, TAMANO_ENTIDADES, PACMAN_SPRITE_1, PACMAN_SPRITE_2, PACMAN_SPRITE_3, crearImagen, VELOCIDAD } from './util.js';

const sprites = [
    crearImagen(PACMAN_SPRITE_1), 
    crearImagen(PACMAN_SPRITE_2), 
    crearImagen(PACMAN_SPRITE_3), 
];


const dir = [
    {rot: 0, x: 0, y: 0}, // 0
    {rot: 2, x: 1, y: 1}, // 1
    {rot: 3, x: 0, y: 1}, // 2 
    {rot: 0, x: 0, y: 0}, // 3
    {rot: 1, x: 1, y: 0}  // 4
];

const intervalo = 200;

export class Pacman {

    escena;
    direccion = 0;
    sprite;
    x = 14;
    y = 17;

    fechaMoviendose;
    moviendoseDesde = {x: this.x, y: this.y}; // {x,y}

    moverse(x ,y) {
        if (Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <= 1) {
            this.moviendoseDesde = {x: this.x, y: this.y};
            this.fechaMoviendose = performance.now();
        }
        this.x = x;
        this.y = y;
    }

    constructor(escena) {
        this.escena = escena;
    }

    render(ctx) {
        let frames = (sprites.length - 1) * 2; // total de frames
        let tps = intervalo / frames; // tiempo por frame
        let t = performance.now() % intervalo; // tiempo de la secuencia actual
        let frame = Math.floor(t / tps); // frame actual
        let i = frame % sprites.length; // indice del frame
        if (frame >= sprites.length) i = frame - sprites.length + 1; // empezar a bajar

        var sprite = sprites[Math.min(Math.max(0, i), sprites.length - 1)];
        ctx.fillStyle = "#000000";
        ctx.save();
        let nx;
        let ny;
        if (performance.now() - this.fechaMoviendose > VELOCIDAD) { // Reposo
            nx = this.x * TAMANO_ENTIDADES;
            ny = this.y * TAMANO_ENTIDADES;
        } else { // Animación fluida
            let dx = this.moviendoseDesde.x * TAMANO_ENTIDADES - this.x * TAMANO_ENTIDADES;
            let dy = this.moviendoseDesde.y * TAMANO_ENTIDADES - this.y * TAMANO_ENTIDADES;
            nx = this.moviendoseDesde.x * TAMANO_ENTIDADES - dx * ((performance.now() - this.fechaMoviendose) / VELOCIDAD);
            ny = this.moviendoseDesde.y * TAMANO_ENTIDADES - dy * ((performance.now() - this.fechaMoviendose) / VELOCIDAD);
        }
        let tx = nx + (TAMANO_ENTIDADES / 2);
        let ty = ny + (TAMANO_ENTIDADES / 2);
        if (this.direccion > 0) {
            ctx.translate(tx, ty);
            ctx.rotate(dir[this.direccion].rot * Math.PI / 2);
            ctx.translate(-tx, -ty);
        }
        ctx.drawImage(sprite, nx, ny, TAMANO_ENTIDADES, TAMANO_ENTIDADES);
        ctx.restore();
        // ctx.fillText(`${this.x}, ${this.y}`, 5, 10);
        // ctx.rect(this.x * TAMANO_ENTIDADES, this.y * TAMANO_ENTIDADES, TAMANO_ENTIDADES, TAMANO_ENTIDADES);
        // ctx.stroke();
    }

}

export class Escena {

    width;
    height;
    pacman;
    fantasma;
    ctx;
    ultimoFrame = 0;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.pacman = new Pacman(this);
    }

    dibujarFondo(ctx) {
        ctx.fillStyle="#000000";
        ctx.fillRect(0, 0, 1500, 750);
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
                        ctx.rect(j * TAMANO_ENTIDADES + 2, i * TAMANO_ENTIDADES + 2, TAMANO_ENTIDADES - 4, TAMANO_ENTIDADES - 4);
                    } else if (nivel[i][j] === 2) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(j * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2, i * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2, 2, 2)
                    } else if (nivel[i][j] === 3) {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(j * TAMANO_ENTIDADES, i * TAMANO_ENTIDADES + TAMANO_ENTIDADES / 2 - 1, 20, 2)
                    }
                }
            } 
            ctx.stroke();
        }
        this.pacman.render(ctx);
    }

}