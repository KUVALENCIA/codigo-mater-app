// --- VARIABLES GLOBALES PARA EL CRONÓMETRO ---
let erioInterval;
let secondsElapsed = 0;

function evaluarTriage() {
    // 1. Obtener valores de los inputs
    const pas = parseFloat(document.getElementById('pas').value);
    const pad = parseFloat(document.getElementById('pad').value);
    const fc = parseFloat(document.getElementById('fc').value);
    const fr = parseFloat(document.getElementById('fr').value);
    const temp = parseFloat(document.getElementById('temp').value);
    
    const conciencia = document.getElementById('conciencia').value;
    const hemorragia = document.getElementById('hemorragia').value;
    const convulsiones = document.getElementById('convulsiones').value;

    // 2. Validación de seguridad para que no haya campos vacíos
    if (isNaN(pas) || isNaN(pad) || isNaN(fc) || isNaN(fr) || isNaN(temp)) {
        alert("Por favor, llena todos los signos vitales con números antes de evaluar.");
        return;
    }

    // 3. Calcular Índice de Choque
    const indiceChoque = (fc / pas).toFixed(2);
    document.getElementById('choqueValor').innerText = indiceChoque;

    // 4. Lógica de Triage
    let nivel = 'VERDE'; // Por defecto

    // Reglas para Código Amarillo
    if (
        (pas >= 140 && pas <= 159) || (pad >= 90 && pad <= 109) ||
        (pas >= 90 && pas <= 99) || (pad >= 51 && pad <= 59) ||
        (fc >= 50 && fc <= 60) || (fc >= 80 && fc <= 100) ||
        (temp >= 37.5 && temp <= 38.9) ||
        (indiceChoque >= 0.7 && indiceChoque <= 0.8) ||
        hemorragia === 'moderada'
    ) {
        nivel = 'AMARILLO';
    }

    // Reglas para Código Rojo (Sobrescribe al amarillo)
    if (
        pas >= 160 || pad >= 110 || pas <= 89 || pad <= 50 ||
        fc < 45 || fc > 125 ||
        fr < 16 || fr > 20 ||
        temp > 39 || temp < 35 ||
        indiceChoque > 0.8 ||
        conciencia === 'alterado' ||
        hemorragia === 'abundante' ||
        convulsiones === 'si'
    ) {
        nivel = 'ROJO';
    }

    mostrarResultado(nivel);
}

function mostrarResultado(nivel) {
    const contenedor = document.getElementById('resultado');
    const titulo = document.getElementById('codigoTitulo');
    const desc = document.getElementById('codigoDesc');
    const form = document.getElementById('triageForm');

    // Resetear las vistas
    contenedor.className = 'card result-card';
    form.classList.add('hidden');
    contenedor.classList.remove('hidden');

    if (nivel === 'ROJO') {
        contenedor.classList.add('bg-rojo');
        titulo.innerText = "CÓDIGO ROJO: EMERGENCIA";
        // Aquí insertamos el botón ERIO
        desc.innerHTML = `¡ACTIVAR CÓDIGO MATER INMEDIATAMENTE!<br><br>
                          <button type="button" onclick="activarERIO()" class="btn-evaluar" style="background-color: darkred; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                            🚨 ACTIVAR PROTOCOLO ERIO
                          </button>`;
    } else if (nivel === 'AMARILLO') {
        contenedor.classList.add('bg-amarillo');
        titulo.innerText = "CÓDIGO AMARILLO: URGENCIA CALIFICADA";
        desc.innerText = "Paciente requiere valoración integral en menos de 15 minutos.";
    } else {
        contenedor.classList.add('bg-verde');
        titulo.innerText = "CÓDIGO VERDE: URGENCIA NO CALIFICADA";
        desc.innerText = "Paciente en sala de espera. Atención en un periodo máximo de 30 minutos.";
    }
}

// ==========================================
//    MÓDULO AVANZADO ERIO (CRONÓMETRO)
// ==========================================

function activarERIO() {
    // 1. Ocultar resultado anterior y mostrar panel ERIO
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('erioPanel').classList.remove('hidden');
    
    // 2. Preparar el reloj
    secondsElapsed = 0;
    const timerDisplay = document.getElementById('erioTimer');
    timerDisplay.innerText = "00:00";
    timerDisplay.style.color = "white"; 
    
    // 3. Limpiar cualquier intervalo fantasma previo y arrancar de nuevo
    if (erioInterval) clearInterval(erioInterval);
    erioInterval = setInterval(actualizarReloj, 1000);
}

function actualizarReloj() {
    secondsElapsed++;
    
    let minutos = Math.floor(secondsElapsed / 60);
    let segundos = secondsElapsed % 60;
    
    // Poner un '0' a la izquierda si es menor de 10 (ej: 05 en vez de 5)
    let textoMinutos = minutos < 10 ? "0" + minutos : minutos;
    let textoSegundos = segundos < 10 ? "0" + segundos : segundos;
    
    const timerDisplay = document.getElementById('erioTimer');
    timerDisplay.innerText = `${textoMinutos}:${textoSegundos}`;
    
    // Si pasan 3 minutos (180 segundos), cambiar color a alerta
    if (secondsElapsed >= 180) {
        timerDisplay.style.color = "#ffbaba"; 
    }
}

function detenerERIO() {
    // 1. Detener el reloj
    clearInterval(erioInterval);
    
    // 2. Mostrar alerta de finalización
    const tiempoFinal = document.getElementById('erioTimer').innerText;
    alert("✅ Atención estabilizada.\nTiempo total de reanimación: " + tiempoFinal);
    
    // 3. Limpiar checkboxes de roles
    const checkboxes = document.querySelectorAll('.roles-checklist input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    // 4. Limpiar caja de texto
    const textarea = document.querySelector('.registro-acciones textarea');
    if (textarea) textarea.value = "";
    
    // 5. Ocultar el panel y resetear todo
    document.getElementById('erioPanel').classList.add('hidden');
    resetForm();
}

function resetForm() {
    document.getElementById('triageForm').reset();
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('erioPanel').classList.add('hidden'); // Ocultar por seguridad
    document.getElementById('triageForm').classList.remove('hidden');
    document.getElementById('choqueValor').innerText = "";
}