let datosGlobales = [];



// ================================
// CARGAR DATOS
// ================================

async function cargarDatos(){


    const respuesta =
        await fetch("/api/ventas?" + Date.now());



    const datos =
        await respuesta.json();



    datosGlobales = datos;



    llenarFiltros();



    aplicarFiltros();


}







// ================================
// LLENAR FILTROS
// ================================


function llenarFiltros(){


    const productos =

    [
        ...new Set(

            datosGlobales.map(

                d => d.producto

            )

        )

    ];





    const anios =

    [

        ...new Set(

            datosGlobales.map(

                d => d.anio

            )

        )

    ];





    const meses =

    [

        ...new Set(

            datosGlobales.map(

                d => d.mes

            )

        )

    ];





    const fp =

    document.getElementById(
        "filtroProducto"
    );



    const fa =

    document.getElementById(
        "filtroAnio"
    );



    const fm =

    document.getElementById(
        "filtroMes"
    );





    if(fp.options.length === 1){



        productos.forEach(p=>{


            fp.innerHTML += `

            <option value="${p}">

            ${p}

            </option>

            `;


        });






        anios.forEach(a=>{


            fa.innerHTML += `

            <option value="${a}">

            ${a}

            </option>


            `;


        });







        meses.forEach(m=>{


            fm.innerHTML += `

            <option value="${m}">

            ${m}

            </option>


            `;


        });



    }



}









// ================================
// APLICAR FILTROS
// ================================


function aplicarFiltros(){



    const producto =

    document.getElementById(
        "filtroProducto"
    ).value;




    const anio =

    document.getElementById(
        "filtroAnio"
    ).value;




    const mes =

    document.getElementById(
        "filtroMes"
    ).value;




    const periodo =

    document.getElementById(
        "filtroPeriodo"
    ).value;





    let datos =

    [...datosGlobales];








    if(producto !== "Todos"){



        datos =

        datos.filter(

            d =>

            d.producto === producto

        );


    }








    if(anio !== "Todos"){



        datos =

        datos.filter(

            d =>

            d.anio == anio

        );


    }








    if(mes !== "Todos"){



        datos =

        datos.filter(

            d =>

            d.mes === mes

        );


    }










    // ================================
    // FILTRO TRIMESTRAL
    // ================================


    if(periodo !== "Todos"){



        datos =

        datos.filter(d=>{


            let numeroMes;



            switch(d.mes){


                case "Enero":

                numeroMes = 1;

                break;



                case "Febrero":

                numeroMes = 2;

                break;



                case "Marzo":

                numeroMes = 3;

                break;



                case "Abril":

                numeroMes = 4;

                break;



                case "Mayo":

                numeroMes = 5;

                break;



                case "Junio":

                numeroMes = 6;

                break;



                case "Julio":

                numeroMes = 7;

                break;



                case "Agosto":

                numeroMes = 8;

                break;



                case "Septiembre":

                numeroMes = 9;

                break;



                case "Octubre":

                numeroMes = 10;

                break;



                case "Noviembre":

                numeroMes = 11;

                break;



                case "Diciembre":

                numeroMes = 12;

                break;



            }







            const trimestre =

            Math.ceil(numeroMes / 3);







            return (

                periodo ===

                "Trimestre" + trimestre

            );




        });



    }










    actualizarKPIs(datos);



    actualizarTabla(datos);




    drawGoogleChart(datos);



    drawBubbleChart(datos);



    drawBoxplot(datos);




    actualizarStatsBoxplot(datos);



    actualizarDescripcionBubble(datos);






}









// ================================
// KPIs
// ================================


function actualizarKPIs(datos){



    if(datos.length===0)

    return;





    const ventas =


    datos.reduce(

        (a,b)=>

        a+b.ventas,

        0

    );






    const ingresos =


    datos.reduce(

        (a,b)=>

        a+b.ingresos,

        0

    );







    const precio =


    datos.reduce(

        (a,b)=>

        a+b.precio,

        0

    )

    /

    datos.length;







    const resumen={};






    datos.forEach(d=>{


        resumen[d.producto]=

        (

        resumen[d.producto] || 0

        )

        +

        d.ventas;



    });







    const lider =


    Object.keys(resumen)

    .reduce(

        (a,b)=>

        resumen[a] >

        resumen[b]

        ?

        a

        :

        b

    );








    document.getElementById(
        "kpiVentas"
    ).innerText =

    ventas.toLocaleString();





    document.getElementById(
        "kpiIngresos"
    ).innerText =

    "$"+

    ingresos.toLocaleString();





    document.getElementById(
        "kpiPrecio"
    ).innerText =

    "$"+

    precio.toFixed(0);






    document.getElementById(
        "kpiProducto"
    ).innerText =

    lider;



}









