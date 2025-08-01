from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Product
from .serializers import ProductSerializer, UserRegistrationSerializer, UserLoginSerializer

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de produtos.
    
    Permite operações CRUD completas: listar, criar, buscar, atualizar e deletar produtos.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @swagger_auto_schema(
        operation_description="Lista todos os produtos cadastrados",
        responses={200: ProductSerializer(many=True)}
    )
    def list(self, request):
        """Lista todos os produtos"""
        products = self.get_queryset()
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Cria um novo produto",
        request_body=ProductSerializer,
        responses={
            201: ProductSerializer,
            400: "Dados inválidos"
        }
    )
    def create(self, request):
        """Cria um novo produto"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Busca um produto específico pelo ID",
        responses={
            200: ProductSerializer,
            404: "Produto não encontrado"
        }
    )
    def retrieve(self, request, pk=None):
        """Busca um produto específico por ID"""
        product = get_object_or_404(Product, pk=pk)
        serializer = self.get_serializer(product)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Atualiza um produto específico (PUT - todos os campos)",
        request_body=ProductSerializer,
        responses={
            200: ProductSerializer,
            400: "Dados inválidos",
            404: "Produto não encontrado"
        }
    )
    def update(self, request, pk=None):
        """Atualiza um produto específico"""
        product = get_object_or_404(Product, pk=pk)
        serializer = self.get_serializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Atualiza parcialmente um produto (PATCH)",
        request_body=ProductSerializer,
        responses={
            200: ProductSerializer,
            400: "Dados inválidos",
            404: "Produto não encontrado"
        }
    )
    def partial_update(self, request, pk=None):
        """Atualiza parcialmente um produto"""
        product = get_object_or_404(Product, pk=pk)
        serializer = self.get_serializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Remove um produto",
        responses={
            204: "Produto removido com sucesso",
            404: "Produto não encontrado"
        }
    )
    def destroy(self, request, pk=None):
        """Remove um produto"""
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        operation_description="Lista apenas produtos disponíveis",
        responses={200: ProductSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Lista apenas produtos disponíveis"""
        available_products = self.get_queryset().filter(available=True)
        serializer = self.get_serializer(available_products, many=True)
        return Response(serializer.data)


# Views de Autenticação
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Registra um novo usuário
    """
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Criar token para o usuário
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'message': 'Usuário criado com sucesso',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name
                },
                'access_token': token.key
            }, status=status.HTTP_201_CREATED)
        else:
            # Retorna erros de validação do serializer
            return Response({
                'error': 'Dados inválidos',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Faz login do usuário
    """
    try:
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            # Autenticar usuário
            user = authenticate(username=username, password=password)
            
            if user is None:
                return Response(
                    {'error': 'Credenciais inválidas'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Obter ou criar token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'message': 'Login realizado com sucesso',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name
                },
                'access_token': token.key
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Dados inválidos',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt
@api_view(['POST'])
def logout(request):
    """
    Faz logout do usuário (deleta o token)
    """
    try:
        # Deletar o token do usuário
        token = Token.objects.get(user=request.user)
        token.delete()
        
        return Response(
            {'message': 'Logout realizado com sucesso'}, 
            status=status.HTTP_200_OK
        )
        
    except Token.DoesNotExist:
        return Response(
            {'error': 'Token não encontrado'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
