// --- VARIABLES GLOBALES PARA EL CRONÓMETRO ---
let erioInterval;
let secondsElapsed = 0;

/**
 * 1. Función principal de evaluación de Triage Obstétrico
 */
function evaluarTriage() {
    // Obtener valores numéricos de los campos de signos vitales
    const pas = parseFloat(document.getElementById('pas').value);
    const pad = parseFloat(document.getElementById('pad').value);
    const fc = parseFloat(document.getElementById('fc').value);
    const fr = parseFloat(document.getElementById('fr').value);
    const temp = parseFloat(document.getElementById('temp').value);
    
    // Obtener valores de evaluación clínica (selects)
    const conciencia = document.getElementById('conciencia').value;
    const hemorragia = document.getElementById('hemorragia').value;
    const convulsiones = document.getElementById('convulsiones').value;

    // Validación de seguridad para asegurar que no falten datos obligatorios
    if (isNaN(pas) || isNaN(pad) || isNaN(fc) || isNaN(fr) || isNaN(temp)) {
        alert("Por favor, llena todos los signos vitales con números antes de evaluar.");
        return;
    }

    // Calcular Índice de Choque (Frecuencia Cardíaca / Presión Arterial Sistólica)
    const indiceChoque = (fc / pas).toFixed(2);
    document.getElementById('choqueValor').innerText = indiceChoque;

    // Definición del nivel base (Verde por defecto)
    let nivel = 'VERDE';

    // Reglas para clasificar en Código Amarillo (Urgencia Calificada)
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

    // Reglas prioritarias para Código Rojo (Emergencia - Sobrescribe al Amarillo)
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

    // Enviar el diagnóstico a la interfaz gráfica
    mostrarResultado(nivel);
}

/**
 * 2. NUEVA FUNCIÓN: Mostrar resultados de forma segura en Android, iOS y Windows
 */
function mostrarResultado(nivel) {
    const contenedor = document.getElementById('resultado');
    const titulo = document.getElementById('codigoTitulo');
    const desc = document.getElementById('codigoDesc');
    const form = document.getElementById('triageForm');
    const btnErio = document.getElementById('btnErio'); // Botón físico del HTML

    // Configuración base de visualización (ocultar formulario y mostrar contenedor)
    contenedor.className = 'card result-card';
    form.classList.add('hidden');
    contenedor.classList.remove('hidden');
    
    // Ocultar siempre el botón ERIO por defecto al iniciar una nueva evaluación
    btnErio.classList.add('hidden'); 

    // Aplicar estilos y textos según la gravedad del código determinado
    if (nivel === 'ROJO') {
        contenedor.classList.add('bg-rojo');
        titulo.innerText = "CÓDIGO ROJO: EMERGENCIA";
        desc.innerText = "¡ACTIVAR CÓDIGO MATER INMEDIATAMENTE!";
        btnErio.classList.remove('hidden'); // Mostrar de forma segura el botón en móviles
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

/**
 * 3. Módulo de Activación de Protocolo de Emergencia ERIO
 */
function activarERIO() {
    // Ocultar la pantalla de resultados y abrir el panel con el cronómetro de reanimación
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('erioPanel').classList.remove('hidden');
    
    // Inicializar el reloj a ceros
    secondsElapsed = 0;
    const timerDisplay = document.getElementById('erioTimer');
    timerDisplay.innerText = "00:00";
    timerDisplay.style.color = "white"; 
    
    // Evitar acumulaciones de intervalos previos y encender el cronómetro por segundo
    if (erioInterval) clearInterval(erioInterval);
    erioInterval = setInterval(actualizarReloj, 1000);
}

/**
 * 4. Actualización del reloj en tiempo real
 */
function actualizarReloj() {
    secondsElapsed++;
    
    let minutos = Math.floor(secondsElapsed / 60);
    let segundos = secondsElapsed % 60;
    
    // Formatear cadenas de texto para colocar un cero si son menores a 10 (ej: 02:05)
    let textoMinutos = minutos < 10 ? "0" + minutos : minutos;
    let textoSegundos = segundos < 10 ? "0" + segundos : segundos;
    
    const timerDisplay = document.getElementById('erioTimer');
    timerDisplay.innerText = `${textoMinutos}:${textoSegundos}`;
    
    // El lineamiento exige llegada en < 3 min (180s). Si se excede, el reloj cambia de color de alerta
    if (secondsElapsed >= 180) {
        timerDisplay.style.color = "#ffbaba"; 
    }
}

/**
 * 5. Cierre y finalización del protocolo de atención médica
 */
function detenerERIO() {
    // Detener el intervalo de tiempo
    clearInterval(erioInterval);
    
    // Notificar al médico el tiempo transcurrido para la toma de notas en el expediente
    const tiempoFinal = document.getElementById('erioTimer').innerText;
    alert("✅ Atención estabilizada.\nTiempo total de reanimación: " + tiempoFinal);
    
    // Desmarcar automáticamente todas las casillas del checklist del personal
    const checkboxes = document.querySelectorAll('.roles-checklist input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    // Limpiar el campo de texto del registro rápido de maniobras
    const textarea = document.querySelector('.registro-acciones textarea');
    if (textarea) textarea.value = "";
    
    // Ocultar el panel de alerta y restablecer la app
    document.getElementById('erioPanel').classList.add('hidden');
    resetForm();
}

/**
 * 6. Limpieza integral de los formularios
 */
function resetForm() {
    document.getElementById('triageForm').reset();
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('erioPanel').classList.add('hidden'); 
    document.getElementById('triageForm').classList.remove('hidden');
    document.getElementById('choqueValor').innerText = "";
}
