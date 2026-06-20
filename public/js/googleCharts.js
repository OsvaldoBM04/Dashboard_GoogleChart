google.charts.load(
"current",
{
packages:["corechart"]
}
);



function drawGoogleChart(datos){


if(!datos || datos.length===0)
return;



let tabla=[

[
"Periodo",
"Smartphone A",
"Smartphone B",
"Tablet X"
]

];



let meses={};



datos.forEach(d=>{


let clave =
`${d.anio}-${d.mes}`;



if(!meses[clave]){


meses[clave]={

"Smartphone A":0,
"Smartphone B":0,
"Tablet X":0

};


}



meses[clave][d.producto]+=d.ventas;



});





Object.keys(meses)
.forEach(k=>{


tabla.push([

k,

meses[k]["Smartphone A"],

meses[k]["Smartphone B"],

meses[k]["Tablet X"]

]);


});






let data =
google.visualization
.arrayToDataTable(tabla);






let options = {


title:

"Ventas históricas por producto y periodo de tiempo",



height:550,



legend:
{
position:"top"
},



hAxis:
{


title:
"Periodo de tiempo",


textStyle:
{
fontSize:14
}


},




vAxis:
{


title:
"Cantidad de ventas",


textStyle:
{
fontSize:14
}


}


};






let chart =
new google.visualization.ColumnChart(

document.getElementById(
"googleChart"
)

);



chart.draw(
data,
options
);




drawPieChart(datos);



}








function drawPieChart(datos){



let resumen={};



datos.forEach(d=>{


resumen[d.producto]=

(resumen[d.producto] || 0)

+d.ventas;


});





let tabla=[

[
"Producto",
"Ventas"
]

];





Object.keys(resumen)
.forEach(p=>{


tabla.push(
[
p,
resumen[p]
]
);


});





let data =
google.visualization
.arrayToDataTable(tabla);





let options = {


title:

"Participación de ventas por producto",



pieHole:0.4,


height:450


};





let chart =
new google.visualization.PieChart(

document.getElementById(
"pieChart"
)

);



chart.draw(
data,
options
);



}