from .models import Restaurant,Table
from rest_framework import generics
from rest_framework.response import Response
from .serializers import RestaurantSerializer
from rest_framework.views import APIView


#RetrieveAPIView- a view used to retrieve a single object by its ID

class RDetailAPIviews(generics.RetrieveAPIView):
  queryset=Restaurant.objects.all()
  serializer_class=RestaurantSerializer
  lookup_field='id'


class QRRestaurantAPIView(APIView):
    def get(self,request,token):
        try:
            table=Table.objects.get(qr_code_token=token)
            restaurant=table.restaurant

            return Response({
                "restaurant_id": str(restaurant.id),
                "restaurant_name": restaurant.name,
                "table_no": table.table_no,
                "table_id": table.id,
                "restaurant": RestaurantSerializer(restaurant).data
            })

        except Table.DoesNotExist:
            return Response({"error": "Invalid QR token"}, status=404)