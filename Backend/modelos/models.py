from django.db import models  # Aseguramos que el módulo models esté correctamente importado.

# Este archivo contiene los modelos de Django que representan las tablas de la base de datos.
# Cada clase corresponde a una tabla y define sus campos y relaciones.

# class AuthGroup(models.Model):
#     name = models.CharField(unique=True, max_length=150)

#     class Meta:
#         managed = True
#         db_table = 'auth_group'


# class AuthGroupPermissions(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
#     permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

#     class Meta:
#         managed = True
#         db_table = 'auth_group_permissions'
#         unique_together = (('group', 'permission'),)


# class AuthPermission(models.Model):
#     name = models.CharField(max_length=255)
#     content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
#     codename = models.CharField(max_length=100)

#     class Meta:
#         managed = True
#         db_table = 'auth_permission'
#         unique_together = (('content_type', 'codename'),)


# class AuthUser(models.Model):
#     password = models.CharField(max_length=128)
#     last_login = models.DateTimeField(blank=True, null=True)
#     is_superuser = models.IntegerField()
#     username = models.CharField(unique=True, max_length=150)
#     first_name = models.CharField(max_length=150)
#     last_name = models.CharField(max_length=150)
#     email = models.CharField(max_length=254)
#     is_staff = models.IntegerField()
#     is_active = models.IntegerField()
#     date_joined = models.DateTimeField()

#     class Meta:
#         managed = True
#         db_table = 'auth_user'


# class AuthUserGroups(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     user = models.ForeignKey(AuthUser, models.DO_NOTHING)
#     group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

#     class Meta:
#         managed = True
#         db_table = 'auth_user_groups'
#         unique_together = (('user', 'group'),)


# class AuthUserUserPermissions(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     user = models.ForeignKey(AuthUser, models.DO_NOTHING)
#     permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

#     class Meta:
#         managed = True
#         db_table = 'auth_user_user_permissions'
#         unique_together = (('user', 'permission'),)


class Biblioteca(models.Model):
    # Modelo que representa la tabla 'biblioteca'.
    id_biblioteca = models.AutoField(primary_key=True)  # Clave primaria de la tabla.
    nombre_biblioteca = models.CharField(max_length=45, verbose_name="Nombre de la Biblioteca")  # Nombre único de la biblioteca.
    contenido_biblioteca = models.CharField(max_length=45, verbose_name="Contenido de la Biblioteca")  # Contenido asociado a la biblioteca.
    descripcion_biblioteca = models.CharField(max_length=45, verbose_name="Descripción de la Biblioteca")  # Descripción de la biblioteca.

    class Meta:
        verbose_name = "Biblioteca"
        verbose_name_plural = "Bibliotecas"
        constraints = [
            models.UniqueConstraint(fields=['nombre_biblioteca'], name='unique_nombre_biblioteca')  # Restricción de unicidad para el nombre.
        ]
        managed = True
        db_table = 'biblioteca'  # Nombre de la tabla en la base de datos.

    def __str__(self):
        return self.nombre_biblioteca


class Categoria(models.Model):
    # Modelo que representa la tabla 'categoria'.
    id_categoria = models.AutoField(primary_key=True)  # Clave primaria de la tabla.
    tipo_categoria = models.CharField(max_length=45, verbose_name="Tipo de Categoría")  # Tipo de categoría.
    curso = models.ForeignKey('Cursos', on_delete=models.CASCADE, db_column='cursos_id_curso', verbose_name="Curso")  # Relación con la tabla 'cursos'.
    foro = models.ForeignKey('Foro', on_delete=models.CASCADE, db_column='foro_id_foro', verbose_name="Foro")  # Relación con la tabla 'foro'.

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        managed = True
        db_table = 'categoria'

    def __str__(self):
        return self.tipo_categoria


class Cursos(models.Model):
    # Modelo que representa la tabla 'cursos'.
    id_curso = models.AutoField(primary_key=True)  # Clave primaria de la tabla.
    nombre_curso = models.CharField(max_length=45, verbose_name="Nombre del Curso")  # Nombre del curso.
    descripcion_curso = models.CharField(max_length=45, verbose_name="Descripción del Curso")  # Descripción del curso.
    contenido_curso = models.CharField(max_length=45, verbose_name="Contenido del Curso")  # Contenido del curso.

    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"
        managed = True
        db_table = 'cursos'  # Nombre de la tabla en la base de datos.

    def __str__(self):
        return self.nombre_curso


class DetalleContenido(models.Model):
    id_detalle_contenido = models.AutoField(primary_key=True)
    biblioteca = models.ForeignKey(Biblioteca, on_delete=models.CASCADE, db_column='biblioteca_id_biblioteca', verbose_name="Biblioteca")
    modulo = models.ForeignKey('Modulos', on_delete=models.CASCADE, db_column='modulos_id_modulo', verbose_name="Módulo")

    class Meta:
        verbose_name = "Detalle de Contenido"
        verbose_name_plural = "Detalles de Contenido"
        managed = True
        db_table = 'detalle_contenido'

    def __str__(self):
        return f"Detalle de {self.biblioteca} en {self.modulo}"

