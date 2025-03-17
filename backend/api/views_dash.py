from .imports import *

@api_view(['GET'])
def get_categories_and_products(request):
    categories = Category.objects.all()
    categories_data = []

    for category in categories:
        products = Product.objects.filter(category=category)
        products_data = []

        for product in products:
            products_data.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'image': request.build_absolute_uri(product.image.url) if product.image else None,
            })

        categories_data.append({
            'id': category.id,
            'name': category.name,
            'products': products_data,
        })

    return Response(categories_data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'status': 'error', 'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'stock': product.stock,
        'image': request.build_absolute_uri(product.image.url) if product.image else None,
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_to_cart(request):
    token_str = request.data.get('token')
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity')

    if token_str is None or product_id is None or quantity is None:
        return Response({'status': 'error', 'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = AuthToken.objects.get(token=token_str)
    except AuthToken.DoesNotExist:
        return Response({'status': 'error', 'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'status': 'error', 'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if product.stock < quantity:
        return Response({'status': 'error', 'message': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

    cart = Cart.objects.get_or_create(user=token.user)[0]
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    cart_item.quantity += quantity
    cart_item.save()

    return Response({'status': 'success', 'message': 'Product added to cart'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def cart_products(request):
    token_str = request.query_params.get('token')

    if token_str is None:
        return Response({'status': 'error', 'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = AuthToken.objects.get(token=token_str)
    except AuthToken.DoesNotExist:
        return Response({'status': 'error', 'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    cart = Cart.objects.get_or_create(user=token.user)[0]
    cart_items = CartItem.objects.filter(cart=cart)

    cart_data = []

    for cart_item in cart_items:
        cart_data.append({
            'product_id': cart_item.product.id,
            'name': cart_item.product.name,
            'price': cart_item.product.price,
            'quantity': cart_item.quantity,
            'total_price': cart_item.get_total_price(),
        })

    return Response(cart_data, status=status.HTTP_200_OK)

@api_view(['POST'])
def remove_from_cart(request):
    token_str = request.data.get('token')
    product_id = request.data.get('product_id')

    if token_str is None or product_id is None:
        return Response({'status': 'error', 'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = AuthToken.objects.get(token=token_str)
    except AuthToken.DoesNotExist:
        return Response({'status': 'error', 'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'status': 'error', 'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    cart = Cart.objects.get_or_create(user=token.user)[0]
    cart_item = CartItem.objects.filter(cart=cart, product=product).first()

    if cart_item is not None:
        cart_item.delete()

    return Response({'status': 'success', 'message': 'Product removed from cart'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_order(request):
    token_str = request.data.get('token')
    coupon_code = request.data.get('coupon_code')

    if token_str is None:
        return Response({'status': 'error', 'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = AuthToken.objects.get(token=token_str)
    except AuthToken.DoesNotExist:
        return Response({'status': 'error', 'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    cart = Cart.objects.get_or_create(user=token.user)[0]
    cart_items = CartItem.objects.filter(cart=cart)

    if len(cart_items) == 0:
        return Response({'status': 'error', 'message': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    total_price = 0

    for cart_item in cart_items:
        total_price += cart_item.get_total_price()

    order = Order.objects.create(
        user=token.user,
        total_price=total_price,
    )

    if coupon_code is not None:
        try:
            coupon = Coupon.objects.get(code=coupon_code)
        except Coupon.DoesNotExist:
            return Response({'status': 'error', 'message': 'Invalid coupon'}, status=status.HTTP_400_BAD_REQUEST)

        order.coupon = coupon
        order.apply_coupon()

    order.save()

    for cart_item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            quantity=cart_item.quantity,
            price=cart_item.product.price,
        )

        cart_item.delete()

    return Response({'status': 'success', 'message': 'Order created successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def remove_order(request):
    order_id = request.data.get('order_id')

    if order_id is None:
        return Response({'status': 'error', 'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'status': 'error', 'message': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    if order.status != 'pending':
        return Response({'status': 'error', 'message': 'Order cannot be removed'}, status=status.HTTP_400_BAD_REQUEST)

    order.delete()

    return Response({'status': 'success', 'message': 'Order removed successfully'}, status=status.HTTP_200_OK)