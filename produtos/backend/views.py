from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Product
from .serializers import ProductSerializer

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
