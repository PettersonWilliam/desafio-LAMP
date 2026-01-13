const lamp = document.getElementById("lamp");

// Criação do elemento temporizador no HTML
let timerDisplay = document.getElementById('lamp-timer');

if (!timerDisplay) {
    timerDisplay = document.createElement('div');
    timerDisplay.id = "lamp-timer";
    timerDisplay.style.fontSize = "20px";
    timerDisplay.style.fontWeight = "bold";
    timerDisplay.style.margin = "16px 0 4px 0";
    lamp.parentNode.insertBefore(timerDisplay, lamp.nextSibling);
}

let lampadaAtiva = false;          // Estado da lâmpada (ligada/desligada)
let contarCiclos = 0;              // Quantas vezes acendeu/apagou rapidamente
let temporizadorDesligar = null;   // Interval para apagar após 15s ligada
let temporizador5Seg = null;       // Interval para limite dos 5s antes de acender
let temporizadorQuebrar = null;    // Interval para quebrar após 10s ligada narapid
let aguardando5Seg = false;        // Se está esperando 5 segundos para poder ligar
let tempoQuebrar = 0;              // Conta os segundos após ligar antes dos 5s
let lampadaQuebrou = false;        // Marca se está quebrada

let tempoLampLigada = 0;  // segundos ligada para mostrar no timer/console
let temporizadorTimerTela = null; // Para o temporizador do display e log

function resetTimers() {
    if (temporizadorDesligar) clearInterval(temporizadorDesligar);
    if (temporizador5Seg) clearInterval(temporizador5Seg);
    if (temporizadorQuebrar) clearInterval(temporizadorQuebrar);
    if (temporizadorTimerTela) clearInterval(temporizadorTimerTela);
    tempoQuebrar = 0;
    tempoLampLigada = 0;
}

function lampadaQuebrada() {
    lampadaQuebrou = true;
    resetTimers();
    lamp.src = "./img/LAMPADA quebrada.jpg";
    timerDisplay.textContent = "Lâmpada quebrada! Recarregue a página.";
    alert("A lâmpada QUEBROU! Recarregue a página para reiniciar.");
};

function lampadaDesligada() {
    if (lampadaQuebrou) return; // Não faz mais nada se estiver quebrada
    lampadaAtiva = false;
    lamp.src = "./img/LAMPADA1.jpg";
    timerDisplay.textContent = "Lâmpada desligada";
    if (temporizadorTimerTela) clearInterval(temporizadorTimerTela);
};

function lampadaLigada() {
    if (lampadaQuebrou) return;
    lampadaAtiva = true;
    lamp.src = "./img/lampadaAcesa2.jpg";
    tempoLampLigada = 0;
    atualizarTimerTela(true);
};

function esperarParaDesligar() {
    let tempo = 0;
    temporizadorDesligar = setInterval(() => {
        tempo++;
        if (tempo >= 15 && lampadaAtiva && !lampadaQuebrou) { // 15 segundos ligada
            lampadaDesligada();
            clearInterval(temporizadorDesligar);
            if (temporizadorTimerTela) clearInterval(temporizadorTimerTela);
        }
        if (!lampadaAtiva || lampadaQuebrou) {
            clearInterval(temporizadorDesligar);
        }
    }, 1000);
};

function iniciarEspera5Segundos() {
    aguardando5Seg = true;
    let tempo = 0;
    temporizador5Seg = setInterval(() => {
        tempo++;
        if (tempo >= 5) {
            aguardando5Seg = false;
            clearInterval(temporizador5Seg);
            tempoQuebrar = 0; // Reseta contagem de 10s para quebra
        }
    }, 1000);
};

function iniciarQuebraEm10Segundos() {
    tempoQuebrar = 0;
    temporizadorQuebrar = setInterval(() => {
        tempoQuebrar++;
        if (lampadaQuebrou) {
            clearInterval(temporizadorQuebrar);
            return;
        }
        if (tempoQuebrar > 10 && lampadaAtiva) {
            lampadaQuebrada();
            clearInterval(temporizadorQuebrar);
        }
        if (!lampadaAtiva) {
            clearInterval(temporizadorQuebrar);
        }
    }, 1000);
};

function atualizarTimerTela(ehLigada) {
    if (temporizadorTimerTela) clearInterval(temporizadorTimerTela);

    if (lampadaQuebrou) {
        timerDisplay.textContent = "Lâmpada quebrada! Recarregue a página.";
        return;
    }
    if (!ehLigada) {
        timerDisplay.textContent = 'Lâmpada desligada';
        return;
    }

    // Tempo em segundos ligada
    temporizadorTimerTela = setInterval(() => {
        if (!lampadaAtiva) {
            timerDisplay.textContent = 'Lâmpada desligada';
            clearInterval(temporizadorTimerTela);
            return;
        }
        tempoLampLigada++;
        const minutos = Math.floor(tempoLampLigada / 60);
        const segundos = tempoLampLigada % 60;
        let segundosLabel = "segundos";

        if (segundos === 0 || segundos === 1) {
            segundosLabel = "segundo";
        }
        timerDisplay.textContent = `Ligada há: ${segundos < 10 ? '0' : ''}${segundos} ${segundosLabel}`;
        // Log para ver minutos em tempo real
        if (segundos === 0) {
            console.log(`A lâmpada está ligada há ${minutos} minutos.`);
        }
    }, 1000);
};

function mudarLampada() {
    if (lampadaQuebrou) return;

    // Alterna o estado
    lampadaAtiva = !lampadaAtiva;

    // Ligando a lâmpada
    if (lampadaAtiva) {
        contarCiclos++;

        // 1. Acionamento muito rápido 5 vezes ou mais
        if (contarCiclos > 5) {
            lampadaQuebrada();
            return;
        }
        // 2. Ligar antes de 5s após desligar (aguardando5Seg verdadeiro)
        if (aguardando5Seg) {
            lampadaLigada();
            resetTimers();
            atualizarTimerTela(true);
            iniciarQuebraEm10Segundos();
            console.log("Acendeu antes dos 5 segundos! Timer de 10s disparou.");
            return;
        }

        // 3. Senão, ligar normalmente
        lampadaLigada();
        resetTimers();
        atualizarTimerTela(true);
        esperarParaDesligar();
        return;
    } 

    // Desligando a lâmpada
    contarCiclos++; // cada ciclo liga ou desliga rapidamente
    resetTimers();
    iniciarEspera5Segundos();
    lampadaDesligada();
    console.log("Lâmpada desligada.");
};

// Evento para alternar o estado ao passar o mouse
lamp.addEventListener("mouseover", mudarLampada);
