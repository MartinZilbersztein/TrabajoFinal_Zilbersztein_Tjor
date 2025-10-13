# RabbIA

RabbIA es una app que combina un backend en Node/Express con un frontend en React para ofrecer una experiencia interactiva basada en contenidos y/o consultas asistidas por modelos de lenguaje a través de LlamaIndex.TS

## Requisitos previos
- Node.js 18+ y npm
- PostgreSQL (si se usa base de datos local)
- Opcional/según configuración: Ollama instalado y un modelo disponible (p. ej., llama3) si se usa @llamaindex/ollama localmente

## Estructura del proyecto
```
/
├─ .env.example
├─ package.json           # Backend (Express)
├─ package-lock.json
├─ src/                   # Código del backend (p. ej. app.js)
├─ frontend-Nextmind/     # Frontend (Vite + React)
│  ├─ package.json
│  └─ src/
└─ README.md
```

## Instalación

1. Clona el repositorio:
  ```bash
  git clone https://github.com/MartinZilbersztein/TrabajoFinal_Zilbersztein_Tjor.git
  cd TrabajoFinal_Zilbersztein_Tjor
  ```
2. Instala las dependencias
  - Backend
  ```bash
  # En la raíz del repo (backend)
  npm install
  ```
  - Frontend
  ```bash
  # Instalar dependencias del frontend
  cd frontend-Nextmind
  npm install
  ```
3. Instalar proveedor de LlamaIndex
  El proveedor para LlamaIndex se gestiona vía npm. Si fuera necesario reinstalarlo/añadirlo explícitamente:
  ```bash
  # Desde la raíz (backend)
  npm install llamaindex @llamaindex/ollama
  ```
  Nota: Si ya ejecutaste `npm install` en el backend y el proveedor está declarado en package.json, no necesitas hacer nada adicional.
4. Configuración
  - Copia el archivo de ejemplo y completa las variables:
    ```bash
    cp .env.example .env
    ```
  - Revisa y ajusta las variables según tu entorno. Consultá `.env.example` para ver todas las claves soportadas. Usualmente incluyen:
    - Variables de servidor: `PORT`, `CORS_ORIGIN`
    - Conexión a base de datos: `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` o `DATABASE_URL`
    - LLM/Ollama: `OLLAMA_BASE_URL`, `LLM_MODEL` (p. ej., `llama3`)
  - Si el frontend requiere variables (por ejemplo, URL del backend), definilas según el mecanismo de Vite (variables `VITE_...`) en un `.env` dentro de `frontend-Nextmind` si aplica.

## Ejecución

En dos terminales separadas:

1. Backend
```bash
# Terminal 1 (en la raíz del repo)
npm run dev
# o
npm start
```
- El puerto lo define `PORT` en `.env` (por defecto suele ser 3000 si así se configuró).

2. Frontend
```bash
# Terminal 2
cd frontend-Nextmind
npm run dev
```
- Vite usualmente sirve en http://localhost:5173 (puede variar, ver salida de la consola).

Asegurate de que:
- El backend esté corriendo antes de usar el frontend.
- Las URLs del frontend apunten al backend correcto (CORS y origen configurados).

## Scripts útiles

Backend (raíz):
- `npm run dev`: arranca el servidor con recarga (nodemon).
- `npm start`: arranca el servidor con Node.

Frontend (`frontend-Nextmind`):
- `npm run dev`: arranca Vite en modo desarrollo.
- `npm run build`: build de producción del frontend.
- `npm run preview`: sirve el build para vista previa local.

## Estado del proyecto
- Estado: En desarrollo
- Próximos pasos: estabilización de endpoints, afinado de prompts/índices, mejoras de UI/UX y despliegue.

## Contribuir
1. Hacé un fork del repo
2. Creá una rama: `git checkout -b feature/mi-cambio`
3. Commit: `git commit -m "feat: descripción del cambio"`
4. Push: `git push origin feature/mi-cambio`
5. Abrí un Pull Request con el detalle del cambio
