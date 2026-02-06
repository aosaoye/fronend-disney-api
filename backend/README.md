# Disney/TMDB API Backend - Hexagonal Architecture

Este proyecto es un backend construido con Node.js, Express y TypeScript, siguiendo los principios de la **Arquitectura Hexagonal (Ports and Adapters)**. Su objetivo es proporcionar una API para consultar información de personajes/películas (actualmente conectado a TMDB).

## Estructura del Proyecto

El código está organizado para separar claramente las responsabilidades y desacoplar la lógica de negocio de las herramientas externas (Base de datos, APIs, Framework Web).

### 1. Domain (`src/domain`)
Es el núcleo de la aplicación. Contiene las reglas de negocio y definiciones abstractas.
*   **Entities**: Modelos de datos puros (`Character.ts`).
*   **Repositories**: Interfaces (contratos) que definen cómo se accede a los datos (`CharacterRepository.ts`). No hay implementación aquí, solo definiciones.

### 2. Application (`src/application`)
Contiene los Casos de Uso de la aplicación.
*   **Use Cases**: Orquestan la lógica de negocio (`GetCharacters.ts`). Utilizan los repositorios del dominio (inyectados) para obtener datos, sin saber de dónde vienen (API, SQL, etc.).

### 3. Infrastructure (`src/infrastructure`)
Implementaciones concretas de las interfaces del dominio y conexiones externas.
*   **Adapters**: Implementaciones reales de los repositorios (`TMDBAdapter.ts`). Aquí es donde se llama a la API externa.
*   **DB**: Configuración de conexiones a datos (`db.ts`).

### 4. Interfaces (`src/interfaces`)
La capa de entrada/salida hacia el usuario o sistemas externos (el "Puerto Primario").
*   **HTTP/Controllers**: Manejan las peticiones Web (`CharacterController.ts`). Reciben la petición, llaman al Caso de Uso y devuelven la respuesta.
*   **Routes**: Definición de rutas de Express.

---

## Cambios Recientes (Refactorización)

Se ha realizado un análisis y limpieza del código para cumplir estrictamente con la Arquitectura Hexagonal y eliminar deuda técnica.

### Mejoras en Arquitectura
*   **Inyección de Dependencias**: Se refactorizó `CharacterController`. Antes instanciaba el adaptador (`TMDBAdapter`) internamente, creando un acoplamiento fuerte. Ahora, el Controlador recibe el Caso de Uso por constructor, y el Caso de Uso recibe el Repositorio. Esto permite cambiar el origen de datos (ej. de TMDB a una DB local) tocando solo el archivo de rutas, sin modificar la lógica de los controladores.

### Limpieza de Código (Code Cleanup)
Se eliminaron archivos y clases que no estaban en uso o eran redundantes, reduciendo el ruido y facilitando el mantenimiento:
*   **Eliminado**: `src/infrastructure/adapter/SqliteAdapter.ts` (Implementación vacía/sin uso).
*   **Eliminado**: `src/infrastructure/adapter/DisneyApiAdapter.ts` (Implementación obsoleta).
*   **Limpieza en `db.ts`**: Se eliminaron las clases `DisneyDB` y `Sqlite3DB` que habían quedado huérfanas tras eliminar sus adaptadores correspondientes.
