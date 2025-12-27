from django.urls import path 
from .views import PlaceOrderAPIView, OrderDetailAPIView

urlpatterns = [
    path('restaurants/<uuid:restaurant_id>/orders/',PlaceOrderAPIView.as_view(),name='place_order'),
    path('orders/<int:pk>/',OrderDetailAPIView.as_view(),name='order_detail')
]
