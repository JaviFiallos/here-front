# Sistema de Gestión Académica y Asistencia

Este proyecto es una plataforma web para la gestión académica universitaria y el control de asistencia mediante QR, compuesta por un **backend en Go (Fiber)** y un **frontend en React (Vite)**. Permite la administración de usuarios, universidades, facultades, cursos, secciones, horarios y el registro de asistencia de estudiantes a través de una app móvil.

---

## Características principales

- **Autenticación JWT** (admin y docentes)
- **Gestión de usuarios** (admin, docentes, estudiantes)
- **CRUD de universidades, facultades, cursos y secciones**
- **Gestión de horarios (schedules) por sección**
- **Registro y visualización de asistencia** (por QR, desde app móvil)
- **Visualización de asistencia por sección y horario**
- **Panel de perfil y experiencia de usuario moderna**
- **Manejo avanzado de errores y validaciones**
- **Protección de rutas y roles**

---

## Tecnologías utilizadas

- **Backend:** Go, Fiber, PostgreSQL, JWT, GORM, Docker (opcional)
- **Frontend:** React, Vite, TypeScript, Material UI, Context API
- **Otros:** date-fns, axios/fetch, ESLint, Prettier

---

## Estructura del proyecto

```
/here-front         # Frontend React (Vite)
/here-backend       # Backend Go (Fiber)
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

### 2. Backend (Go + Fiber)

#### Requisitos
- Go 1.20+
- PostgreSQL

#### Configuración

1. Copia el archivo `.env.example` a `.env` y configura tus variables (DB, JWT, etc).
2. Ejecuta las migraciones y carga datos iniciales si es necesario.

#### Ejecución

```bash
cd here-backend
go mod tidy
go run main.go
```

### 3. Frontend (React + Vite)

#### Requisitos
- Node.js 18+
- npm o yarn

#### Configuración

1. Copia el archivo `.env.example` a `.env` y configura la URL del backend (`VITE_API_URL`).

#### Ejecución

```bash
cd here-front
npm install
npm run dev
```

---

## Uso

1. Inicia sesión como **admin** o **docente**.
2. Administra universidades, facultades, cursos, secciones y usuarios desde el panel.
3. Crea horarios para las secciones.
4. Los estudiantes marcan asistencia desde la app móvil escaneando el QR generado por el docente.
5. Los docentes pueden visualizar la asistencia por sección y horario.

---

## Estructura de la base de datos (resumida)

- **users**: id, email, firstName, lastName, role
- **universities, faculties, courses, sections**
- **schedules**: id, section_id, day_of_week, start_time, end_time
- **attendance**: id, student_id, schedule_id, status, date

---

## Seguridad

- Autenticación y autorización por roles (admin, teacher, student)
- Rutas protegidas en backend y frontend
- Manejo seguro de tokens y refresh

---

## Personalización

- Puedes adaptar los roles, entidades y lógica de asistencia según las necesidades de tu institución.
- El frontend es fácilmente personalizable gracias a Material UI y Vite.

---

## Contribuciones

¡Las contribuciones son bienvenidas!  
Abre un issue o un pull request para sugerencias, mejoras o reportar bugs.

---

## Licencia

MIT

---

**Desarrollado por [Tu Nombre/Equipo]**  
Contacto: [jeffstalim@gmail.com.com]
