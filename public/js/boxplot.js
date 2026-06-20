function drawBoxplot(datos){


console.log(
"Dibujando boxplot con datos:",
datos
);



d3.select("#boxplot")
.html("");



const width=900;

const height=500;




const svg =

d3.select("#boxplot")

.append("svg")

.attr("width",width)

.attr("height",height);





const tooltip =


d3.select("body")

.append("div")

.attr("class","tooltip")

.style("position","absolute")

.style("background","white")

.style("border","1px solid #ccc")

.style("padding","10px")

.style("border-radius","6px")

.style("pointer-events","none")

.style("opacity",0);







const grupos =

d3.group(

datos,

d=>d.producto

);





const resumen=[];





grupos.forEach(

(valores,producto)=>{



const ventas =

valores.map(

d=>d.ventas

)

.sort(

(a,b)=>a-b

);





resumen.push({


producto,


minimo:d3.min(ventas),


q1:d3.quantile(
ventas,
0.25
),


mediana:d3.quantile(
ventas,
0.5
),


q3:d3.quantile(
ventas,
0.75
),


maximo:d3.max(ventas),


promedio:d3.mean(ventas)



});



}

);









const x =


d3.scaleBand()

.domain(

resumen.map(

d=>d.producto

)

)

.range(

[100,800]

)

.padding(.5);







const y =


d3.scaleLinear()


.domain([

0,

d3.max(

resumen,

d=>d.maximo

)

])


.range(

[400,50]

);









svg.append("g")

.attr(

"transform",

"translate(0,400)"

)

.call(

d3.axisBottom(x)

);







svg.append("g")

.attr(

"transform",

"translate(100,0)"

)

.call(

d3.axisLeft(y)

);








// ETIQUETA X


svg.append("text")

.attr(

"x",

450

)

.attr(

"y",

450

)

.attr(

"text-anchor",

"middle"

)

.style(

"font-size",

"18px"

)

.text(

"Producto"

);






// ETIQUETA Y


svg.append("text")

.attr(

"transform",

"rotate(-90)"

)

.attr(

"x",

-250

)

.attr(

"y",

20

)

.attr(

"text-anchor",

"middle"

)

.style(

"font-size",

"18px"

)

.text(

"Ventas (unidades)"

);








// LINEAS


svg.selectAll(".linea")

.data(resumen)

.enter()

.append("line")

.attr(

"x1",

d=>x(d.producto)+x.bandwidth()/2

)

.attr(

"x2",

d=>x(d.producto)+x.bandwidth()/2

)

.attr(

"y1",

d=>y(d.maximo)

)

.attr(

"y2",

d=>y(d.minimo)

)

.attr(

"stroke",

"black"

);








// CAJAS


svg.selectAll(".caja")

.data(resumen)

.enter()

.append("rect")


.on(

"mouseover",

function(event,d){



tooltip

.style(

"opacity",

1

)

.html(`

<b>${d.producto}</b><br><br>

Mínimo: ${d.minimo}<br>

Q1: ${d.q1.toFixed(2)}<br>

Mediana: ${d.mediana.toFixed(2)}<br>

Q3: ${d.q3.toFixed(2)}<br>

Máximo: ${d.maximo}<br>

Promedio: ${d.promedio.toFixed(2)}

`);

}

)

.on(

"mousemove",

function(event){


tooltip

.style(

"left",

event.pageX+10+"px"

)

.style(

"top",

event.pageY-20+"px"

);


}

)

.on(

"mouseout",

function(){


tooltip

.style(

"opacity",

0

);


}

)



.attr(

"x",

d=>x(d.producto)

)


.attr(

"y",

d=>y(d.q3)

)


.attr(

"width",

x.bandwidth()

)


.attr(

"height",

d=>y(d.q1)-y(d.q3)

)


.attr(

"fill",

"#60a5fa"

);









// MEDIANA


svg.selectAll(".mediana")

.data(resumen)

.enter()

.append("line")

.attr(

"x1",

d=>x(d.producto)

)

.attr(

"x2",

d=>x(d.producto)+x.bandwidth()

)

.attr(

"y1",

d=>y(d.mediana)

)

.attr(

"y2",

d=>y(d.mediana)

)

.attr(

"stroke",

"red"

)

.attr(

"stroke-width",

3

);








// PROMEDIO


svg.selectAll(".promedio")

.data(resumen)

.enter()

.append("circle")

.attr(

"cx",

d=>x(d.producto)+x.bandwidth()/2

)

.attr(

"cy",

d=>y(d.promedio)

)

.attr(

"r",

7

)

.attr(

"fill",

"green"

);



}