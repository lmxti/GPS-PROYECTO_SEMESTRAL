
# [ Proyecto GPS ] Foro estudiantil 

Este proyecto corresponde a la asignatura Gestión de Proyectos de Software y el objetivo principal es desarollar una solución para el problema del entorno educativo en la universidad potenciando la comunicacion y la colaboracion efectiva entre los mismos estudiantes.


## Tech Stack

**Client (Frontend):** React & Tailwind CSS

**Server:** Node, Express & MongoDB


## Development server-side

 - **Inicializacion de proyecto Node en la carpeta backend:**
```
npm init
```
El archivo 'package.json' se encarga de describir el proyecto y las dependencias que utilizamos, es fundamental para administrar el proyecto.

- Instalación de dependencia Express:
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


## Authors

- Lider de proyecto: [@lmxti](https://github.com/lmxti)
- Programador: [@DJVegaG](https://github.com/DJVegaG)
- Programador: [@Sebasaraneda](https://github.com/Sebasaraneda)
- Programador: [@vcntsnhz](https://github.com/vcntsnhz)
- Analista diseñador: [Javiernvc1](https://github.com/Javiernvc1)
- Tester: [@VictorHM23](https://github.com/VictorHM23)

