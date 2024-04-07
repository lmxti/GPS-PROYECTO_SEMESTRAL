
# [ Proyecto GPS ] Foro estudiantil 

Este proyecto corresponde a la asignatura Gestión de Proyectos de Software y el objetivo principal es desarollar una solución para el problema del entorno educativo en la universidad potenciando la comunicacion y la colaboracion efectiva entre los mismos estudiantes.


## Tecnologías

**Client (Frontend):** React & Tailwind CSS

**Server:** Node, Express & MongoDB


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


## Modelos

#### Modelo de Usuario (User)
El modelo de usuario representa a los usuarios de la aplicación. Contiene la siguiente información:

- name: Nombre personal del usuario.
- surname: Apellido personal del usuario.
- username: Nombre de usuario único.
- description: Descripción del usuario.
- birthdate: Fecha de nacimiento del usuario.
- gender: Género del usuario (femenino, masculino, otro).
- email: Correo electrónico del usuario.
- password: Contraseña del usuario (encriptada).
- joinedAt: Fecha en que el usuario se registró.
 Relaciones:
- roleUser: Rol del usuario.
- posts: Publicaciones del usuario.
- badges: Insignias del usuario.
- comments: Comentarios del usuario.
- followed: Usuarios seguidos por el usuario.
- followers: Seguidores del usuario.
- followedHashtags: Hashtags seguidos por el usuario.
- notifications: Notificaciones del usuario.
#### Modelo de Rol (Role)
El modelo de rol representa los roles de los usuarios en la aplicación. Contiene la siguiente información:

- nameRole: Nombre del rol (administrador, usuario, moderador).
#### Modelo de Reporte (Report)
El modelo de reporte representa los informes realizados por los usuarios sobre contenido específico. Contiene la siguiente información:

- reportType: Tipo de reporte.
- contentReport: Contenido del reporte.
- dateReport: Fecha en que se realizó el reporte.
Relaciones:
- userReport: Usuario que realizó el reporte.
- postReport: Publicación que ha sido reportada.

#### Modelo de Publicación (Post)
El modelo de publicación representa las publicaciones realizadas por los usuarios en la aplicación. Contiene la siguiente información:

- title: Título de la publicación.
- description: Descripción de la publicación.
- images: Imágenes incluidas en la publicación.
- createdAt: Fecha de creación de la publicación.
- Relaciones:
- author: Autor de la publicación.
- hashtags: Hashtags asociados a la publicación.
- comments: Comentarios de la publicación.

#### Modelo de Notificación (Notification)
El modelo de notificación representa las notificaciones enviadas a los usuarios. Contiene la siguiente información:

- contentNotification: Contenido de la notificación.
- dateNotification: Fecha de la notificación.
#### Modelo de Hashtag (Hashtag)
El modelo de hashtag representa los hashtags utilizados en la aplicación. Contiene la siguiente información:

- nameHashtag: Texto único del hashtag.

#### Modelo de Comentario (Comment)
El modelo de comentario representa los comentarios realizados por los usuarios en la aplicación. Contiene la siguiente información:

- userComment: Comentario del usuario.
- ImageComment: Imagen adjunta al comentario.
- fileComment: Archivo adjunto al comentario.
- createdAt: Fecha en que se realizó el comentario.
Relaciones:
- user: Usuario que realizó el comentario.

#### Modelo de Insignia (Badge)
El modelo de insignia representa las insignias otorgadas a los usuarios en la aplicación. Contiene la siguiente información:

nameBadge: Nombre único de la insignia.
descriptionBadge: Descripción de la insignia.
imageBadge: Imagen de la insignia.
Este resumen proporciona una descripción concisa de cada modelo y los datos que contienen, así como las relaciones entre ellos cuando corresponde.

## Servidor y configuracion

Lo siguiente es la configuracion basica del servidor (setupServer) que incluye y hace uso de:
- La variable de entorno `PORT`
-  Las dependencias de `express`, `cors`, `cookieParser` y `morgan`.
- Las rutas del archivo `index.routes`
- Funcion `setupDB` que se encarga de conectar el proyecto con la base de datos.

### Función setupServer para configuración y levantamiento de servidor
1. Crea una instancia de la aplicación Express:
```javascript
const server = express();
```
2. Configuración middleware para analizar solicitudes en formato JSON:
```javascript
server.use(express.json());
```
3. Configuracion middleware CORS para permitir solicitudes desde un origen y con credenciales ya sea por cookies o encabezados.
```javascript
server.use(cors({ origin: 'http://localhost:3000', credentials: true}));
```
4. Configuracion middleware para el manejo de cookies
```javascript
server.use(cookieParser());
```
5. Configuracion middleware para registrar solicitudes HTTP en formato "dev"
```javascript
server.use(morgan("dev"));
```
6. Configuracion de aplicacion Express para analizar el cuerpo de las solicitudes entrantes con codificacion de tipo "application/x-www-form-urlencoded"
```javascript
server.use(express.urlencoded({ extended: true }));
```
7. Asignar rutas definidas en 'indexRoutes' con el prefijo `/api`
```javascript
server.use("/api", indexRoutes);
```
8. Inicialización del servidor
```javascript
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api`);
})
```
### Creación de registros como roles, usuarios default, etc.
En este módulo se incluyen funciones `createRoles()` y `createDefaultUsers()`, las cuales se encargan de crear los roles y usuarios predeterminados del sistema. Estas funciones se utilizaran para la configuracion inicial de proyecto al momento de inicializar el proyecto.

La función `createRoles()` verifica si ya existen roles en la base de datos. Si no hay ninguno, crea los roles por defecto como "Usuario", "Administrador" y "Moderador".

Por otro lado, la función `createDefaultUsers()` realiza una tarea similar para los usuarios. Si no hay usuarios en la base de datos, crea usuarios predeterminados con diferentes roles asignados, como administrador, usuario y moderador.

Ambas funciones se ejecutan durante la configuración inicial de la API para establecer una configuración básica del sistema.


### Configuracion setupAPI
La funcion `setupAPI` es la que se encarga de preparar los componentes/funciones necesarios para poner en funcionamiento la API web, desde la configuracion de la base de datos (setupDB), la aplicacion Express (Servidor) hasta la creacion de roles y usuarios predeterminados, por lo que esta incluye:
- setupDB
- setupServer
- createRoles & createDefaultUsers provenientes de `initial.setup.js`

```javascript
async function setupAPI() {
  try {
    await setupDB();
    await setupServer();
    await createRoles();
    await createDefaultUsers();
    
  } catch (error) {
    console.log("Error en setupAPI ",error);
  }
}

setupAPI()
  .then( () => console.log("setupAPI => API web, Servidor y configuracion predeterminada exitosa"))
  .catch( (error) => console.log("setupAPI => Error -> Ocurrio un error: ", error))
```
## Authors

- Lider de proyecto: [@lmxti](https://github.com/lmxti)
- Programador: [@DJVegaG](https://github.com/DJVegaG)
- Programador: [@Sebasaraneda](https://github.com/Sebasaraneda)
- Programador: [@vcntsnhz](https://github.com/vcntsnhz)
- Analista diseñador: [Javiernvc1](https://github.com/Javiernvc1)
- Tester: [@VictorHM23](https://github.com/VictorHM23)

