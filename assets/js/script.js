let apiURL = "https://mindicador.cl/api/";
let codigoMoneda = ["dolar", "euro"];
let grafico;

let inputMontoPesos = document.querySelector("#montoPesos");
let selectMonedaCambio = document.querySelector("#monedaCambio");
let parrafoMensaje = document.querySelector("#mensaje");
let botonBuscar = document.querySelector("#botonBuscar");
let myChart = document.querySelector("#myChart");

renderSelect();
botonBuscar.addEventListener("click", async function () {
  let codigoMoneda = await selectMonedaCambio.value;

  let moneda = await getMoneda(codigoMoneda);
console.log(moneda);
  renderGrafico(moneda);
});

async function renderSelect() {
  let monedas = await getMonedas(codigoMoneda);
  let html = "";

  for (const moneda of monedas) {
    let template = `
        <option value="${moneda.codigo}">${moneda.nombre}</option>`;

    html += template;
  }

  selectMonedaCambio.innerHTML += html;
}

async function getMonedas(arrayCodigos) {
  let monedas = [];

  for (let i = 0; i < arrayCodigos.length; i++) {
    let moneda = await getMoneda(arrayCodigos[i]);
    monedas.push(moneda);
  }

  return monedas;
}

async function getMoneda(codigo) {
  try {
    const res = await fetch(apiURL + codigo);
    let moneda = await res.json();
    return moneda;
  } catch (error) {
    parrafoMensaje.innerHTML = "Error: Se produjo un Error" + error;
  }
}

function renderGrafico(moneda) {
  let serie10Ultimos = moneda.serie.slice(0, 10);
  const label = serie10Ultimos.map(serie => serie.fecha.slice(0, 10)).reverse();

  const data = serie10Ultimos.map(serie => serie.valor).reverse();
  
  const dataset = [
    {
      label: "Historia Últimos 10 Días",
      borderColor: "red",
      data,
    }
  ];

  const conf = { 
    type: "line", 
    data: { 
      labels, 
      dataset 
    } 
  };

  myChart.innerHTML = "";

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(myChart, conf);
}
