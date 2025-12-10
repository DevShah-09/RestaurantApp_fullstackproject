import uuid
from django.db import models

class Restaurant(models.Model):
  id=models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
  name=models.CharField(max_length=200)
  address=models.TextField(blank=True,null=True)

  def __str__(self):
    return self.name
  
class Table(models.Model):
  table_no=models.PositiveIntegerField()
  qr_code_token=models.CharField(max_length=255,unique=True)
  restaurant=models.ForeignKey(Restaurant,on_delete=models.CASCADE,related_name='tables')

  #making table_no unique apply constraints to it 
  class Meta:
    constraints=[
      models.UniqueConstraint(fields=['table_no','restaurant'],name='unique_table_no')
    ]

  def __str__(self):
    return f"Table {self.table_no} -- {self.restaurant.name}"
    


  
