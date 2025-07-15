from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import CartItem, Order, Product, User, OrderItem

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "password2"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        return User.objects.create_user(**validated_data)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True
    )
    product_obj = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_obj", "quantity"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["product"] = data.pop("product_obj")
        return data


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']

class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price_at_order"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = ["id", "user", "items", "total_amount", "status", "created_at"]
        read_only_fields = ["user", "items", "total_amount", "status", "created_at"]

# class OrderSerializer(serializers.ModelSerializer):
#     items = CartItemSerializer(many=True, read_only=True)
#     user = serializers.StringRelatedField(read_only=True)

#     class Meta:
#         model = Order
#         fields = ["id", "user", "items", "total_amount", "status", "created_at"]
#         read_only_fields = ["user", "items", "total_amount", "status", "created_at"]
