from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, register, login, logout

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/register/', register, name='register'),
    path('api/auth/login/', login, name='login'),
    path('api/auth/logout/', logout, name='logout'),
]
