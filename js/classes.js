import { nivel, TAMANO_ENTIDADES, PACMAN_SPRITE_1, PACMAN_SPRITE_2, PACMAN_SPRITE_3, FANTASMA_SPRITE, crearImagen, VELOCIDAD, direcciones, convertirDireccion, escalar } from './util.js';

const pacman_sprites = [
    crearImagen(PACMAN_SPRITE_1), 
    crearImagen(PACMAN_SPRITE_2), 
    crearImagen(PACMAN_SPRITE_3), 
];

const fantasma_sprite = crearImagen(FANTASMA_SPRITE);

const intervalo = 200;

export class Pacman {

    escena;
    direccion = 0;
    sprite;
    x = 14;
    y = 17;

    fechaMoviendose;
    moviendoseDesde = {x: this.x, y: this.y}; // {x,y}

    constructor(escena) {
        this.escena = escena;
    }

    moverse(x ,y) {
        if (Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <= 1) {
            this.moviendoseDesde = {x: this.x, y: this.y};
            this.fechaMoviendose = performance.now();
        }
        this.x = x;
        this.y = y;
        this.escena.fantasma.buscar();
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
        if (convertirDireccion(this.direccion).rot > 0) {
            ctx.translate(tx, ty);
            ctx.rotate(convertirDireccion(this.direccion).rot * Math.PI / 2);
            ctx.translate(-tx, -ty);
        }
        ctx.drawImage(sprite, nx, ny, TAMANO_ENTIDADES, TAMANO_ENTIDADES);
        ctx.restore();
    }

}

const height = nivel.length;
const width = nivel[0].length;
const transparentes = [0, 2];
const spawn = [3, 4];

export class Pathfinder {
    fantasma;
    src = {x: 1, y: 1}; // {x, y}
    destino = {x: 1, y: 1};
    camino = [];

    // Implementación de https://www.techwithtim.net/tutorials/breadth-first-search/
    
    constructor(fantasma) {
        this.fantasma = fantasma;
    }

    buscarFinal(movimientos) {
        let i = this.src.x;
        let j = this.src.y;
        for (let c of movimientos) {
            if (c === "L") i--;
            else if (c === "R") i++;
            else if (c === "U") j--;
            else if (c === "D") j++;
        }
        if (this.destino.x == i && this.destino.y == j) {
            return true;
        }
    }

    valido(validos, movimientos) {
        if (movimientos.length >= 2) { // Optimización: Prevenir movimientos redundantes
            let ultimos = movimientos.slice(-2);
            if (ultimos.includes("L") && ultimos.includes("R")) return false;
            if (ultimos.includes("U") && ultimos.includes("D")) return false;
        }
        let i = this.src.x;
        let j = this.src.y;
        for (let c of movimientos) {
            if (c === "L") i--;
            else if (c === "R") i++;
            else if (c === "U") j--;
            else if (c === "D") j++;
        }
        if (i >= width || i < 0 || j >= height || j < 0) return false;
        return validos.includes(nivel[j][i]);
    }

    buscarCamino() {
        this.camino = [];
        let validos = transparentes;
        let queue = [""];
        let movs = "";
        let vueltas = 0;
        while (!this.buscarFinal(movs)) {
            movs = queue.shift();
            for (let j of ["L", "R", "U", "D"]) {
                let nuevo = movs + j;
                if (this.valido(validos, nuevo)) {
                    queue.push(nuevo);
                }
            }
            vueltas++;
            if (vueltas >= 1000) break;
        }
        let i = this.src.x;
        let j = this.src.y;
        for (let c of movs) {
            if (c === "L") i--;
            else if (c === "R") i++;
            else if (c === "U") j--;
            else if (c === "D") j++;
            this.camino.push({x: i, y: j});
        }
    }

    buscar() {
        this.buscarCamino();
    }

    asignarNuevaUbicacionAleatoria() {
        let pos = this.fantasma.escena.ubicacionVaciaAleatoria();
        this.destino.x = pos.x;
        this.destino.y = pos.y;
        this.buscar();
    }

    render(ctx) {
        ctx.fillStyle = "#00AA00"
        for (let c of this.camino) {
            ctx.fillRect(escalar(c.x) + 2, escalar(c.y) + 2, TAMANO_ENTIDADES - 4, TAMANO_ENTIDADES - 4);
        }
    }

}

export class Fantasma {
    x = 14;
    y = 14 - 3;
    direccion = 0;
    escena;
    pathfinder = new Pathfinder(this);
    fechaMoviendose = 0;
    moviendoseDesde = {x: this.x, y: this.y}; // {x,y}
    siguiendoAPacman = true;

    constructor(escena) {
        this.escena = escena;
        this.buscar = this.buscar.bind(this);
        this.buscar();
        setInterval(() => {
            let pos = this.pathfinder.camino.shift();
            if (pos) this.moverse(pos.x, pos.y);
            else if (!this.siguiendoAPacman) this.pathfinder.asignarNuevaUbicacionAleatoria();
        }, VELOCIDAD);
    }

    buscar() {
        let pacman = this.escena.pacman;
        this.pathfinder.src.x = this.x;
        this.pathfinder.src.y = this.y;
        if (this.siguiendoAPacman && this.distanciaAPacman() > Math.pow(10, 2)) {
            this.siguiendoAPacman = false
            this.pathfinder.asignarNuevaUbicacionAleatoria();
        } else {
            if (this.distanciaAPacman() < Math.pow(10, 2)) {
                this.pathfinder.destino.x = pacman.x;
                this.pathfinder.destino.y = pacman.y;
                this.pathfinder.buscar();
            }
        }
    }

    moverse(x ,y) {
        if (Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <= 1) {
            this.moviendoseDesde = {x: this.x, y: this.y};
            this.fechaMoviendose = performance.now();
        }
        this.x = x;
        this.y = y;
        this.buscar();
    }

    distanciaAPacman() {
        let dx = this.x - this.escena.pacman.x;
        let dy = this.y - this.escena.pacman.y;
        return dx * dx + dy * dy;
    }

    render(ctx) {
        let nx;
        let ny;
        if (performance.now() - this.fechaMoviendose > VELOCIDAD) { // Reposo
            nx = escalar(this.x);
            ny = escalar(this.y);
        } else { // Animación fluida
            let dx = escalar(this.moviendoseDesde.x - this.x);
            let dy = escalar(this.moviendoseDesde.y - this.y);
            nx = escalar(this.moviendoseDesde.x) - dx * ((performance.now() - this.fechaMoviendose) / VELOCIDAD);
            ny = escalar(this.moviendoseDesde.y) - dy * ((performance.now() - this.fechaMoviendose) / VELOCIDAD);
        }
        ctx.drawImage(fantasma_sprite, nx, ny, TAMANO_ENTIDADES, TAMANO_ENTIDADES);
        // this.pathfinder.render(ctx);
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
        this.fantasma = new Fantasma(this);
        window.pathfinder = this.pathfinder;
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
        } while (transparentes.includes(nivel[pos.x][pos.y]));
        return pos;
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