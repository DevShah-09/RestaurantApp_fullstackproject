from django.urls import path 
from .views import PlaceOrderAPIView

urlpatterns = [
    path('restaurants/<uuid:restaurant_id>/orders/',PlaceOrderAPIView.as_view(),name='place_order')
]
