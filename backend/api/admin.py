from django.contrib import admin
from .models import *

admin.site.register(Profile)
admin.site.register(AuthToken)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Coupon)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)