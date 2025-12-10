from django.db import models
from restaurant_info.models import Restaurant

class MenuItem(models.Model):
  CATEGORY=[
    ("starters", "Starters"),
    ("main_course", "Main Course"),
    ("desserts", "Desserts"),
    ("drinks", "Drinks"),
    ("specials", "Specials"),
  ]
  restaurant=models.ForeignKey(Restaurant, on_delete=models.CASCADE)
  meal_type = models.CharField(max_length=20,choices=CATEGORY)
  name=models.CharField(max_length=100)
  description=models.TextField(blank=True,null=True)
  image=models.ImageField(upload_to="menu_images/",blank=True,null=True)
  price=models.DecimalField(max_digits=10,decimal_places=2)
  is_veg=models.BooleanField(default=True)
  is_jain=models.BooleanField(default=False)
  is_chefs_special=models.BooleanField(default=False)

  class Meta:
    unique_together=('restaurant','name')

  def __str__(self):
    return self.name
