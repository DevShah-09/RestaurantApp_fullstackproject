from rest_framework import generics
from .serializers import MenuItemSerializer
from .models import MenuItem

class MenuAPIView(generics.ListAPIView):
  serializer_class=MenuItemSerializer
  def get_queryset(self):
    restaurant_id=self.kwargs['restaurant_id']
    return MenuItem.objects.filter(restaurant_id=restaurant_id)


