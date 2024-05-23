
# Instalación e inicio de proyecto

Para comenzar con el desarrollo de nuestro proyecto, utilizamos la herramienta create-next-app de Next.js que facilita la creación y configuración inicial de proyectos Next.js. A continuación, se detallan los pasos para la instalación y las opciones seleccionadas durante la configuración.

```bash
npx create-next-app@latest
```

- Marcamos las siguientes opciones:
```
    √ What is your project named? ... frontend
    √ Would you like to use TypeScript? ... No
    √ Would you like to use ESLint? ... No
    √ Would you like to use Tailwind CSS? ...  Yes
    √ Would you like to use `src/` directory? ...  Yes
    √ Would you like to use App Router? (recommended) ... No 
    √ Would you like to customize the default import alias (@/*)? ... No
```
### Explicacion de las opciones seleccionadas
- **What is your project named? ... frontend**
Nombramos nuestro proyecto como frontend.

- **Would you like to use TypeScript? ...** No
Decidimos no usar TypeScript, lo que significa que trabajaremos con JavaScript.

- **Would you like to use ESLint? ...** No
Optamos por no incluir ESLint, una herramienta para identificar y reportar patrones en el código JavaScript.


- **Would you like to use Tailwind CSS? ... Yes** 
Elegimos usar Tailwind CSS, un marco de CSS de utilidad primero que facilita la creación rápida de interfaces de usuario modernas.

- **Would you like to use src/ directory? ... Yes**
Optamos por estructurar nuestro proyecto utilizando un directorio src/, lo que ayuda a organizar el código fuente de manera más clara.

- **Would you like to use App Router? (recommended) ... No**
Decidimos no utilizar el App Router recomendado. En su lugar, probablemente estemos utilizando el método de enrutamiento basado en páginas tradicional de Next.js.

- **Would you like to customize the default import alias (@/*)? ... No**
Optamos por no personalizar el alias de importación predeterminado. Esto significa que utilizaremos las rutas de importación estándar en nuestro proyecto.
# Contexto

El contexto en React es una forma de compartir datos entre componentes sin tener que pasar explicitamente propiedades (props) a traves de cada nivel de estructura de componentes. Especialmente util para datos globales, como autenticacion de usuario, configuracion de la aplicacion o tema(por ejemplo, claro u oscuro).

### Preparación de contexto
Antes que nada, es necesario contar con el directorio para almacenar nuestro contexto que será `src/context/AuthContext.js` y donde importaremos lo siguiente:

 ```javascript
  import { createContext, useContext, useEffect } from 'react';
  import { useRouter } from "next/router";
 ```

Tenemos `createContext` que fue utilizado para crear un objeto de contexto
```javascript
const AuthContext = createContext();
```

El objeto de contexto `AuthContext`contiene dos componentes importantes:

 - **Provider** : Es un componente que envuelve componentes hijos que necesitan acceder al contexto por lo que el valor estara disponible para todos los componentes que lo consumen:

  ```javascript
  <AuthContext.Provider value={/* algún valor */}>
    {children}
  </AuthContext.Provider>
  ```

 - Consumer : En esta ocasion no lo utilizaremos pero es un componenten que consumen  el valor del contexto y se utiliza dentro de los componentes que necesitan acceder a los datos proporcionados por el **Provider**, esto es un ejemplo:
 ```javascript
<MyContext.Consumer>
  {value => /* renderiza algo basado en el valor */}
</MyContext.Consumer>
 ```

 Además importamos `useContext` que es un hook que permite acceder al contexto de manera más sencilla en componentes funcionales. 
 ```javascript
 export const useAuth = () => useContext(AuthContext);
 ```
 En esta ocasion se define y exporta `useAuth` como una función para proporcionar una manera sencilla y conveniente de acceder al contexto de autenticacion(`AuthContext`) desde cualquier componente de la aplicación.

Un ejemplo practico de como se utilizaria `useAuth`
```javascript
import { useAuth } from '../context/AuthContext';

function UserProfile() {
    const { isAuthenticated, user } = useAuth();

    return (
        <div>
            {isAuthenticated ? (
                <p>Welcome, {user.name}</p>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
}

```

### Contexto final

```javascript
import { createContext, useContext, useEffect } from 'react';
import { useRouter } from "next/router";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider( { children }){
    const router = useRouter();
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) || "" : "";
    const isAuthenticated = user ? true : false;

    useEffect(() => {
        if (!isAuthenticated) {
          router.push('/auth');
        }
      }, [isAuthenticated, router]);

    return ( 
        <AuthContext.Provider value={{ isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    );
}
```

 Donde: 
- **Router**: Usa `useRouter` para manejar la navegación.
- **User**: Obtiene el usuario del almacenamiento local del navegador.
- **isAuthenticated**: Determina si el usuario está autenticado.
- `useEffect`: Redirige al usuario a la página de autenticación (/auth) si no está autenticado.
- **AuthContext.Provider**: Proporciona el contexto a los componentes hijos, haciendo que - isAuthenticated y user estén disponibles en toda la aplicación.

## Implementación de contexto

Para integrar el contexto de autenticación en nuestra aplicación Next.js, debemos asegurarnos de que todos los componentes puedan acceder al estado de autenticación. Esto se logra envolviendo nuestra aplicación con el `AuthProvider` en el archivo `_app.js` que s es el punto de entrada para todas las páginas de una aplicación Next.js, lo que nos permite aplicar configuraciones globales, como la autenticación, de manera consistente.

- El primer paso es importar `AuthProvider` desde nuestro contexto de autenticacion y luego envolver la aplicacion con este mismo resultando lo siguiente: 

```javascript
import "@/styles/globals.css";
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```
## Configuracion y Gestion de solicitudes HTTP

Para la gestion de solicitudes HTTP en nuestra aplicacion, utilizamos `axios`, una biblioteca que facilita la realizacion de peticiones a APIs. 

La configuracion se realiza en la ruta y archivo `src/services/root.service.js`. Este archivo se encargara de establecer la URL base para las solicitudfes, manejar las cookies para la autenticacion y configurar los encabezados de las peticiones.

El primer paso es importar los modulos necesarios:
```javascript
import axios from 'axios';
import cookies from 'js-cookie';
```

Lo siguiente es configurar la URL base de la APIs
```
const API_URL = 'http://localhost:3001/api/';
```

Luego, crear una instancia de `axios`con la URL base para configurar que las solicitudes incluyan credenciales(cookies)
```javascript
const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});
```
El ultimo paso es configurar un interceptor de solicitudes que se encarga de:

-  Añadir automaticamente el token de autenticacion desde las cookies a las solicitudes salientes.

- La configuracion del encabezado funciona de manera de que si la solicitud incluye datos de tipo FormData, establece el encabezado **'Content-Type'** en `multipart/form-data`, pero si no automaticamente lo establece como `application/json`

### Configuracion final de manejo de solicitudes
Esta configuración facilita el manejo de solicitudes HTTP en tu aplicación, asegurando que las peticiones sean autenticadas y que los datos se envíen correctamente, especialmente cuando se trata de subir archivos.


```javascript
import axios from 'axios';
import cookies from 'js-cookie';

const API_URL = 'http://localhost:3001/api/';

const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

instance.interceptors.request.use(
    (config) => {
        const token = cookies.get( 'jwt-auth', { path: '/'} );
        if (token) {
            config.headers.Authorization = `Bearer ${ token }`;
        }
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
```