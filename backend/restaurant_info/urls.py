from django.urls import path
from .views import RDetailAPIviews,QRRestaurantAPIView

urlpatterns = [
    path('restaurants/<uuid:id>',RDetailAPIviews.as_view(),name='restaurant-details'),
    path('restaurants/by-qr/<str:token>/', QRRestaurantAPIView.as_view(), name='restaurant-by-qr')
]
