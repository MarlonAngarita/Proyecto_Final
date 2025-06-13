# Proyecto Django - kutsaApp

Este repositorio contiene el backend del proyecto **kutsaApp**, una plataforma de e-learning desarrollada con Django y Django REST Framework. El objetivo principal es gestionar usuarios, cursos, módulos, foros, recursos educativos y eventos, facilitando el aprendizaje en línea de manera eficiente y escalable.

## 📁 Estructura del Proyecto

La raíz del proyecto es:

```
D:\Proyecto_final_V2\Proyecto_Django-main
```

El directorio principal de la aplicación es `kutsaApp`, que contiene los siguientes componentes:

- `models.py`: Define los modelos de datos (usuarios, cursos, módulos, foros, recursos, eventos, etc.).
- `views.py`: Gestiona la lógica de negocio y las respuestas HTTP.
- `serializers.py`: Serializa los modelos para la comunicación API (JSON).
- `urls.py` o `routers.py`: Define las rutas y las asocia con las vistas.
- `admin.py`: Configura la administración de modelos en el panel de Django.
- `apps.py`: Configura la aplicación para su inicialización.
- `tests.py`: Incluye pruebas automatizadas.
- `migrations/`: Archivos de migración de la base de datos.
- `__init__.py`: Indica que el directorio es un paquete Python.

Consulta el archivo [`documentacion_backend.md`](./documentacion_backend.md) para una explicación detallada de cada componente.

---

## 🚀 Tecnologías Utilizadas

- **Python 3.x**
- **Django** (framework principal)
- **Django REST Framework** (para la creación de APIs RESTful)
- **SQLite** (por defecto, puedes cambiar a PostgreSQL/MySQL)
- **pip** (gestor de paquetes)
- **Herramientas de administración de Django** (`manage.py`)

---

## ⚙️ Instalación y Ejecución

1. **Clona el repositorio:**
   ```sh
   git clone <URL-del-repositorio>
   cd Proyecto_Django-main
   ```

2. **Crea un entorno virtual:**
   ```sh
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Instala las dependencias:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Aplica migraciones:**
   ```sh
   python manage.py migrate
   ```

5. **Ejecuta el servidor de desarrollo:**
   ```sh
   python manage.py runserver
   ```

---

## 🧪 Pruebas

Para ejecutar las pruebas automatizadas:

```sh
python manage.py test
```

---

## 📚 Documentación

- Consulta [`documentacion_backend.md`](./documentacion_backend.md) para detalles técnicos de cada archivo y componente.
- La documentación del API puede generarse usando herramientas como **drf-yasg** o **Swagger** si se requiere.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un *issue* o envía un *pull request* para sugerencias y mejoras.

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.

---