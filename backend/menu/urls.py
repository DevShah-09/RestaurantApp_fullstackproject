from django.urls import path
from .views import MenuAPIView

urlpatterns = [
    path('restaurants/<uuid:restaurant_id>/menu/',MenuAPIView.as_view(),name="menu")
]
