from django.db import models
from django.contrib.auth.models import User
import datetime

class Profile(models.Model):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('seller', 'Seller'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=200, null=True)
    email = models.EmailField(max_length=254, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return self.username
    
class AuthToken(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    token = models.CharField(max_length=200, null=True)
    date = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField(null=True)

    def __str__(self):
        return self.user.email + ' ' + self.token

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

from django.utils import timezone

class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True)  # Código do cupom (ex: "BLACKFRIDAY")
    discount_type = models.CharField(max_length=10, choices=[('fixed', 'Valor Fixo'), ('percent', 'Porcentagem')])
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)  # Ex: 20.00 ou 10% dependendo do tipo
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    usage_limit = models.PositiveIntegerField(null=True, blank=True)  # Número máximo de usos
    used_count = models.PositiveIntegerField(default=0)

    def is_valid(self):
        now = timezone.now()
        return self.valid_from <= now <= self.valid_to and (self.usage_limit is None or self.used_count < self.usage_limit)

    def __str__(self):
        return f"{self.code} - {self.discount_value}{'%' if self.discount_type == 'percent' else 'R$'}"

class Cart(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def get_total_price(self):
        return self.product.price * self.quantity

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('processing', 'Processando'),
        ('shipped', 'Enviado'),
        ('delivered', 'Entregue'),
        ('canceled', 'Cancelado'),
    ]

    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)

    def apply_coupon(self):
        if self.coupon and self.coupon.is_valid():
            if self.coupon.discount_type == 'fixed':
                self.total_price -= self.coupon.discount_value
            elif self.coupon.discount_type == 'percent':
                self.total_price *= (1 - (self.coupon.discount_value / 100))

            self.total_price = max(0, self.total_price)
            self.coupon.used_count += 1
            self.coupon.save()

    def __str__(self):
        return f'Pedido {self.id} - {self.user.username}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def get_total_price(self):
        return self.price * self.quantity

class Review(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.name} - {self.rating}⭐"

    class Meta:
        unique_together = ('user', 'product')