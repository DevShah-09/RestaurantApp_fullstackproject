from rest_framework import serializers
from menu.serializers import MenuItemSerializer
from .models import Order,OrderItem
from menu.models import MenuItem

#write_only means user can send data and this response will not appear in serialized response 
#read_only means user can only see the data 

class OrderItemSerializer(serializers.ModelSerializer):
  item=MenuItemSerializer(read_only=True)
  item_id=serializers.PrimaryKeyRelatedField(queryset=MenuItem.objects.all(),source='item',write_only=True)

  class Meta:
    model=OrderItem
    fields=['id','item','item_id','qty']


class OrderSerializer(serializers.ModelSerializer):
  ordered_items=OrderItemSerializer(many=True)

  restaurant = serializers.ReadOnlyField(source='restaurant.name')
  table_no = serializers.ReadOnlyField(source='table.table_no')

  class Meta:
    model=Order
    fields=['id', 'restaurant', 'table', 'table_no', 'created_at', 'total', 'status', 'estimated_time', 'ordered_items']

  def create(self,validated_data):
    items_data=validated_data.pop('ordered_items')
    order=Order.objects.create(**validated_data)
    total=0
    for item_data in items_data:
      item=item_data['item']
      qty=item_data['qty']
      OrderItem.objects.create(order=order,item=item,qty=qty)
      total+=item.price*qty

    order.total=total
    order.save()
    return order




    

