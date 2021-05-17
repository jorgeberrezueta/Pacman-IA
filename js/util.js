export const PACMAN_SPRITE_1 = 'sprites/pacman_1.svg';
export const PACMAN_SPRITE_2 = 'sprites/pacman_2.svg';
export const PACMAN_SPRITE_3 = 'sprites/pacman_3.svg';

export const FANTASMA_SPRITE = 'sprites/fantasma.svg';
export const FANTASMA_COMIBLE_SPRITE = 'sprites/fantasma_comible.svg';

export const TAMANO_ENTIDADES = 20;
export const VELOCIDAD = 200; // Mas alto = mas lento
export const VELOCIDAD_COMIBLE = 300; // Mas alto = mas lento
//29*31
export const nivel = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
	[1, 6, 1, 4, 4, 1, 2, 1, 4, 4, 4, 1, 2, 1, 1, 2, 1, 4, 4, 4, 1, 2, 1, 4, 4, 1, 6, 1],
	[1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
	[1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
	[1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
	[1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
	[5, 5, 5, 5, 5, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 5, 5, 5, 5, 5],
	[5, 5, 5, 5, 5, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 5, 5, 5, 5, 5],
	[5, 5, 5, 5, 5, 1, 2, 1, 1, 0, 1, 1, 1, 3, 3, 1, 1, 1, 0, 1, 1, 2, 1, 5, 5, 5, 5, 5],
	[1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
	[5, 5, 5, 5, 5, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 5, 5, 5, 5, 5],
	[5, 5, 5, 5, 5, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 5, 5, 5, 5, 5],
	[5, 5, 5, 5, 5, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 5, 5, 5, 5, 5],
	[1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
	[1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
	[1, 6, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 6, 1],
	[1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
	[1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
	[1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
	[1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

export const direcciones = {
    REPOSO:     {x:  0, y:  0, rot: 0},
    IZQUIERDA:  {x: -1, y:  0, rot: 2},
    ARRIBA:     {x:  0, y: -1, rot: 3},
    DERECHA:    {x:  1, y:  0, rot: 0},
    ABAJO:      {x:  0, y:  1, rot: 1},
};

const dirs = [direcciones.REPOSO, direcciones.IZQUIERDA, direcciones.ARRIBA, direcciones.DERECHA, direcciones.ABAJO];

export function convertirDireccion(i) {
    if (i < 0 || i >= dirs.length) return direcciones.REPOSO;
    return dirs[i];
}

window.nivel = nivel;

export function crearImagen(url) {
    let img = new Image()
    img.src = url;
    return img;
}

// Convertir posicion de cuadro a posicion absoluta del frame
export function escalar(x) {
    return x * TAMANO_ENTIDADES;
}

export function posicionRelativa(nuevoX, nuevoY, direccion) {
    switch (direccion) {
        case 1: // L
            nuevoX -= 1;
            if (nuevoX < 0) nuevoX = (escena.width / TAMANO_ENTIDADES) - 1;
            break;
        case 2: // U
            nuevoY -= 1;
            if (nuevoY < 0) nuevoY = (escena.height / TAMANO_ENTIDADES) - 1;
            break;
        case 3: // R
            nuevoX += 1;
            nuevoX %= (escena.width / TAMANO_ENTIDADES);
            break;
        case 4: // D
            nuevoY += 1;
            nuevoY %= (escena.height / TAMANO_ENTIDADES);
            break;
    }
    return {nuevoX, nuevoY};
}