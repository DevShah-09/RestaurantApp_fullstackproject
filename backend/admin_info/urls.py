from django.urls import path
from .views import AdminMenuUploadAPIView,AdminOrderAPIView,AdminUpdateOrderStatusAPIView,MenuItemAddAPIView,StaffLoginAPIView,AdminTableAPIView

urlpatterns = [
    path('auth/login/',StaffLoginAPIView.as_view(),name='login_view'),
    path('orders/',AdminOrderAPIView.as_view(),name='view_order'),
    path('tables/',AdminTableAPIView.as_view(),name='view_tables'),
    path('menu/',MenuItemAddAPIView.as_view(),name='add_item_view'),
    path('orders/<int:order_id>/',AdminUpdateOrderStatusAPIView.as_view(),name='status_update_view'),
    path('menu/csv-upload/',AdminMenuUploadAPIView.as_view(),name='csv_view')
]
