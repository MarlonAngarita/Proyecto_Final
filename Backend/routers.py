from rest_framework.routers import DefaultRouter
from Backend.views import (
    BibliotecaViewSet, CategoriaViewSet, CursoViewSet, DetalleContenidoViewSet,
    DetalleCursoViewSet, ForoViewSet, ModulosViewSet, QuizViewSet, RolesViewSet, UsuarioViewSet
)

router = DefaultRouter()
# Se añade el prefijo 'v1/' para implementar el versionamiento en las rutas.
router.register(r'v1/biblioteca', BibliotecaViewSet, basename='biblioteca')
router.register(r'v1/categorias', CategoriaViewSet, basename='categorias')
router.register(r'v1/cursos', CursoViewSet, basename='cursos')
router.register(r'v1/detallecontenido', DetalleContenidoViewSet, basename='detallecontenido')
router.register(r'v1/detallecurso', DetalleCursoViewSet, basename='detallecurso')
router.register(r'v1/foro', ForoViewSet, basename='foro')
router.register(r'v1/modulos', ModulosViewSet, basename='modulos')
router.register(r'v1/quiz', QuizViewSet, basename='quiz')
# router.register(r'v1/roles', RolesViewSet, basename='roles')
router.register(r'v1/usuarios', UsuarioViewSet, basename='usuarios')

urlpatterns = router.urls
