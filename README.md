# Nest CRM

Sistema de gestión de relaciones con clientes (CRM) desarrollado con NestJS, que integra PostgreSQL y MongoDB para un manejo eficiente de datos estructurados y no estructurados.

## Características

- **Autenticación y Autorización**
  - Sistema de autenticación basado en JWT
  - Roles de usuario (admin, user)
  - Protección de rutas con guards
  - Decoradores personalizados para control de acceso

- **Gestión de Usuarios**
  - CRUD completo de usuarios
  - Información básica en PostgreSQL
  - Información adicional en MongoDB
  - Validación de datos con class-validator
  - Manejo de contraseñas seguro con bcrypt

- **Gestión de Compañías**
  - CRUD completo de compañías
  - Información básica en PostgreSQL
  - Información adicional en MongoDB
  - Búsqueda por nombre y tipo
  - Validación de datos

- **Gestión de Productos**
  - CRUD completo de productos
  - Información básica en PostgreSQL
  - Información adicional en MongoDB
  - Filtrado por compañía
  - Validación de datos

- **Base de Datos Híbrida**
  - PostgreSQL para datos estructurados
  - MongoDB para información adicional flexible
  - Conexiones independientes y configurables
  - Transacciones y validaciones

- **Seguridad**
  - Encriptación de contraseñas
  - Protección contra inyección SQL
  - Validación de datos de entrada
  - Manejo seguro de tokens JWT

- **Logging y Monitoreo**
  - Logs detallados de operaciones
  - Trazabilidad de errores
  - Monitoreo de rendimiento
  - Debugging mejorado

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- MongoDB (v6 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/ctatis1/nest-crm.git
cd nest-crm
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con tus credenciales de base de datos y configuración.

```env
# Configuración general
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_secreto_jwt_aqui
JWT_EXPIRATION=24h

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=nestcrm

# MongoDB
MONGO_URI=mongodb://localhost:27017/nestcrm
```

4. Iniciar el servidor:
```bash
npm run start:dev
```

5. Insertar datos iniciales de ciudades y departamentos:
```bash
npx ts-node src/scripts/run-import.ts
```

## Estructura del Proyecto

```
src/
├── auth/                 # Autenticación y autorización
├── companias/           # Gestión de compañías
├── productos/           # Gestión de productos
├── usuarios/            # Gestión de usuarios
├── ciudades/            # Gestión de ciudades
├── departamentos/       # Gestión de departamentos
├── events/              # Eventos y WebSockets
├── common/              # Código compartido
│   ├── decorators/     # Decoradores personalizados
│   ├── filters/        # Filtros de excepciones
│   └── interceptors/   # Interceptores
├── config/             # Configuración de la aplicación
├── entities/           # Entidades de base de datos
├── schemas/            # Esquemas de MongoDB
├── scripts/            # Scripts de utilidad
├── app.controller.ts   # Controlador principal
├── app.service.ts      # Servicio principal
├── app.module.ts       # Módulo principal
└── main.ts            # Punto de entrada de la aplicación
```

### Descripción de Componentes

#### Módulos de Negocio
- **auth**: Maneja la autenticación y autorización del sistema
- **companias**: Gestiona las compañías y su información adicional
- **productos**: Administra los productos y sus detalles
- **usuarios**: Controla los usuarios y sus datos
- **ciudades**: Gestiona las ciudades del sistema
- **departamentos**: Administra los departamentos

#### Componentes Compartidos
- **common**: Contiene código reutilizable como decoradores, filtros e interceptors
- **config**: Almacena las configuraciones de la aplicación
- **entities**: Define las entidades de PostgreSQL
- **schemas**: Define los esquemas de MongoDB
- **events**: Maneja los eventos y WebSockets
- **scripts**: Contiene scripts de utilidad para la aplicación

#### Archivos Principales
- **main.ts**: Punto de entrada de la aplicación
- **app.module.ts**: Configuración principal del módulo
- **app.controller.ts**: Controlador principal
- **app.service.ts**: Servicio principal

## API Endpoints

### Autenticación
- `POST /auth/login` - Inicio de sesión
- `POST /auth/register` - Registro de usuario

### Usuarios
- `GET /usuarios` - Listar usuarios
- `POST /usuarios` - Crear usuario
- `GET /usuarios/:id` - Obtener usuario
- `PATCH /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario
- `POST /usuarios/:id/info` - Crear información adicional
- `GET /usuarios/:id/info` - Obtener información adicional
- `PATCH /usuarios/:id/info` - Actualizar información adicional

### Compañías
- `GET /companias` - Listar compañías
- `POST /companias` - Crear compañía
- `GET /companias/:id` - Obtener compañía
- `PATCH /companias/:id` - Actualizar compañía
- `DELETE /companias/:id` - Eliminar compañía
- `POST /companias/:id/info` - Crear información adicional
- `GET /companias/:id/info` - Obtener información adicional
- `PATCH /companias/:id/info` - Actualizar información adicional

### Productos
- `GET /productos` - Listar productos
- `POST /productos` - Crear producto
- `GET /productos/:id` - Obtener producto
- `PATCH /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto
- `POST /productos/:id/info` - Crear información adicional
- `GET /productos/:id/info` - Obtener información adicional
- `PATCH /productos/:id/info` - Actualizar información adicional

## Scripts Disponibles

- `npm run start` - Iniciar en modo producción
- `npm run start:dev` - Iniciar en modo desarrollo
- `npm run build` - Compilar el proyecto

## Pruebas de la API

### 1. Registro de Usuario
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "Contraseña123!",
  "companyId": 1
}'
```

### 2. Inicio de Sesión
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "juan@ejemplo.com",
  "password": "Contraseña123!"
}'
```

