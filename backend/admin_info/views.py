from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from order_info.models import Order
from order_info.serializers import OrderSerializer
from rest_framework.response import Response
from menu.serializers import MenuItemSerializer
from menu.models import MenuItem
from .serializers import StaffSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import csv,io

class StaffLoginAPIView(APIView):
  def post(self,request):
    serializer = StaffSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user=authenticate(**serializer.validated_data)
    if not user:
      return Response("Invalid Credentials!",status=401)
    tokens=RefreshToken.for_user(user)
    return Response({
      'refresh':str(tokens),
      'access':str(tokens.access_token)
      })

class AdminOrderAPIView(APIView):
  permission_classes=[IsAuthenticated]

  def get(self,request):
    staff=request.user.staff
    order=Order.objects.filter(restaurant=staff.restaurant)
    serializer=OrderSerializer(order,many=True)
    return Response(serializer.data)
  
class AdminUpdateOrderStatusAPIView(APIView):
  permission_classes=[IsAuthenticated]

  def put(self,request,order_id):
    staff=request.user.staff
    try:
      #here .get() method takes parameters which are filters coz here its a model query not a dict
      order=Order.objects.get(id=order_id,restaurant=staff.restaurant)
    except Order.DoesNotExist:
      return Response("Order not Found!!!",status=404)
    #.get(key,default_value) here request.data will be a dictionary obj
    order.status=request.data.get('status',order.status)
    order.save()
    return Response("Order Updated!")
  
class MenuItemAddAPIView(APIView):
  permission_classes=[IsAuthenticated]

  def post(self,request):
    item=request.data
    #note serializer=MenuItemSerializer(item) this works only when an instance of item aleady exists
    #here we are deserializing the request.data
    serializer=MenuItemSerializer(data=item)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
  
class AdminMenuUploadAPIView(APIView):
  permission_classes=[IsAuthenticated]

  def post(self,request):
    csv_file=request.FILES['file']
    decoded_file=csv_file.read().decode('utf-8')
    io_string=io.StringIO(decoded_file)
    reader=csv.DictReader(io_string)
    for row in reader:
            MenuItem.objects.create(
                restaurant_id=row['restaurant'],
                meal_type=row['meal_type'],
                name=row['name'],
                description=row.get('description', ''),
                price=row['price'],
                is_veg=row.get('is_veg', 'True') == 'True',
                is_jain=row.get('is_jain', 'False') == 'True',
                is_chefs_special=row.get('is_chefs_special', 'False') == 'True'
            )
    return Response("CSV uploaded successfully!!!")





