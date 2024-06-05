const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const app = express();

// Primero carga la configuración del archivo .env para que esté disponible en las demás llamadas
dotenv.config();

// Se requiere para entender los datos recibidos en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cors
const corsOptions = {
    origin: "*", // Permitir todos los orígenes
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
};
app.use(cors(corsOptions));

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Bitacora
app.use(require("./middlewares/bitacora.middleware"));

// Rutas
app.use("/api/categorias", require('./routes/categorias.routes'));
app.use("/api/peliculas", require('./routes/peliculas.routes'));
app.use("/api/usuarios", require('./routes/usuarios.routes'));
app.use("/api/roles", require('./routes/roles.routes'));
app.use("/api/auth", require('./routes/auth.routes'));
app.use("/api/archivos", require('./routes/archivos.routes'));
app.use("/api/bitacora", require('./routes/bitacora.routes'));
app.get('*', (req, res) => { res.status(404).send(); });

// Middleware para el manejo de errores (Debe ser el último middleware a utilizar)
const errorlogger = require('./middlewares/errorlogger.middleware');
const errorhandler = require('./middlewares/errorhandler.middleware');
app.use(errorlogger, errorhandler);

// Inicia el servidor web en el puerto PORT
app.listen(process.env.PORT, () => {
    console.log(`Aplicación de ejemplo escuchando en el puerto ${process.env.PORT}`);
});