### 3. Crear Compañía
```bash
curl -X POST http://localhost:3000/companias \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TU_TOKEN_JWT" \
-d '{
  "nombre": "Empresa Ejemplo S.A.S",
  "direccion": "Carrera 89 #45-67",
  "ciudadId": 1,
  "departamentoId": 1
}'
```

### 4. Agregar Información Adicional a Compañía
```bash
curl -X POST http://localhost:3000/companias/1/info \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TU_TOKEN_JWT" \
-d '{
  "companiaId": 1,
  "logoUrl": "https://ejemplo.com/logo.png",
  "telefono": "6011234567",
  "direccion": "Carrera 89 #45-67",
  "actividadEconomica": "Desarrollo de Software",
  "codigoActividadEconomica": "6201"
}'
```

### 5. Crear Producto
```bash
curl -X POST http://localhost:3000/productos \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TU_TOKEN_JWT" \
-d '{
  "nombre": "Software CRM Premium",
  "descripcion": "Sistema de gestión de relaciones con clientes",
  "precio": 199.99,
  "companyId": 1
}'
```

### 6. Agregar Información Adicional a Producto
```bash
curl -X POST http://localhost:3000/productos/1/info \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TU_TOKEN_JWT" \
-d '{
  "productoId": 1,
  "imagenesUrls": [
    "https://ejemplo.com/producto1.jpg",
    "https://ejemplo.com/producto2.jpg"
  ],
  "cantidad": 100,
  "categoria": "Software",
  "subCategoria": "CRM"
}'
```

### 7. Agregar Información Adicional a Usuario
```bash
curl -X POST http://localhost:3000/usuarios/1/info \
-H "Content-Type: application/json" \
-H "Authorization: Bearer TU_TOKEN_JWT" \
-d '{
  "userId": 1,
  "imagenPerfil": "https://ejemplo.com/perfil.jpg",
  "telefono": "3001234567",
  "direccion": "Calle 123 #45-67",
  "nombreUsuario": "juanperez",
  "cargo": "Gerente de Ventas",
  "salario": 5000000,
  "impuestosAnuales": 600000
}'
```

### Notas Importantes:
- Reemplaza `TU_TOKEN_JWT` con el token recibido en el login
- Los IDs (como `companyId`, `ciudadId`, `departamentoId`, etc.) deben ser ajustados según los datos existentes
- Asegúrate de que el servidor esté corriendo en `localhost:3000`
- Todos los campos marcados como opcionales en los DTOs pueden ser omitidos en las peticiones

