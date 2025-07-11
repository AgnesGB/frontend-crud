from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nome")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Preço")
    available = models.BooleanField(default=True, verbose_name="Disponível")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"
        ordering = ['-created_at']

    def __str__(self):
        return self.name