// ================================
// TABLA RESUMEN
// ================================


function actualizarTabla(datos){



    const resumen={};





    datos.forEach(d=>{



        if(!resumen[d.producto]){


            resumen[d.producto]={


                ventas:0,


                ingresos:0



            };



        }






        resumen[d.producto].ventas +=

        d.ventas;





        resumen[d.producto].ingresos +=

        d.ingresos;



    });







    let html="";







    Object.keys(resumen)

    .forEach(p=>{





        html += `


        <tr>


        <td>

        ${p}

        </td>



        <td>

        ${

        resumen[p].ventas

        .toLocaleString()

        }

        </td>



        <td>

        $

        ${

        resumen[p].ingresos

        .toLocaleString()

        }


        </td>



        </tr>


        `;



    });








    document

    .querySelector(

        "#tablaResumen tbody"

    )

    .innerHTML = html;



}











// ================================
// TABLA ESTADISTICA BOX PLOT
// ================================



function actualizarStatsBoxplot(datos){



    if(!datos || datos.length===0)

    return;





    const agrupado={};







    datos.forEach(d=>{


        if(!agrupado[d.producto]){


            agrupado[d.producto]=[];


        }






        agrupado[d.producto]

        .push(d.ventas);



    });






    let html="";






    Object.keys(agrupado)

    .forEach(producto=>{





        const valores =

        agrupado[producto];






        const min =

        Math.min(...valores);






        const max =

        Math.max(...valores);






        const promedio =


        valores.reduce(

            (a,b)=>a+b,

            0

        )

        /

        valores.length;







        html += `


        <tr>


        <td>

        ${producto}

        </td>



        <td>

        ${min.toLocaleString()}

        </td>



        <td>

        ${max.toLocaleString()}

        </td>



        <td>

        ${promedio.toFixed(2)}

        </td>



        </tr>



        `;



    });






    document.getElementById(

        "tablaStatsBody"

    ).innerHTML = html;



}











// ================================
// EVENTOS
// ================================


document

.getElementById(
    "actualizar"
)

.addEventListener(

"click",

cargarDatos

);






document

.getElementById(
    "filtroProducto"
)

.addEventListener(

"change",

aplicarFiltros

);






document

.getElementById(
    "filtroAnio"
)

.addEventListener(

"change",

aplicarFiltros

);






document

.getElementById(
    "filtroMes"
)

.addEventListener(

"change",

aplicarFiltros

);






document

.getElementById(
    "filtroPeriodo"
)

.addEventListener(

"change",

aplicarFiltros

);








// ================================
// INICIO
// ================================


google.charts.setOnLoadCallback(

    ()=>{

        cargarDatos();

    }

);


function actualizarDescripcionBubble(datos){


    if(!datos || datos.length===0)
    return;



    const resumen={};



    datos.forEach(d=>{


        if(!resumen[d.producto]){


            resumen[d.producto]={

                ventas:0,

                ingresos:0,

                precio:0,

                registros:0

            };


        }



        resumen[d.producto].ventas += d.ventas;

        resumen[d.producto].ingresos += d.ingresos;

        resumen[d.producto].precio += d.precio;

        resumen[d.producto].registros++;




    });





    let lider = null;



    Object.keys(resumen)

    .forEach(p=>{


        if(
            !lider ||

            resumen[p].ingresos >

            resumen[lider].ingresos
        ){

            lider=p;

        }



    });




    const promedioPrecio =

    resumen[lider].precio /

    resumen[lider].registros;




    document.getElementById(

        "descripcionBubble"

    ).innerHTML = `


    <b>${lider}</b> es el producto con mayor generación de ingresos.


    <br><br>


    Ventas acumuladas:

    ${resumen[lider].ventas.toLocaleString()}



    <br>


    Ingresos generados:

    $${resumen[lider].ingresos.toLocaleString()}



    <br>


    Precio promedio:

    $${promedioPrecio.toFixed(2)}



    <br><br>


    Eje horizontal:

    Ventas (unidades)



    <br>


    Eje vertical:

    Ingresos ($ pesos)



    <br>


    Tamaño de burbuja:

    Precio promedio ($ pesos)



    `;



}