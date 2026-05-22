/* ==========================================================================
   Selectores del DOM
   ========================================================================== */
const botonGenerar = document.getElementById('boton-generar')
const selectCantidad = document.getElementById('select-cantidad-paleta')
const selectFormatoColor = document.getElementById('select-formato-color')

const wrapperPaletaColores = document.getElementById('wrapper-paleta-colores')
const toastContenedor = document.getElementById('toast-contenedor')

/* ==========================================================================
   Constantes
   ========================================================================== */
const iconoCopiar = `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
const iconoExito = `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
const iconoError = `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`

/* ==========================================================================
   Lógica de Generación de Colores
   ========================================================================== */
const generarColorHsl = function() {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 100)
  const l = Math.floor(Math.random() * 100)

  const colorHslGenerado = `hsl(${h} ${s}% ${l}%)`

  // Determinar si el color generado es oscuro para cambiar el color de letra y evitar contrastes
  // Se determina 'oscuro' si el lightness (l) es menor a 50%
  const esOscuro = l < 50

  const lNormalizado = l / 100
  const a = s * Math.min(lNormalizado, 1 - lNormalizado) / 100
  const f = n => {
    const k = (n + h / 30) % 12
    const color = lNormalizado - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  const colorHexGenerado = `#${f(0)}${f(8)}${f(4)}`.toUpperCase()

  return [colorHslGenerado, colorHexGenerado, esOscuro]
}

const generarColorHex = function() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  const luminancia = (r * 299 + g * 587 + b * 114) / 1000
  const esOscuro = luminancia < 128

  const hexR = r.toString(16).padStart(2, '0')
  const hexG = g.toString(16).padStart(2, '0')
  const hexB = b.toString(16).padStart(2, '0')

  const colorHexGenerado = `#${hexR}${hexG}${hexB}`.toUpperCase()

  return [colorHexGenerado, esOscuro]
}

/* ==========================================================================
   Renderizado y UI
   ========================================================================== */
const renderizarPaleta = function() {
  const cantidadDeColoresAGenerar = Number(selectCantidad.value)
  const formatoDeColoresAGenerar = selectFormatoColor.value

  wrapperPaletaColores.innerHTML = ''

  for (let i = 0; i < cantidadDeColoresAGenerar; i++) {
    const divColor = document.createElement('div')
    divColor.classList.add('wrapper-color')
    
    if (formatoDeColoresAGenerar === 'hsl') {
      const [colorHslGenerado, colorHexGenerado, esOscuro] = generarColorHsl()
      divColor.style.backgroundColor = colorHslGenerado

      divColor.innerHTML = `
        <div class="color-info-container">
          <div class="color-info-row">
            <p class="color__formato-texto ${esOscuro ? 'es-oscuro' : ''}" aria-label="Color en formato HSL">${colorHslGenerado}</p>
            <button 
              class="boton-copiar tooltip-copiar animacion-click cursor-pointer ${esOscuro ? 'es-oscuro' : ''}" 
              aria-label="Copiar el color ${colorHslGenerado} al portapapeles"
              data-tip="Copiar HSL"
              data-color="${colorHslGenerado}"
              type="button">
              ${iconoCopiar}
            </button>
          </div>
          <div class="color-info-row">
            <p class="color__formato-texto ${esOscuro ? 'es-oscuro' : ''}" aria-label="Color en formato HEX">${colorHexGenerado}</p>
            <button 
              class="boton-copiar tooltip-copiar animacion-click cursor-pointer ${esOscuro ? 'es-oscuro' : ''}" 
              aria-label="Copiar el color ${colorHexGenerado} al portapapeles"
              data-tip="Copiar HEX"
              data-color="${colorHexGenerado}"
              type="button">
              ${iconoCopiar}
            </button>
          </div>
        </div>
      `
    } else if (formatoDeColoresAGenerar === 'hex') {
      const [colorGenerado, esOscuro] = generarColorHex()
      divColor.style.backgroundColor = colorGenerado

      divColor.innerHTML = `
        <div class="color-info-row">
          <p class="color__formato-texto ${esOscuro ? 'es-oscuro' : ''}" aria-label="Color en formato HEX">${colorGenerado}</p>
          <button 
            class="boton-copiar tooltip-copiar animacion-click cursor-pointer ${esOscuro ? 'es-oscuro' : ''}" 
            aria-label="Copiar el color ${colorGenerado} al portapapeles"
            data-tip="Copiar HEX"
            data-color="${colorGenerado}"
            type="button">
            ${iconoCopiar}
          </button>
        </div>
      `
    }

    wrapperPaletaColores.appendChild(divColor)

    const botonesCopiar = divColor.querySelectorAll('.boton-copiar')
    botonesCopiar.forEach(boton => {
      boton.addEventListener('click', () => copiarAlPortapapeles(boton.dataset.color))
    })
  }
}

/* ==========================================================================
   Utilidades (Toast y Portapapeles)
   ========================================================================== */

const mostrarToast = function(mensaje, esError = false) {
  const toast = document.createElement('div')
  toast.classList.add('toast')
  
  if (esError) {
    toast.classList.add('error')
  }

  toast.innerHTML = `
    ${esError ? iconoError : iconoExito}
    <span>${mensaje}</span>
  `

  toastContenedor.appendChild(toast)

  setTimeout(() => {
    toast.classList.add('show')
  }, 10)

  setTimeout(() => {
    toast.classList.remove('show')
    toast.addEventListener('transitionend', () => {
      if (toast.parentElement) {
        toast.remove()
      }
    })
  }, 1000)
}

async function copiarAlPortapapeles(text) {
  try {
    await navigator.clipboard.writeText(text)
    mostrarToast('Color copiado al portapapeles')
  } catch (err) {
    console.error('Error al copiar: ', err)
    mostrarToast('Error al copiar al portapapeles', true)
  }
}

/* ==========================================================================
   Manejadores de Eventos
   ========================================================================== */
   
// Al visitar la página, renderizar colores por defecto (6, hsl y hex)
document.addEventListener('DOMContentLoaded', renderizarPaleta)

botonGenerar.addEventListener('click', function(e) {
  e.preventDefault()
  renderizarPaleta()
})