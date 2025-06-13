from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from Backend.modelos import models, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password

class BibliotecaViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo Biblioteca.
    - Permite listar, crear, actualizar y eliminar registros de la tabla Biblioteca.
    - Incluye paginación y filtros por el campo 'nombre_biblioteca'.
    """
    queryset = models.Biblioteca.objects.all()
    serializer_class = serializers.BibliotecaSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nombre_biblioteca']

class CategoriaViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo Categoria.
    - Permite gestionar categorías relacionadas con cursos y foros.
    - Incluye paginación y filtros por el campo 'tipo_categoria'.
    """
    queryset = models.Categoria.objects.all()
    serializer_class = serializers.CategoriaSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo_categoria']

class CursoViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo Curso.
    - Permite gestionar información de los cursos.
    - Incluye paginación y filtros por el campo 'nombre_curso'.
    - Permite obtener cursos por profesor mediante la acción 'profesor'.
    """
    queryset = models.Cursos.objects.all()
    serializer_class = serializers.CursosSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nombre_curso']

    @action(detail=False, methods=['get'], url_path='profesor/(?P<profesor_id>[^/.]+)')
    def profesor(self, request, profesor_id=None):
        """
        Obtiene todos los cursos de un profesor específico.
        """
        try:
            cursos = self.queryset.filter(profesor_id=profesor_id)
            page = self.paginate_queryset(cursos)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(cursos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Error al obtener los cursos del profesor: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class DetalleContenidoViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo DetalleContenido.
    - Relaciona módulos con la biblioteca.
    - Incluye paginación y filtros por los campos 'biblioteca' y 'modulo'.
    """
    queryset = models.DetalleContenido.objects.all()
    serializer_class = serializers.DetalleContenidoSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['biblioteca', 'modulo']

class DetalleCursoViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo DetalleCurso.
    - Relaciona usuarios, cursos, módulos y cuestionarios.
    - Incluye paginación y filtros por los campos 'quiz', 'usuario', 'modulo' y 'curso'.
    """
    queryset = models.DetalleCurso.objects.all()
    serializer_class = serializers.DetalleCursoSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['quiz', 'usuario', 'modulo', 'curso']

class ForoViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo Foro.
    - Permite gestionar información de los foros.
    - Incluye paginación y filtros por el campo 'nombre_foro'.
    """
    queryset = models.Foro.objects.all()
    serializer_class = serializers.ForoSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nombre_foro']

class ModulosViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo Modulos.
    - Permite gestionar información de los módulos.
    - Incluye paginación y filtros por el campo 'nombre_modulo'.
    """
    queryset = models.Modulos.objects.all()
    serializer_class = serializers.ModulosSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nombre_modulo']

class QuizViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo Quiz.
    - Permite gestionar información de los cuestionarios.
    - Incluye paginación y filtros por el campo 'nombre_quiz'.
    """
    queryset = models.Quiz.objects.all()
    serializer_class = serializers.QuizSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nombre_quiz']

class RolesViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo Roles.
    - Permite gestionar información de los roles de usuario.
    - Incluye paginación y filtros por el campo 'nombre_rol'.
    """
    queryset = models.Roles.objects.all()
    serializer_class = serializers.RolesSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nombre_rol']

class UsuarioViewSet(ModelViewSet):
    """
    ViewSet para manejar operaciones CRUD en el modelo Usuario.
    - Permite gestionar información de los usuarios, incluyendo validaciones personalizadas.
    - Incluye paginación y filtros por los campos 'nombre' y 'correo'.
    """
    queryset = models.Usuarios.objects.all()
    serializer_class = serializers.UsuariosSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nombre', 'correo']

    @action(detail=False, methods=['post'])
    def login(self, request):
        correo = request.data.get('correo')
        password = request.data.get('password')

        if not correo or not password:
            return Response({'error': 'Correo y contraseña son requeridos.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = models.Usuarios.objects.get(correo=correo)
        except models.Usuarios.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar la contraseña usando el hasher de Django
        if check_password(password, usuario.password):
            # La contraseña es correcta, serializar y devolver los datos del usuario
            # Asegúrate de que el serializador no devuelva el hash de la contraseña
            serializer = self.get_serializer(usuario)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Contraseña incorrecta
            return Response({'error': 'Credenciales incorrectas.'}, status=status.HTTP_401_UNAUTHORIZED)

    # El método create (POST a /api/v1/usuarios/) se usa para el registro
    def create(self, request, *args, **kwargs):
        # La lógica de creación (registro) ya está manejada por ModelViewSet y el serializador
        # que hashea la contraseña al guardar.
        return super().create(request, *args, **kwargs)