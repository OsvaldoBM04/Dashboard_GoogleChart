google.charts.load("current", {
    packages: ["corechart"]
});

function drawGoogleChart(datos) {

    if (!datos || datos.length === 0) return;

    const tabla = [
        ["Mes", "Smartphone A", "Smartphone B", "Tablet X"]
    ];

    const meses = {};

    datos.forEach(d => {

        const clave = `${d.anio}-${d.mes}`;

        if (!meses[clave]) {
            meses[clave] = {
                "Smartphone A": 0,
                "Smartphone B": 0,
                "Tablet X": 0
            };
        }

        meses[clave][d.producto] += d.ventas;

    });

    Object.keys(meses).forEach(k => {
        tabla.push([
            k,
            meses[k]["Smartphone A"],
            meses[k]["Smartphone B"],
            meses[k]["Tablet X"]
        ]);
    });

    const data = google.visualization.arrayToDataTable(tabla);

    const options = {
        title: "Ventas históricas por producto",
        height: 500,
        legend: { position: "top" }
    };

    const chart = new google.visualization.ColumnChart(
        document.getElementById("googleChart")
    );

    chart.draw(data, options);

    // 🔥 IMPORTANTE: llamar pie después del render
    setTimeout(() => {
        drawPieChart(datos);
    }, 100);
}

function drawPieChart(datos) {

    if (!datos || datos.length === 0) return;

    const resumen = {};

    datos.forEach(d => {
        resumen[d.producto] = (resumen[d.producto] || 0) + d.ventas;
    });

    const tabla = [["Producto", "Ventas"]];

    Object.keys(resumen).forEach(p => {
        tabla.push([p, resumen[p]]);
    });

    const data = google.visualization.arrayToDataTable(tabla);

    const options = {
        title: "Participación de ventas por producto",
        pieHole: 0.4,
        height: 450
    };

    const chart = new google.visualization.PieChart(
        document.getElementById("pieChart")
    );

    chart.draw(data, options);
}