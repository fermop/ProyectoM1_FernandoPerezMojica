// Selectores
const botonGenerar = document.getElementById('boton-generar')
const selectCantidad = document.getElementById('select-cantidad-paleta')
const selectFormatoColor = document.getElementById('select-formato-color')

const wrapperPaletaColores = document.getElementById('wrapper-paleta-colores')
const wrapperColors = document.querySelectorAll('.wrapper-color')
const colorFormatoTextos = document.querySelectorAll('.color__formato-texto')

// Variables y estados

// Funciones
const generarColorHsl = function() {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 100)
  const l = Math.floor(Math.random() * 100)

  const colorHslGenerado = `hsl(${h} ${s}% ${l}%)`

  // Determinar si el color generado es oscuro para cambiar el color de letra
    // Se determina si el lightness es menor a 50%
  const esOscuro = l < 50

  return [colorHslGenerado, esOscuro]
}

const generarColorHex = function() {
  // 1. Generamos los valores Rojo (R), Verde (G) y Azul (B) del 0 al 255
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // 2. Aplicamos la fórmula estándar (YIQ) para calcular el brillo percibido
  // Si el resultado es menor a 128, el ojo humano lo percibe como un color oscuro
  const luminancia = (r * 299 + g * 587 + b * 114) / 1000;
  const esOscuro = luminancia < 128;

  // 3. Convertimos cada número a texto en formato hexadecimal (base 16)
  // padStart(2, '0') asegura que si el valor es por ejemplo "5", se escriba como "05"
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  const colorHexGenerado = `#${hexR}${hexG}${hexB}`.toUpperCase();

  return [colorHexGenerado, esOscuro];
}

// Eventos
  // Al visitar la página, renderizar colores por defecto
document.addEventListener('DOMContentLoaded', function() {
  // 1. Obtener los valores de los selects
  const cantidadDeColoresAGenerar = Number(selectCantidad.value);
  const formatoDeColoresAGenerar = selectFormatoColor.value;

  // 2. Limpiar el contenedor principal antes de agregar los nuevos
  wrapperPaletaColores.innerHTML = '';

  // 3. Iterar y crear los nuevos elementos
  for (let i = 0; i < cantidadDeColoresAGenerar; i++) {  
    const [colorGenerado, esOscuro] = generarColorHsl();

    // Crear el contenedor principal del color
    const divColor = document.createElement('div');
    divColor.classList.add('wrapper-color');
    divColor.style.backgroundColor = colorGenerado;
    divColor.style.color = esOscuro ? 'white' : 'black';

    // Insertar el HTML interno (texto y botón)
    divColor.innerHTML = `
      <p class="color__formato-texto">${colorGenerado}</p>
      <button type="button" class="boton-copiar animacion-click" aria-label="Copiar color al portapapeles">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
    `;

    // 4. Inyectar en el DOM
    wrapperPaletaColores.appendChild(divColor);
  }
});


botonGenerar.addEventListener('click', function(e) {
  e.preventDefault();

  // 1. Obtener los valores de los selects
  const cantidadDeColoresAGenerar = Number(selectCantidad.value);
  const formatoDeColoresAGenerar = selectFormatoColor.value;

  // 2. Limpiar el contenedor principal antes de agregar los nuevos
  wrapperPaletaColores.innerHTML = '';

  // 3. Iterar y crear los nuevos elementos
  for (let i = 0; i < cantidadDeColoresAGenerar; i++) {
    let colorGenerado;
    let esOscuro;
    
    // Generar los datos del color
    if (formatoDeColoresAGenerar === 'hsl') {
      [colorGenerado, esOscuro] = generarColorHsl();
    } else if (formatoDeColoresAGenerar === 'hex') {
      [colorGenerado, esOscuro] = generarColorHex();
    }

    // Crear el contenedor principal del color
    const divColor = document.createElement('div');
    divColor.classList.add('wrapper-color');
    divColor.style.backgroundColor = colorGenerado;
    divColor.style.color = esOscuro ? 'white' : 'black';

    // Insertar el HTML interno (texto y botón)
    divColor.innerHTML = `
      <p class="color__formato-texto">${colorGenerado}</p>
      <button type="button" class="boton-copiar" aria-label="Copiar color al portapapeles">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
    `;

    // 4. Inyectar en el DOM
    wrapperPaletaColores.appendChild(divColor);
  }
});