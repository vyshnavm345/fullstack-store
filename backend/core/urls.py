from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CartItemViewSet, OrderViewSet, ProductViewSet, RegisterView

router = DefaultRouter()
router.register(r"products", ProductViewSet)
router.register(r"cart", CartItemViewSet)
router.register(r"orders", OrderViewSet)

urlpatterns = [
    path("", include(router.urls)),
]

urlpatterns += [
    path("register/", RegisterView.as_view(), name="register"),
]
