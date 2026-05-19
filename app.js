function evaluarTriage() {
    // Obtener valores del formulario
    const pas = parseFloat(document.getElementById('pas').value);
    const pad = parseFloat(document.getElementById('pad').value);
    const fc = parseFloat(document.getElementById('fc').value);
    const fr = parseFloat(document.getElementById('fr').value);
    const temp = parseFloat(document.getElementById('temp').value);
    
    const conciencia = document.getElementById('conciencia').value;
    const hemorragia = document.getElementById('hemorragia').value;
    const convulsiones = document.getElementById('convulsiones').value;

    // Validación básica
    if (isNaN(pas) || isNaN(pad) || isNaN(fc) || isNaN(fr) || isNaN(temp)) {
        alert("Por favor, llene todos los signos vitales.");
        return;
    }

    // Cálculo Índice de Choque (FC / PAS)
    const indiceChoque = (fc / pas).toFixed(2);
    document.getElementById('choqueValor').innerText = indiceChoque;

    let nivel = 'VERDE'; // Por defecto es verde

    // Evaluación CÓDIGO AMARILLO (Urgencia calificada)
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

    // Evaluación CÓDIGO ROJO (Emergencia) - Sobrescribe al amarillo si se cumple
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

    // Quitar clases previas
    contenedor.className = 'card result-card';
    form.classList.add('hidden');
    contenedor.classList.remove('hidden');

    if (nivel === 'ROJO') {
        contenedor.classList.add('bg-rojo');
        titulo.innerText = "CÓDIGO ROJO: EMERGENCIA";
        desc.innerText = "¡ACTIVAR CÓDIGO MATER / ERIO INMEDIATAMENTE! Atención vital en área de choque.";
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

function resetForm() {
    document.getElementById('triageForm').reset();
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('triageForm').classList.remove('hidden');
}