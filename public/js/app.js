let datosGlobales = [];

let datosCompletos = [];


// =====================================================
// CARGAR DATOS
// =====================================================

async function cargarDatos(expandir = false){

    const respuesta = await fetch(
        "/api/ventas?" + Date.now()
    );


    const datos = await respuesta.json();


    datosCompletos = datos;



    if(expandir){


        // Actualización completa hasta junio 2026
        datosGlobales = datos;



    }else{


        // Histórico completo hasta febrero 2026

        const mesesPermitidos = {

            "Enero":1,
            "Febrero":2,
            "Marzo":3,
            "Abril":4,
            "Mayo":5,
            "Junio":6,
            "Julio":7,
            "Agosto":8,
            "Septiembre":9,
            "Octubre":10,
            "Noviembre":11,
            "Diciembre":12

        };



        datosGlobales =
        datos.filter(d=>{


            const numeroMes =
            mesesPermitidos[d.mes];



            if(d.anio < 2026){

                return true;

            }



            if(d.anio == 2026 && numeroMes <= 2){

                return true;

            }



            return false;


        });


    }



    llenarFiltros();

    aplicarFiltros();


}


// =====================================================
// FILTROS DINÁMICOS
// =====================================================

function llenarFiltros(){


    const productos = [
        ...new Set(
            datosGlobales.map(
                d => d.producto
            )
        )
    ];



    const anios = [
        ...new Set(
            datosGlobales.map(
                d => d.anio
            )
        )
    ];



    const meses = [
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


            fp.innerHTML +=
            `
            <option value="${p}">
            ${p}
            </option>
            `;


        });



        anios.forEach(a=>{


            fa.innerHTML +=
            `
            <option value="${a}">
            ${a}
            </option>
            `;


        });



        meses.forEach(m=>{


            fm.innerHTML +=
            `
            <option value="${m}">
            ${m}
            </option>
            `;


        });


    }


}




// =====================================================
// APLICAR FILTROS
// =====================================================

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
    )
    ?
    document.getElementById(
        "filtroPeriodo"
    ).value
    :
    "Todos";




    let datos = [
        ...datosGlobales
    ];




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




    // =====================================================
    // PERIODOS TRIMESTRALES
    // =====================================================


    if(periodo !== "Todos"){


        datos =
        datos.filter(d=>{


            const meses = {


                "Enero":1,
                "Febrero":2,
                "Marzo":3,

                "Abril":4,
                "Mayo":5,
                "Junio":6,

                "Julio":7,
                "Agosto":8,
                "Septiembre":9,

                "Octubre":10,
                "Noviembre":11,
                "Diciembre":12


            };



            const numeroMes =
            meses[d.mes];



            const trimestre =
            Math.ceil(
                numeroMes / 3
            );



            return (
                periodo ===
                "Trimestre"+trimestre
            );


        });


    }




    actualizarKPIs(datos);


    actualizarTabla(datos);


    drawGoogleChart(datos);


    drawBubbleChart(datos);


    drawBoxplot(datos);


    actualizarStatsBoxplot(datos);



}





// =====================================================
// KPIS
// =====================================================

function actualizarKPIs(datos){


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


        resumen[d.producto] =
        (
            resumen[d.producto] || 0
        )
        +
        d.ventas;


    });




    let lider="-";



    if(Object.keys(resumen).length>0){


        lider =
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


    }





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






// =====================================================
// TABLA RESUMEN
// =====================================================


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


        html +=
        `

        <tr>

        <td>${p}</td>

        <td>
        ${resumen[p].ventas.toLocaleString()}
        </td>


        <td>
        $
        ${resumen[p].ingresos.toLocaleString()}
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








// =====================================================
// TABLA ESTADISTICA BOX
// =====================================================


function actualizarStatsBoxplot(datos){



    if(datos.length===0)
    return;



    const agrupado={};



    datos.forEach(d=>{


        if(!agrupado[d.producto]){


            agrupado[d.producto]=[];

        }


        agrupado[d.producto]
        .push(
            d.ventas
        );


    });




    let html="";



    Object.keys(agrupado)
    .forEach(producto=>{


        const ventas =
        agrupado[producto];



        html +=
        `

        <tr>

        <td>${producto}</td>

        <td>
        ${Math.min(...ventas)}
        </td>


        <td>
        ${Math.max(...ventas)}
        </td>


        <td>
        ${(d3.mean(ventas)).toFixed(2)}
        </td>


        </tr>


        `;



    });




    document.getElementById(
        "tablaStatsBody"
    )
    .innerHTML = html;


}







// =====================================================
// EVENTOS
// =====================================================


google.charts.setOnLoadCallback(
    ()=>
    cargarDatos(false)
);




document
.getElementById("actualizar")
.addEventListener(
    "click",
    ()=>cargarDatos(true)
);





[
"filtroProducto",
"filtroAnio",
"filtroMes",
"filtroPeriodo"

]
.forEach(id=>{


    const elemento =
    document.getElementById(id);



    if(elemento){


        elemento.addEventListener(
            "change",
            aplicarFiltros
        );


    }


});