
## Desarollo inicial de proyecto

 - **Inicializacion de proyecto Node en la carpeta backend:**
```
npm init
```
El comando anterior creara un archivo llamado `package.json` se encarga de describir el proyecto y las dependencias que se utilizan, es fundamental para administrar el proyecto.

- **Instalación de dependencia Express:**
```
npm install express
```
Express es un entorno de trabajo (framework) para crear aplicaciones web y APIs en Node.js que utilizamos debido a su simplicidad, flexibilidad y potencia.

-  **Instalacion de dependencia Nodemon (Desarrollador):**
```
npm install -g nodemon
```
La instalacion de nodemon fue de forma global ya es una herramienta de desarrollo que monitorea los cambios en los archivos del proyecyo y reinicia automaticamente el servidor cada vez que detecta cambios.

- **Estructura base de server.js:**
Se creo un archivo 'server.js' el cual sera la base para trabajar y como prueba de su funcionamiento se deja la siguiente aplicacion que inicia un servidor y escucha las conexiones en el puerto 3000. La aplicacion responde con ```"¡Hola mundo!"``` para la solicitud a la url raiz (localhost:3000)

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 
```

- **Configuración de script "dev":**
El script que ejecuta y utiliza la dependencia nodemon se configuro en el archivo package.json y es el siguiente

```json
  "scripts": {
    "dev": "nodemon src/server.js"
  },
```
A partir de aqui se utiliza npm run dev para ejecutar el script, que inicia la aplicacion de nuestro servidor.

- Instalacion de dependencia mongoose
    ```
    npm install mongoose
    ```
 Esta dependencia nos ayudara a mantener la conexion con la base de datos, simplifica el uso de la base de datos en este caso `MongoDB`

- Instalacion de dependencia dotenv
    ```
    npm install dotenv
    ```
Utilizamos `dotenv` para cargar variables de entorno desde un archivo `.env` en nuestra aplicacion, útil para configurar y gestionar nuestrar variables de entorno ya sea de desarollo y producción de manera sencilla y segura.

- Instalacion de dependencia morgan
    ```
    npm install morgan
    ```
`Morgan` es una biblioteca middleware para node.js que utilizaremos para registrar solicitudes HTTP en la consola del servidor. Proporciona un registro de solicitudes detallado que incluye información como el método de solicitud, la URL solicitada, el código de estado de la respuesta, el tiempo de respuesta y mucho más.



## Conexion de proyecto y base de datos

- **Configuracion de base de datos en MongoDB:** creamos proyecto de nombre `GPS-PROYECTO` en [MongoDB](https://www.mongodb.com/e) y luego se crea un Deployment (M0 - Free) con las siguientes especificaciones:
    - Nombre de cluster: `gps-bd`
    - Provider: `aws`
    - Region: `Sao Paulo`
Luego en la seccion de security, en Database Access configurar el rol del usuario como `Atlas admin` y Network Access cofngurar la ip address como `ALLOW ACCESS FROM ANYWHERE` (0.0.0.0/0)

- **Conexión de base de datos MongoDB:** En la sección deployment, conectar a traves de driver especificando
    - Driver: Node.js
    - Version: 5.5 or later

[NOTA] En este proyecto no se instala la dependencia ```mongodb``` solo utilizaremos el
codigo que se encuentra en "Add your coneccion string into your application code" el cual se utilizara en nuestro archivo `.env`


- En este proyecto el archivo `.env` contendra el codigo anterior bajo el nombre de `DB_URL` y también tenedremos la variable `PORT` que por defecto sera '3000'.

 El archivo `.env`se encontrará en la carpeta `/src/config` junto a: 

- El archivo `env.config.js` que se encargara de leer las variables de entorno desde una ubicación distinta a la tradicional (junsto al script del servidor) y asi tener todo mejor organizado:
```javascript 
"use strict";
const path = require("path");

const envFilePath = path.resolve(__dirname, ".env");

require("dotenv").config({ path: envFilePath });

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

module.exports = {
  DB_URL,
  PORT,
};

```
De esta manera, se obtiene el valor de la variable de entorno `DB_URL` y se exporta para poder hacer uso de ella en otros lugares.

- El archivo `db.config.js` que es un fragmento de codigo que se encarga de conectar la aplicación a una base de datos importando la variable de entorno `DB_URL`, está función se exporta para poder hacer uso en el script `server.js` que es el principal.

```javascript 
import { connect } from 'mongoose';
import { DB_URL } from './env.config.js';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  
  /**
   *@name setupDB
   *@description Función que se encarga de conectar la base de datos
   *@returns {Promise<void>}
   *@throws {Error}
   */
  
  async function setupDB() {
    try {
      await mongoose.connect(DB_URL, options);
      console.log("=> Conexión exitosa a la base de datos");
    } catch (error) {
      handleError(error, "/db.config -> setupDB");
    }
  }
  
  module.exports = { setupDB };
```

Luego, haciendo uso de las funciones y variables de entorno anteriores el codigo principal que contiene `server.js` quedo de la siguiente forma:
```javascript
const { PORT } = require('./config/env.config.js')

const express = require('express')

const server = express()

const { setupDB } = require('./config/db.config.js');

server.use(express.json());

server.listen(PORT, () => {
  console.log(`Ejemplo del servidor corriendo en el puerto: ${PORT}`)
  setupDB();
})
```

