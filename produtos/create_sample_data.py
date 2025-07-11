from backend.models import Product

# Criar produtos de exemplo
products_data = [
    {"name": "Smartphone Samsung Galaxy", "price": 899.99, "available": True},
    {"name": "Notebook Dell Inspiron", "price": 1299.90, "available": True},
    {"name": "Fone Bluetooth JBL", "price": 149.50, "available": False},
    {"name": "Mouse Logitech MX", "price": 89.90, "available": True},
    {"name": "Teclado Mecânico Razer", "price": 199.99, "available": True},
]

for product_data in products_data:
    if not Product.objects.filter(name=product_data["name"]).exists():
        Product.objects.create(**product_data)
        print(f"Produto criado: {product_data['name']}")
    else:
        print(f"Produto já existe: {product_data['name']}")

print(f"Total de produtos no banco: {Product.objects.count()}")
