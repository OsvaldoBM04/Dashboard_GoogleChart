const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());

app.use(express.static("public"));

app.get("/api/ventas", (req, res) => {

    const ruta = path.join(
        __dirname,
        "data",
        "ventas.json"
    );

    const datos = JSON.parse(
        fs.readFileSync(ruta)
    );

    res.json(datos);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor iniciado en puerto ${PORT}`
    );

});