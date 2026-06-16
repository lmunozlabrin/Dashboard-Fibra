const csvUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vSfv1QwhesKAuT7wvaTyiJZsT1stl8o0jmdGjb0IDmfohWXfenU9f3ysYtcXUGs8ThY5Sevyf5lj81-/pub?output=csv";

let estadoChart;
let sitioChart;

async function cargarDatos(){

const response = await fetch(csvUrl);

const csv = await response.text();

const filas = csv
.split("\n")
.slice(1)
.filter(fila => fila.trim() !== "");

const tbody =
document.querySelector("#tablaFibra tbody");

tbody.innerHTML = "";

let disponibles = 0;
let asignados = 0;
let danados = 0;

const sitios = {};

filas.forEach(fila=>{

const columnas = fila.split(",");

if(columnas.length < 10) return;

const [
id,
tipo,
largo,
conector,
estado,
sitio,
ticket,
fecha,
responsable,
obs
] = columnas;

tbody.innerHTML += `

<tr>
<td>${id}</td>
<td>${tipo}</td>
<td>${largo}</td>
<td>${conector}</td>
<td class="${estado.trim()}">${estado}</td>
<td>${sitio}</td>
<td>${ticket}</td>
<td>${fecha}</td>
<td>${responsable}</td>
<td>${obs}</td>
</tr>
`;

const estadoLimpio =
estado.trim().toLowerCase();

if(estadoLimpio === "disponible") disponibles++;
if(estadoLimpio === "asignado") asignados++;
if(estadoLimpio === "dañado") danados++;

sitios[sitio] =
(sitios[sitio] || 0) + 1;

});

document.getElementById("total").innerText =
filas.length;

document.getElementById("disponibles").innerText =
disponibles;

document.getElementById("asignados").innerText =
asignados;

document.getElementById("danados").innerText =
danados;

const salud =
filas.length > 0
? Math.round((disponibles / filas.length) * 100)
: 0;

document.getElementById("salud").innerText =
salud + "%";

crearGraficos(
disponibles,
asignados,
danados,
sitios
);

}

function crearGraficos(
disponibles,
asignados,
danados,
sitios
){

if(estadoChart) estadoChart.destroy();
if(sitioChart) sitioChart.destroy();

estadoChart = new Chart(
document.getElementById("estadoChart"),
{
type:"doughnut",
data:{
labels:[
"Disponible",
"Asignado",
"Dañado"
],
datasets:[{
data:[
disponibles,
asignados,
danados
],
backgroundColor:[
"#22c55e",
"#f59e0b",
"#ef4444"
],
borderWidth:2
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
title:{
display:true,
text:"Estado del Inventario"
},
legend:{
position:"bottom"
}
}
}
});

sitioChart = new Chart(
document.getElementById("sitioChart"),
{
type:"bar",
data:{
labels:Object.keys(sitios),
datasets:[{
label:"Cantidad de Cables",
data:Object.values(sitios),
backgroundColor:"#0ea5e9",
borderRadius:10
}]
},
options:{
responsive:true,
plugins:{
title:{
display:true,
text:"Inventario por Sitio"
}
}
}
});

}

function filtrarTabla(){

const filtro =
document.getElementById("buscar")
.value
.toLowerCase();

const filas =
document.querySelectorAll(
"#tablaFibra tbody tr"
);

filas.forEach(fila=>{

const texto =
fila.innerText.toLowerCase();

fila.style.display =
texto.includes(filtro)
? ""
: "none";

});

}

setInterval(()=>{

const ahora = new Date();

document.getElementById("reloj")
.innerHTML =
ahora.toLocaleString("es-CL");

},1000);

setInterval(()=>{

cargarDatos();

},60000);

cargarDatos();

salud + "%";
cargarDatos();
