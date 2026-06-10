const fs = require("fs");

const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

const productos = [

    {
        producto: "Smartphone A",
        ventasBase: 120,
        precioBase: 200
    },

    {
        producto: "Smartphone B",
        ventasBase: 85,
        precioBase: 200
    },

    {
        producto: "Tablet X",
        ventasBase: 60,
        precioBase: 300
    }

];

const factoresMes = {

    Enero:1.00,
    Febrero:0.95,
    Marzo:1.05,
    Abril:1.10,

    Mayo:1.35,

    Junio:1.05,
    Julio:1.10,
    Agosto:0.95,
    Septiembre:1.00,
    Octubre:1.15,

    Noviembre:1.50,

    Diciembre:1.80

};

const datos = [];

let tiempo = 0;

for(let anio = 2021; anio <= 2026; anio++){

    const ultimoMes =
        (anio === 2026)
        ? 6
        : 12;

    for(let m = 0; m < ultimoMes; m++){

        const mes = meses[m];

        productos.forEach(prod => {

            const tendencia =
                1
                +
                0.00002*Math.pow(tiempo,3)
                -
                0.0008*Math.pow(tiempo,2)
                +
                0.02*tiempo;

            const ruido =
                0.95 + Math.random()*0.10;

            const ventas =
                Math.round(
                    prod.ventasBase
                    *
                    factoresMes[mes]
                    *
                    tendencia
                    *
                    ruido
                );

            const precio =
                Math.round(
                    prod.precioBase
                    *
                    (0.95 + Math.random()*0.10)
                );

            const ingresos =
                ventas * precio;

            datos.push({

                producto: prod.producto,

                anio: anio,

                mes: mes,

                ventas: ventas,

                precio: precio,

                ingresos: ingresos

            });

        });

        tiempo++;

    }

}

fs.writeFileSync(
    "./data/ventas.json",
    JSON.stringify(datos,null,2)
);

console.log(
    `${datos.length} registros generados`
);