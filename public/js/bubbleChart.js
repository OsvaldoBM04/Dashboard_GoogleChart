function drawBubbleChart(datos){

    d3.select("#bubbleChart")
      .html("");

    const width = 900;
    const height = 600;

    const svg =
        d3.select("#bubbleChart")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

    const x =
        d3.scaleLinear()
          .domain([
              0,
              d3.max(
                  datos,
                  d => d.ventas
              )
          ])
          .range([80, 850]);

    const y =
        d3.scaleLinear()
          .domain([
              0,
              d3.max(
                  datos,
                  d => d.ingresos
              )
          ])
          .range([550, 50]);

    const radio =
        d3.scaleSqrt()
          .domain([
              0,
              d3.max(
                  datos,
                  d => d.precio
              )
          ])
          .range([5, 40]);

    const color =
        d3.scaleOrdinal()
          .domain([
              "Smartphone A",
              "Smartphone B",
              "Tablet X"
          ])
          .range([
              "#2563eb",
              "#dc2626",
              "#16a34a"
          ]);

    svg.append("g")
       .attr(
           "transform",
           "translate(0,550)"
       )
       .call(
           d3.axisBottom(x)
       );

    svg.append("g")
       .attr(
           "transform",
           "translate(80,0)"
       )
       .call(
           d3.axisLeft(y)
       );

    const tooltip =
        d3.select("body")
          .append("div")
          .attr("class","tooltip")
          .style("opacity",0);

    svg.selectAll("circle")
       .data(datos)
       .enter()
       .append("circle")
       .attr("cx", d => x(d.ventas))
       .attr("cy", d => y(d.ingresos))
       .attr("r",0)
       .attr("fill",
           d => color(d.producto)
       )

       .on("mouseover",
           function(event,d){

               tooltip
               .style("opacity",1)
               .html(

                   `
                   <b>${d.producto}</b><br>
                   Año: ${d.anio}<br>
                   Mes: ${d.mes}<br>
                   Ventas: ${d.ventas}<br>
                   Ingresos: ${d.ingresos}<br>
                   Precio: ${d.precio}
                   `

               );

           }
       )

       .on("mousemove",
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

       .on("mouseout",
           function(){

               tooltip
               .style("opacity",0);

           }
       )

       .on("click",
           function(event,d){

               alert(
                   `${d.producto}
                    ${d.mes}
                    ${d.anio}`
               );

           }
       )

       .transition()
       .duration(1500)

       .attr(
           "r",
           d => radio(d.precio)
       );

}