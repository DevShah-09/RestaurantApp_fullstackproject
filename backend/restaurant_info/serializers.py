from .models import Restaurant,Table
from rest_framework import serializers

class TableSerializer(serializers.ModelSerializer):
  class Meta:
    model=Table
    fields='__all__'

class RestaurantSerializer(serializers.ModelSerializer):
  # nested serialization 
  tables=TableSerializer(many=True,read_only=True)
  
  class Meta:
    model=Restaurant
    fields='__all__'
