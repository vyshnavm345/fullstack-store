
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .permissions import IsAdminOrReadOnly
from .models import CartItem, Order, Product, OrderItem
from .serializers import (
    CartItemSerializer,
    OrderSerializer,
    OrderUpdateSerializer,
    ProductSerializer,
    RegisterSerializer,
    OrderStatusUpdateSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="Create a new user account.",
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response(
                description="User created",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "username": openapi.Schema(type=openapi.TYPE_STRING),
                        "email": openapi.Schema(type=openapi.TYPE_STRING),
                    }
                ),
            ),
        },
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    @swagger_auto_schema(
        operation_description="Partially update a product",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING, description="Product name", maxLength=100),
                'description': openapi.Schema(type=openapi.TYPE_STRING, description="Product description", nullable=True),
                'price': openapi.Schema(type=openapi.TYPE_STRING, description="Price as a decimal string"),
                'stock': openapi.Schema(type=openapi.TYPE_INTEGER, description="Stock quantity")
            },
            required=[]
        )
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)



class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return CartItem.objects.none()
        return CartItem.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))

        if not product_id:
            return Response({"detail": "Product ID is required"}, status=400)

        # Check if the product already exists in the user's cart
        existing_item = CartItem.objects.filter(user=user, product_id=product_id).first()

        if existing_item:
            # Update quantity and return updated item
            existing_item.quantity += quantity
            existing_item.save()
            serializer = self.get_serializer(existing_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Create new item
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


# class CartItemViewSet(viewsets.ModelViewSet):
#     queryset = CartItem.objects.all()
#     serializer_class = CartItemSerializer


#     def get_queryset(self):
#         if getattr(self, 'swagger_fake_view', False):
#             return CartItem.objects.none()
#         return CartItem.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Order.objects.all()

    @swagger_auto_schema(
        operation_description="Place a new order using current cart items.",
        request_body=None,  # no request body expected
        responses={
            201: openapi.Response(
                description="Order created successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "message": openapi.Schema(type=openapi.TYPE_STRING),
                        "order_id": openapi.Schema(type=openapi.TYPE_INTEGER),
                    }
                )
            ),
            400: "Cart is empty"
        }
    )
    def create(self, request, *args, **kwargs):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)

        if not cart_items.exists():
            return Response({"detail": "Cart is empty."}, status=400)

        # Check stock
        for item in cart_items:
            if item.quantity > item.product.stock:
                return Response(
                    {"detail": f"Not enough stock for {item.product.name}."},
                    status=400
                )

        # Calculate total
        total = sum(item.product.price * item.quantity for item in cart_items)

        # Create Order
        order = Order.objects.create(user=user, total_amount=total)

        # Create OrderItems and deduct stock
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price_at_order=item.product.price
            )
            item.product.stock -= item.quantity
            item.product.save()

        # Clear cart
        cart_items.delete()

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id
        }, status=201)


    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Order.objects.none()
        return Order.objects.filter(user=self.request.user)
    

    def get_serializer_class(self):
        if self.action == "partial_update":
            return OrderStatusUpdateSerializer
        elif self.action == "update":
            return OrderUpdateSerializer
        return OrderSerializer

    @swagger_auto_schema(
        operation_description="Update order status only",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['PENDING', 'COMPLETED', 'CANCELLED'],
                    description='Order status'
                )
            }
        ),
        responses={200: OrderSerializer}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Update the entire order. Typically not used since most fields are read-only.",
        request_body=OrderUpdateSerializer,  # <- fix here
        responses={200: OrderSerializer}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
