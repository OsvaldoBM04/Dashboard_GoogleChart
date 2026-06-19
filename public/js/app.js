let datosGlobales = [];

async function cargarDatos(expandir=false){

    const respuesta =
        await fetch("/api/ventas?" + Date.now());


    const datos =
        await respuesta.json();


    if(expandir){

        datosGlobales = datos;

    }else{

        datosGlobales =
        datos.filter(d =>
            d.mes === "Enero" ||
            d.mes === "Febrero"
        );

    }


    llenarFiltros();

    aplicarFiltros();

}

function llenarFiltros(){

    const productos =
        [...new Set(
            datosGlobales.map(
                d => d.producto
            )
        )];

    const anios =
        [...new Set(
            datosGlobales.map(
                d => d.anio
            )
        )];

    const meses =
        [...new Set(
            datosGlobales.map(
                d => d.mes
            )
        )];

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

    if(fp.options.length===1){

        productos.forEach(p=>{

            fp.innerHTML +=
            `<option value="${p}">
                ${p}
            </option>`;

        });

        anios.forEach(a=>{

            fa.innerHTML +=
            `<option value="${a}">
                ${a}
            </option>`;

        });

        meses.forEach(m=>{

            fm.innerHTML +=
            `<option value="${m}">
                ${m}
            </option>`;

        });

    }

}

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

    let datos =
        [...datosGlobales];

    if(producto!=="Todos"){

        datos =
        datos.filter(
            d =>
            d.producto===producto
        );

    }

    if(anio!=="Todos"){

        datos =
        datos.filter(
            d =>
            d.anio==anio
        );

    }

    if(mes!=="Todos"){

        datos =
        datos.filter(
            d =>
            d.mes===mes
        );

    }

    actualizarKPIs(datos);

    actualizarTabla(datos);

    drawGoogleChart(datos);

    drawBubbleChart(datos);

    drawBubblePieChart(datos);

}

function actualizarKPIs(datos){

    const ventas =
        datos.reduce(
            (a,b)=>a+b.ventas,
            0
        );

    const ingresos =
        datos.reduce(
            (a,b)=>a+b.ingresos,
            0
        );

    const precio =
        datos.reduce(
            (a,b)=>a+b.precio,
            0
        ) / datos.length;

    const resumen = {};

    datos.forEach(d=>{

        resumen[d.producto] =
        (resumen[d.producto]||0)
        +
        d.ventas;

    });

    const lider =
        Object.keys(resumen)
        .reduce(
            (a,b)=>
            resumen[a]>
            resumen[b]
            ? a : b
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

function actualizarTabla(datos){

    const resumen = {};

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

    let html = "";

    Object.keys(resumen)
    .forEach(p=>{

        html += `

        <tr>

            <td>${p}</td>

            <td>
            ${resumen[p]
            .ventas
            .toLocaleString()}
            </td>

            <td>
            $
            ${resumen[p]
            .ingresos
            .toLocaleString()}
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




google.charts
.setOnLoadCallback(
    () => cargarDatos(false)
);






document
.getElementById("actualizar")
.addEventListener(
    "click",
    () => cargarDatos(true)
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