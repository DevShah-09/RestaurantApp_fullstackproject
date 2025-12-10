from django.contrib import admin
from django.urls import path, include
from .views import home

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/',include('restaurant_info.urls')),
    path('api/',include('menu.urls')),
    path('api/',include('order_info.urls')),
    path('admin-api/',include('admin_info.urls'))
]