from django.db import models
from django.contrib.auth.models import User
from restaurant_info.models import Restaurant

class Staff(models.Model):
  ROLES=(
    ("owner","Owner"),
    ("staff","Staff")
  )
  user=models.OneToOneField(User,on_delete=models.CASCADE)
  restaurant=models.ForeignKey(Restaurant,on_delete=models.CASCADE,null=True,blank=True)
  role = models.CharField(max_length=10,choices=ROLES,default="staff")

  def __str__(self):
    return f"{self.user.username} who is a {self.role} is currently using the system."