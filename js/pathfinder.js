import { TRANSPARENTES, TAMANO_ENTIDADES, escalar } from './util.js';

export class Pathfinder {
    fantasma;
    src = {x: 1, y: 1}; // {x, y}
    destino = {x: 1, y: 1};
    camino = [];
    limites;

    height;
    width;

    // color = "#" + Math.floor(Math.random()*16777215).toString(16);
    color;

    // Implementación de https://www.techwithtim.net/tutorials/breadth-first-search/
    
    constructor(fantasma, color, limites) {
        this.fantasma = fantasma;
        this.limites = limites;
        this.height = this.fantasma.escena.nivel.length;
        this.width = this.fantasma.escena.nivel[0].length
        this.color = color;
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
        if (i >= this.width || i < 0 || j >= this.height || j < 0) return false;
        return validos.includes(this.fantasma.escena.nivel[j][i]);
    }

    buscarCamino() {
        this.camino = [];
        let validos = TRANSPARENTES;
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

    buscarSalidaDeSpawn() {
        this.camino = [];
        const izq = [11, 12];
        const der = [15, 16];
        let i = this.src.x;
        let j = this.src.y;
        if (izq.includes(this.src.x)) {
            for (let x = this.src.x; x < 13; x++) {
                this.camino.push({x: ++i, y: j});
            }
        } else if (der.includes(this.src.x)) {
            for (let x = this.src.x; x > 14; x--) {
                this.camino.push({x: --i, y: j});
            }
        }
        for (let x = this.src.y; x > 11; x--) {
            this.camino.push({x: i, y: --j});
        }
        let destino = this.camino[this.camino.length - 1]; 
        this.destino = destino;
    }

    buscarRegresoASpawn() {
        this.destino = {x: 14, y: 11};
        if (this.fantasma.x == this.destino.x && this.fantasma.y == this.destino.y) {
            this.camino = [
                {x: 14, y: 12},
                {x: 14, y: 13},
                {x: 14, y: 14}
            ];
        } else if (this.fantasma.x == 14 && this.fantasma.y == 14) {
            this.camino = [
                {x: 14, y: 14}
            ]
        } else {
            this.buscarCamino();
        }
    }

    estaEnSpawn() {
        return this.src.x >= 11 && this.src.x <= 16 && 
            this.src.y >= 12 && this.src.y <= 15;
    }

    buscar() {
        if (!this.fantasma.escena.pacman.invulnerable) {
            if (this.estaEnSpawn()) {
                this.buscarSalidaDeSpawn();
            } else {
                this.buscarCamino();
            }
        } else {
            this.buscarRegresoASpawn();
        }
    }

    asignarNuevaUbicacionAleatoria() {
        let pos = this.fantasma.escena.ubicacionVaciaAleatoria(this.limites);
        this.destino.x = pos.x;
        this.destino.y = pos.y;
        this.buscar();
    }

    render(ctx) {
        // ctx.fillStyle = "#00AA00"
        ctx.fillStyle = this.color;
        for (let c of this.camino) {
            ctx.fillRect(escalar(c.x) + 2, escalar(c.y) + 2, TAMANO_ENTIDADES - 4, TAMANO_ENTIDADES - 4);
        }
    }

}