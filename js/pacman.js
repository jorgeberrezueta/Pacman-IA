import { TAMANO_ENTIDADES, PACMAN_SPRITE_1, PACMAN_SPRITE_2, PACMAN_SPRITE_3, crearImagen, VELOCIDAD, convertirDireccion, escalar } from './util.js';

const pacman_sprites = [
    crearImagen(PACMAN_SPRITE_1), 
    crearImagen(PACMAN_SPRITE_2), 
    crearImagen(PACMAN_SPRITE_3), 
];

const intervalo = 200;

export class Pacman {

    escena;
    direccion = 0;
    sprite;
    x;
    y;
    nx;
    ny;
    invulnerable;

    fechaMoviendose;
    moviendoseDesde = {x: this.x, y: this.y}; // {x,y}

    constructor(escena) {
        this.escena = escena;
        this.x = 14;
        this.y = 23;
        this.nx = escalar(this.x);
        this.ny = escalar(this.y);
    }

    moverse(x ,y) {
        if (Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <= 1) {
            this.moviendoseDesde = {x: this.x, y: this.y};
            this.fechaMoviendose = performance.now();
        }
        this.x = x;
        this.y = y;
        this.escena.fantasmas.forEach((f) => f.buscar());
    }

    darInvulnerabilidad() {
        this.invulnerable = true;
        this.escena.fantasmas.forEach((f) => f.actualizarVelocidad());
        setTimeout(() => {
            this.invulnerable = false;
            this.escena.fantasmas.forEach((f) => f.actualizarVelocidad());
        }, 10000);
    }

    render(ctx) {
        let frames = (pacman_sprites.length - 1) * 2; // total de frames
        let tps = intervalo / frames; // tiempo por frame
        let t = performance.now() % intervalo; // tiempo de la secuencia actual
        let frame = Math.floor(t / tps); // frame actual
        let i = frame % pacman_sprites.length; // indice del frame
        if (frame >= pacman_sprites.length) i = frame - pacman_sprites.length + 1; // empezar a bajar

        var sprite = pacman_sprites[Math.min(Math.max(0, i), pacman_sprites.length - 1)];
        ctx.fillStyle = "#000000";
        ctx.save();
        if (performance.now() - this.fechaMoviendose > VELOCIDAD) { // Reposo
            this.nx = this.x * TAMANO_ENTIDADES;
            this.ny = this.y * TAMANO_ENTIDADES;
        } else { // Animación fluida
            let dx = this.moviendoseDesde.x * TAMANO_ENTIDADES - this.x * TAMANO_ENTIDADES;
            let dy = this.moviendoseDesde.y * TAMANO_ENTIDADES - this.y * TAMANO_ENTIDADES;
            this.nx = this.moviendoseDesde.x * TAMANO_ENTIDADES - dx * ((performance.now() - this.fechaMoviendose) / VELOCIDAD);
            this.ny = this.moviendoseDesde.y * TAMANO_ENTIDADES - dy * ((performance.now() - this.fechaMoviendose) / VELOCIDAD);
        }
        let tx = this.nx + (TAMANO_ENTIDADES / 2);
        let ty = this.ny + (TAMANO_ENTIDADES / 2);
        if (convertirDireccion(this.direccion).rot > 0) {
            ctx.translate(tx, ty);
            ctx.rotate(convertirDireccion(this.direccion).rot * Math.PI / 2);
            ctx.translate(-tx, -ty);
        }
        ctx.drawImage(sprite, this.nx, this.ny, TAMANO_ENTIDADES, TAMANO_ENTIDADES);
        ctx.restore();
    }

}