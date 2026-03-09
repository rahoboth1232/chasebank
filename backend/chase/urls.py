"""
URL configuration for chase project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views
urlpatterns = [
    path('admin/', admin.site.urls),
        # path('', views.HomePage, name='home'),

    path("api/login/", views.login_view, name="login"),
    path("dashboard/",views.dashboard, name="dashboard"),
    
    path('profile/', views.get_profile, name='get_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('legal_documents/', views.legal_documents_view, name='legal_documents_view'),
    path('saving-account/', views.saving_account_list, name='saving_account'),
     path('cash-account/', views.cash_account_list, name='cash_account'),
    path("api/transfer/", views.transfer_view, name="transfer"),
    path("activity/", views.activity_list, name="activity"),
    path("api/cds/",  views.cd_list_api , name="cd_list_api"),


]


