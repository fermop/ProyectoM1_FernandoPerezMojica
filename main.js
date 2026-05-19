// Selectores
const botonGenerar = document.getElementById('boton-generar')
const selectCantidad = document.getElementById('select-cantidad-paleta')
const selectFormatoColor = document.getElementById('select-formato-color')

const wrapperPaletaColores = document.getElementById('wrapper-paleta-colores')
const wrapperColors = document.querySelectorAll('.wrapper-color')
const colorFormatoTextos = document.querySelectorAll('.color__formato-texto')

const toastContenedor = document.getElementById('toast-contenedor')

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

async function copiarAlPortapapeles(text) {
  try {
    await navigator.clipboard.writeText(text);
    const toast = document.createElement('div')
    toast.classList.add('toast')
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
      <span>Color copiado al portapapeles</span>
    `

    toastContenedor.appendChild(toast)

    setTimeout(() => {
      toast.classList.add('show')
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show')
      toast.addEventListener('transitionend', () => {
        if (toast.parentElement) {
          toast.remove()
        }
      })
    }, 1000);
  } catch (err) {
    console.error('Error al copiar: ', err);

    const toast = document.createElement('div')
    toast.classList.add('toast')
    toast.classList.add('error')
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
      <span>Error al copiar al portapapeles</span>
    `

    toastContenedor.appendChild(toast)

    setTimeout(() => {
      toast.classList.add('show')
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show')
      toast.addEventListener('transitionend', () => {
        if (toast.parentElement) {
          toast.remove()
        }
      })
    }, 1000);
  }
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

    // Insertar el HTML interno (texto y botón)
    divColor.innerHTML = `
      <p class="color__formato-texto ${esOscuro && 'es-oscuro'}">${colorGenerado}</p>
      <button type="button" class="boton-copiar tooltip-copiar animacion-click cursor-pointer ${esOscuro && 'es-oscuro'}" aria-label="Copiar color al portapapeles" data-tip="Copiar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
    `;

    // 4. Inyectar en el DOM
    wrapperPaletaColores.appendChild(divColor);

    // 5. Agregar función para copiar al portapapeles
    divColor.children[1].addEventListener('click', () => copiarAlPortapapeles(colorGenerado));
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

    // Insertar el HTML interno (texto y botón)
    divColor.innerHTML = `
      <p class="color__formato-texto ${esOscuro && 'es-oscuro'}">${colorGenerado}</p>
      <button type="button" class="boton-copiar tooltip-copiar animacion-click cursor-pointer ${esOscuro && 'es-oscuro'}" aria-label="Copiar color al portapapeles" data-tip="Copiar">
        <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
    `;

    // 4. Inyectar en el DOM
    wrapperPaletaColores.appendChild(divColor);

    // 5. Agregar función para copiar al portapapeles
    divColor.children[1].addEventListener('click', () => copiarAlPortapapeles(colorGenerado));
  }
});