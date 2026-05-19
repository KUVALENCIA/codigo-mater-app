// --- VARIABLES GLOBALES DEL CRONÓMETRO ---
let erioInterval;
let secondsElapsed = 0;

function evaluarTriage() {
    const pas = parseFloat(document.getElementById('pas').value);
    const pad = parseFloat(document.getElementById('pad').value);
    const fc = parseFloat(document.getElementById('fc').value);
    const fr = parseFloat(document.getElementById('fr').value);
    const temp = parseFloat(document.getElementById('temp').value);
    
    const conciencia = document.getElementById('conciencia').value;
    const hemorragia = document.getElementById('hemorragia').value;
    const convulsiones = document.getElementById('convulsiones').value;

    if (isNaN(pas) || isNaN(pad) || isNaN(fc) || isNaN(fr) || isNaN(temp)) {
        alert("Por favor, llene todos los signos vitales.");
        return;
    }

    const indiceChoque = (fc / pas).toFixed(2);
    document.getElementById('choqueValor').innerText = indiceChoque;

    let nivel = 'VERDE';

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

    contenedor.className = 'card result-card';
    form.classList.add('hidden');
    contenedor.classList.remove('hidden');

    if (nivel === 'ROJO') {
        contenedor.classList.add('bg-rojo');
        titulo.innerText = "CÓDIGO ROJO: EMERGENCIA";
        // Añadimos el botón especial de activación ERIO
        desc.innerHTML = `¡ACTIVAR CÓDIGO MATER INMEDIATAMENTE!<br><br>
                          <button onclick="activarERIO()" class="btn-evaluar" style="background-color: darkred; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
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

// --- NUEVAS FUNCIONES AVANZADAS ERIO ---

function activarERIO() {
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('erioPanel').classList.remove('hidden');
    
    // Iniciar cronómetro
    secondsElapsed = 0;
    document.getElementById('erioTimer').innerText = "00:00";
    document.getElementById('erioTimer').style.color = "white"; // Resetear color
    
    // Ejecutar función cada 1000 milisegundos (1 segundo)
    erioInterval = setInterval(actualizarReloj, 1000);
}

function actualizarReloj() {
    secondsElapsed++;
    
    // Lógica para formatear minutos y segundos con ceros a la izquierda
    let minutos = Math.floor(secondsElapsed / 60);
    let segundos = secondsElapsed % 60;
    let tiempoTexto = (minutos < 10 ? "0" + minutos : minutos) + ":" + (segundos < 10 ? "0" + segundos : segundos);
    
    document.getElementById('erioTimer').innerText = tiempoTexto;
    
    // El documento indica que el ERIO debe llegar en menos de 3 minutos (180 segundos).
    if (secondsElapsed >= 180) {
        document.getElementById('erioTimer').style.color = "#ffbaba"; // Color de advertencia sutil
    }
}

function detenerERIO() {
    clearInterval(erioInterval); // Detiene el reloj
    alert("Atención estabilizada. Tiempo de registro: " + document.getElementById('erioTimer').innerText);
    
    // Limpiamos los checks y el área de texto para el próximo paciente
    const checkboxes = document.querySelectorAll('.roles-checklist input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    document.querySelector('.registro-acciones textarea').value = "";
    
    document.getElementById('erioPanel').classList.add('hidden');
    resetForm();
}

function resetForm() {
    document.getElementById('triageForm').reset();
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('triageForm').classList.remove('hidden');
}