from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from order_info.models import Order
from order_info.serializers import OrderSerializer
from rest_framework.response import Response
from menu.serializers import MenuItemSerializer
from menu.models import MenuItem
from restaurant_info.models import Table
from restaurant_info.serializers import TableSerializer
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
    try:
      staff=request.user.staff
      print(f"Admin User: {request.user.username}, Staff Restaurant: {staff.restaurant}")
      order=Order.objects.filter(restaurant=staff.restaurant).order_by('-created_at')
      print(f"Found {order.count()} orders for this restaurant")
      serializer=OrderSerializer(order,many=True)
      return Response(serializer.data)
    except Exception as e:
      print(f"Error in AdminOrderAPIView: {e}")
      return Response({"error": str(e)}, status=500)
  
class AdminUpdateOrderStatusAPIView(APIView):
  permission_classes=[IsAuthenticated]

  def put(self,request,order_id):
    staff=request.user.staff
    try:
      order=Order.objects.get(id=order_id,restaurant=staff.restaurant)
    except Order.DoesNotExist:
      return Response("Order not Found!!!",status=404)
    
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

class AdminTableAPIView(APIView):
  permission_classes=[IsAuthenticated]

  def get(self,request):
    try:
      staff=request.user.staff
      tables=Table.objects.filter(restaurant=staff.restaurant).order_by('table_no')
      serializer=TableSerializer(tables,many=True)
      return Response({
          "restaurant_name": staff.restaurant.name,
          "tables": serializer.data
      })
    except Exception as e:
      return Response({"error": str(e)}, status=500)

  def post(self,request):
    try:
      staff=request.user.staff
      table_no=request.data.get('table_no')
      if not table_no:
        return Response({"error": "Table number is required"}, status=400)
      
      # Check if table already exists for this restaurant
      if Table.objects.filter(restaurant=staff.restaurant, table_no=table_no).exists():
        return Response({"error": f"Table {table_no} already exists"}, status=400)

      table = Table.objects.create(
        restaurant=staff.restaurant,
        table_no=table_no
      )
      serializer = TableSerializer(table)
      return Response(serializer.data, status=201)
    except Exception as e:
      return Response({"error": str(e)}, status=500)





