from django.urls import path
from .views import *
from .views_dash import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('check-token/', check_token, name='check_token'),

    path('categories-and-products/', get_categories_and_products, name='categories_and_products'),
    path('product/<int:product_id>/', get_product, name='product'),

    path('add-to-cart/', add_to_cart, name='add_to_cart'),
    path('remove-from-cart/', remove_from_cart, name='remove_from_cart'),
    path('cart/', cart_products, name='cart_products'),
    path('create-order/', create_order, name='create_order'),

]
