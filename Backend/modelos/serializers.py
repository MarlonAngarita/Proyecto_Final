from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from Backend.modelos import models

class BibliotecaSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Biblioteca.
    Este serializador convierte instancias del modelo Biblioteca a representaciones JSON y viceversa.
    """
    class Meta:
        model = models.Biblioteca
        fields = ['id_biblioteca', 'nombre_biblioteca', 'contenido_biblioteca', 'descripcion_biblioteca']

class CategoriaSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Categoría.
    Permite la conversión de datos relacionados con categorías a formato JSON.
    """
    class Meta:
        model = models.Categoria
        fields = ['id_categoria', 'tipo_categoria', 'curso', 'foro']

class CursosSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Cursos.
    Facilita la serialización y deserialización de datos de cursos.
    """
    class Meta:
        model = models.Cursos
        fields = ['id_curso', 'nombre_curso', 'descripcion_curso', 'contenido_curso']

class DetalleContenidoSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo DetalleContenido.
    Maneja la representación de los detalles de contenido en formato JSON.
    """
    class Meta:
        model = models.DetalleContenido
        fields = ['id_detalle_contenido', 'biblioteca', 'modulo']

class DetalleCursoSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo DetalleCurso.
    Convierte los datos de detalles de curso a formato JSON y viceversa.
    """
    class Meta:
        model = models.DetalleCurso
        fields = ['id_detalle_curso', 'quiz', 'usuario', 'modulo', 'curso']

class ForoSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Foro.
    Proporciona una representación JSON de los datos del foro.
    """
    class Meta:
        model = models.Foro
        fields = ['id_foro', 'nombre_foro', 'descripcion_foro', 'respuesta_foro']

class ModulosSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Modulos.
    Permite la serialización de datos relacionados con módulos.
    """
    class Meta:
        model = models.Modulos
        fields = ['id_modulo', 'nombre_modulo', 'contenido_modulo', 'descripcion_modulo']

class QuizSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Quiz.
    Maneja la conversión de datos de cuestionarios a formato JSON.
    """
    class Meta:
        model = models.Quiz
        fields = '__all__'  # Incluye todos los campos del modelo.

class RolesSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Roles.
    Convierte los datos de roles a formato JSON y viceversa.
    """
    class Meta:
        model = models.Roles
        fields = '__all__'  # Incluye todos los campos del modelo.

class UsuariosSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Usuarios.
    Incluye validaciones personalizadas y manejo de contraseñas seguras.
    """
    class Meta:
        model = models.Usuarios
        # CORREGIDO: Se usan los nombres de campo que se asume existen en el modelo,
        # eliminando los sufijos '_usuario' si el modelo no los usa,
        # y usando 'rol' para la ForeignKey.
        fields = ['id_usuario', 'nombre', 'apellido', 'correo', 'cedula', 'password', 'roles_id_rol']
        extra_kwargs = {
            'password': {'write_only': True}  # Es una buena práctica no exponer el hash de la contraseña al leer.
        }

    def validate_email(self, value):
        """
        Validar que el correo electrónico tenga un formato válido.
        """
        if not serializers.EmailField().run_validation(value):
            raise serializers.ValidationError("El correo electrónico no es válido.")
        return value

    def create(self, validated_data):
        """
        Sobrescribir el método create para manejar el hash de contraseñas.
        """
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Sobrescribir el método update para manejar el hash de contraseñas.
        """
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)