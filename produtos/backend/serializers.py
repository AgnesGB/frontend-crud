from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'available', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("O nome do produto não pode estar vazio.")
        return value.strip()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def validate_username(self, value):
        if not value.strip():
            raise serializers.ValidationError("Nome de usuário é obrigatório.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Nome de usuário já existe.")
        return value.strip()
    
    def validate_email(self, value):
        if not value.strip():
            raise serializers.ValidationError("Email é obrigatório.")
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email já está em uso.")
        return value.strip()
    
    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Nome é obrigatório.")
        return value.strip()
    
    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Sobrenome é obrigatório.")
        return value.strip()
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    
    def validate_username(self, value):
        if not value.strip():
            raise serializers.ValidationError("Nome de usuário é obrigatório.")
        return value.strip()
    
    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("Senha é obrigatória.")
        return value
