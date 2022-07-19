const mouseMove = document.getElementById("mouse-move");
const lamp = document.getElementById("lamp");
let lampadaAtiva = false;
let contar15segundos = 0;
let contar5segundos = 0;
let temporizadorParaDesligar;
let temporizadorParaligar;
let ligar5x = 0;
let tempoParaQuebrar = 0
let temporizadorParaQuebrar;


const mudarLamp = () => {
  lampadaAtiva = !lampadaAtiva;
  if (lampadaAtiva) {
    if (ligar5x >= 5) {
      lampadaQuebrada();
      clearInterval(temporizadorParaDesligar);
      clearInterval(temporizadorParaligar);
      return;
    }

    if (contar5segundos <= 5 && ligar5x !== 0) {
      ligar5x++
      console.log('if : LIGANDO >>>>', ligar5x );

      quebrarLampadaEm10segundos();
      ligarLampada();
      clearInterval(temporizadorParaDesligar);
      clearInterval(temporizadorParaligar);
      contar5segundos = 0
      return;
    } 
    
    
    ligar5x++
    console.log('LIGANDO >>>>', ligar5x );

    
    clearInterval(temporizadorParaligar);
    contar5segundos = 0

    ligarLampada();

    if (contar15segundos < 15 && contar15segundos === 0) {
      esperar15segundos();
    }
    return;
  }

  clearInterval(temporizadorParaQuebrar);
  esperar5segundos(); 
  contar15segundos = 0;
  clearInterval(temporizadorParaDesligar);

  lampadaDesligada();
};

const quebrarLampadaEm10segundos = () => {
  temporizadorParaQuebrar = setInterval(() => {
    console.log('vai quebrar se passar de 10seguns - ', tempoParaQuebrar);
    tempoParaQuebrar++

    if (tempoParaQuebrar > 10) {
      lampadaQuebrada();
      clearInterval(temporizadorParaQuebrar);
    }
  }, 1000);
}

const esperar5segundos = () => {
  temporizadorParaligar = setInterval(() => {
    console.log('se ligar antes dos 5 segundos ela vai quebrar depois de 10segundos, espera: ', contar5segundos);
    contar5segundos++
  }, 1000); 
}

const esperar15segundos = () => {
  temporizadorParaDesligar = setInterval(() => {
    console.log(contar15segundos);
    if (contar15segundos <= 15) {
      contar15segundos++
    } else {
      contar15segundos = 0;
      lampadaDesligada();
      clearInterval(temporizadorParaDesligar);
    }
  }, 1000);
}

const lampadaDesligada = () => {

  if (lamp.src = "./img/LAMPADA quebrada.jpg") return;// nesta condição usei para que se a lampada quebrar ela pare e so inicie apos atualizar a pagina

  lamp.src = "./img/LAMPADA1.jpg";
};
const ligarLampada = () => {
  lamp.src = "./img/lampadaAcesa2.jpg";
};
const lampadaQuebrada = () => {
  lamp.src = "./img/LAMPADA quebrada.jpg";
};


lamp.addEventListener("mouseover", mudarLamp);
