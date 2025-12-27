from django.db import models
from menu.models import MenuItem
from restaurant_info.models import Restaurant, Table

class Order(models.Model):
  STATUS=[
    ("pending","Pending"),
    ("preparing","Preparing"),
    ("completed","Completed"),
    ("cancelled","Cancelled")
  ]
  restaurant=models.ForeignKey(Restaurant,on_delete=models.CASCADE,related_name='orders')
  table=models.ForeignKey(Table,on_delete=models.SET_NULL,null=True,blank=True)
  created_at=models.DateTimeField(auto_now_add=True)
  total=models.DecimalField(max_digits=10,decimal_places=2,default=0)
  status=models.CharField(max_length=20,choices=STATUS,default='pending')
  estimated_time=models.IntegerField(default=30)

  def __str__(self):
    if self.table:
      return f"Order of {self.table.table_no} -- {self.restaurant.name} "
    return f"Order -- {self.restaurant.name}"
  

class OrderItem(models.Model):
  item=models.ForeignKey(MenuItem,on_delete=models.CASCADE)
  order=models.ForeignKey(Order,on_delete=models.CASCADE,related_name='ordered_items')
  qty=models.PositiveIntegerField(default=1)

  def __str__(self):
    return f"{self.qty} x {self.item.name}"

