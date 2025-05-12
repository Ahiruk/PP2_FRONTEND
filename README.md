# 🧪 Mi OpenLab

Mi OpenLab es una plataforma web donde los usuarios pueden registrarse, iniciar sesión y gestionar sus propios proyectos de forma privada. Además, permite explorar públicamente proyectos creados por otros usuarios. Está construida con React, Firebase y CSS, ofreciendo una experiencia limpia, segura y visualmente agradable.

## 🌐 Como ejecutar

Desde consola: 
- npm install (para instalar todas las dependecias)
- npm run dev

---

## 🚀 Funcionalidades

### 🔐 Autenticación de Usuarios

- Registro con correo electrónico y contraseña (Firebase Auth).
- Inicio y cierre de sesión.
- Validación de formularios (campos requeridos, email válido, contraseñas seguras).
- Rutas privadas protegidas: solo usuarios autenticados acceden a su perfil.

### 🧑‍💼 Portal Privado – "Mi Perfil"

- Visualizar una lista de tus proyectos personales.
- Crear un nuevo proyecto con:
  - Título (obligatorio).
  - Descripción breve (obligatoria).
- Editar título o descripción de un proyecto.
- Eliminar un proyecto (con confirmación).
- Datos almacenados en Firebase Firestore bajo el UID del usuario.

### 🌍 Portal Público – "Explorar Proyectos"

- Página pública accesible para todos los usuarios.
- Listado de proyectos creados por distintos usuarios.
- Cada tarjeta muestra:
  - Título del proyecto.
  - Autor del proyecto.
- Página de detalle al hacer clic en un proyecto:
  - Título completo.
  - Descripción extendida.
  - Nombre del autor.
  - Fecha de subida.

### 🎨 Diseño y Estilo

- Interfaz limpia y agradable usando CSS.
- Colores armónicos y jerarquía visual clara.
- Botones estilizados y formularios bien organizados.
- Diseño responsivo para una experiencia fluida en distintos dispositivos.

### 🌙 Modo Oscuro

- La aplicación incluye soporte para **Dark Mode**.
- Se adapta a entornos oscuros sin comprometer legibilidad ni estilo.
- Colores y estilos visuales adaptados coherentemente en todos los componentes.

---

## 🛠️ Tecnologías Utilizadas

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Firebase Authentication](https://firebase.google.com/products/auth)
- [Firebase Firestore](https://firebase.google.com/products/firestore)
- [Vite](https://vitejs.dev/) (como bundler)

---

## 📦 Instalación y Despliegue Local

### 🔧 Requisitos previos

- Node.js v18+
- Firebase project creado con Authentication y Firestore habilitados

### ▶️ Pasos de instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Ahiruk/PP2_FRONTEND.git
