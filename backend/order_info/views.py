from rest_framework import generics
from .serializers import OrderSerializer
from .models import Order

class PlaceOrderAPIView(generics.CreateAPIView):
  serializer_class=OrderSerializer

  def perform_create(self, serializer):
    restaurant_id=self.kwargs['restaurant_id']
    serializer.save(restaurant_id=restaurant_id)

class OrderDetailAPIView(generics.RetrieveAPIView):
  queryset=Order.objects.all()
  serializer_class=OrderSerializer