function drawBoxplot(datos){

    console.log("Dibujando boxplot con datos:", datos);
    
    d3.select("#boxplot")
      .html("");


    const width = 900;
    const height = 500;


    const svg =
        d3.select("#boxplot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);



    // Agrupar ventas por producto

    const grupos =
        d3.group(
            datos,
            d => d.producto
        );


    const resumen = [];


    grupos.forEach((valores, producto)=>{


        const ventas =
            valores.map(
                d => d.ventas
            )
            .sort(
                (a,b)=>a-b
            );


        const q1 =
            d3.quantile(
                ventas,
                0.25
            );


        const mediana =
            d3.quantile(
                ventas,
                0.50
            );


        const q3 =
            d3.quantile(
                ventas,
                0.75
            );


        const minimo =
            d3.min(ventas);


        const maximo =
            d3.max(ventas);


        const promedio =
            d3.mean(ventas);



        resumen.push({

            producto,

            minimo,

            q1,

            mediana,

            q3,

            maximo,

            promedio

        });


    });



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

        .padding(0.5);



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




    // Línea vertical rango total

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




    // Caja IQR

    svg.selectAll(".caja")

    .data(resumen)

    .enter()

    .append("rect")

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




    // Mediana

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




    // Promedio como punto

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