class DetalleCurso(models.Model):
    id_detalle_curso = models.AutoField(primary_key=True)
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE, db_column='quiz_id_quiz', verbose_name="Quiz")
    usuario = models.ForeignKey('Usuarios', on_delete=models.CASCADE, db_column='usuarios_id_usuario', verbose_name="Usuario")
    modulo = models.ForeignKey('Modulos', on_delete=models.CASCADE, db_column='modulos_id_modulo', verbose_name="Módulo")
    curso = models.ForeignKey(Cursos, on_delete=models.CASCADE, db_column='cursos_id_curso', verbose_name="Curso")

    class Meta:
        verbose_name = "Detalle de Curso"
        verbose_name_plural = "Detalles de Curso"
        managed = True
        db_table = 'detalle_curso'

    def __str__(self):
        return f"Detalle de {self.curso} para {self.usuario}"


# class DjangoAdminLog(models.Model):
#     action_time = models.DateTimeField()
#     object_id = models.TextField(blank=True, null=True)
#     object_repr = models.CharField(max_length=200)
#     action_flag = models.PositiveSmallIntegerField()
#     change_message = models.TextField()
#     content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
#     user = models.ForeignKey(AuthUser, models.DO_NOTHING)

#     class Meta:
#         managed = True
#         db_table = 'django_admin_log'


# class DjangoContentType(models.Model):
#     app_label = models.CharField(max_length=100)
#     model = models.CharField(max_length=100)

#     class Meta:
#         managed = True
#         db_table = 'django_content_type'
#         unique_together = (('app_label', 'model'),)


# class DjangoMigrations(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     app = models.CharField(max_length=255)
#     name = models.CharField(max_length=255)
#     applied = models.DateTimeField()

#     class Meta:
#         managed = True
#         db_table = 'django_migrations'


# class DjangoSession(models.Model):
#     session_key = models.CharField(primary_key=True, max_length=40)
#     session_data = models.TextField()
#     expire_date = models.DateTimeField()

#     class Meta:
#         managed = True
#         db_table = 'django_session'


class Foro(models.Model):
    # Modelo que representa la tabla 'foro'.
    id_foro = models.AutoField(primary_key=True)  # Clave primaria de la tabla.
    nombre_foro = models.CharField(max_length=45, verbose_name="Nombre del Foro")  # Nombre del foro.
    descripcion_foro = models.CharField(max_length=45, verbose_name="Descripción del Foro")  # Descripción del foro.
    respuesta_foro = models.CharField(max_length=45, verbose_name="Respuesta del Foro")  # Respuesta asociada al foro.

    class Meta:
        verbose_name = "Foro"
        verbose_name_plural = "Foros"
        managed = True
        db_table = 'foro'  # Nombre de la tabla en la base de datos.

    def __str__(self):
        return self.nombre_foro

class Modulos(models.Model):
    # Modelo que representa la tabla 'modulos'.
    id_modulo = models.AutoField(primary_key=True)  # Clave primaria de la tabla.
    nombre_modulo = models.CharField(max_length=45, verbose_name="Nombre del Módulo")  # Nombre del módulo.
    contenido_modulo = models.CharField(max_length=45, verbose_name="Contenido del Módulo")  # Contenido del módulo.
    descripcion_modulo = models.CharField(max_length=45, verbose_name="Descripción del Módulo")  # Descripción del módulo.

    class Meta:
        verbose_name = "Módulo"
        verbose_name_plural = "Módulos"
        managed = True
        db_table = 'modulos'  # Nombre de la tabla en la base de datos.

    def __str__(self):
        return self.nombre_modulo


class Quiz(models.Model):
    # Modelo que representa la tabla 'quiz'.
    id_quiz = models.AutoField(primary_key=True)  # Clave primaria de la tabla.
    nombre_quiz = models.CharField(max_length=45, verbose_name="Nombre del Quiz")  # Nombre del quiz.
    descripcion_quiz = models.CharField(max_length=45, verbose_name="Descripción del Quiz")  # Descripción del quiz.
    calificacion_quiz = models.CharField(max_length=45, verbose_name="Calificación del Quiz")  # Calificación del quiz.
    actividad_quiz = models.CharField(max_length=45, verbose_name="Actividad del Quiz")  # Actividad asociada al quiz.

    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"
        managed = True
        db_table = 'quiz'  # Nombre de la tabla en la base de datos.

    def __str__(self):
        return self.nombre_quiz

class Roles(models.Model):
    # Modelo que representa la tabla 'roles'.
    id_rol = models.AutoField(primary_key=True)  # Clave primaria de la tabla.
    nombre_rol = models.CharField(max_length=45, verbose_name="Nombre del Rol")  # Nombre del rol.

    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Roles"
        managed = True
        db_table = 'roles'  # Nombre de la tabla en la base de datos.

    def __str__(self):
        return self.nombre_rol


class Usuarios(models.Model):
    # Modelo que representa la tabla 'usuarios'.
    id_usuario = models.AutoField(primary_key=True)  # Clave primaria de la tabla.
    nombre = models.CharField(max_length=45, verbose_name="Nombre del Usuario")  # Nombre del usuario.
    apellido = models.CharField(max_length=45, verbose_name="Apellido del Usuario")  # Apellido del usuario.
    correo = models.CharField(max_length=45, verbose_name="Correo Electrónico del Usuario", unique=True)  # Correo único del usuario.
    password = models.CharField(max_length=255, verbose_name="Contraseña del Usuario")  # Contraseña del usuario.
    cedula = models.CharField(max_length=45, verbose_name="Cédula del Usuario")  # Cédula del usuario.
    roles_id_rol = models.ForeignKey(Roles, on_delete=models.CASCADE, db_column='roles_id_rol', verbose_name="Rol")  # Relación con la tabla 'roles'.

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        managed = True
        db_table = 'usuarios'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
