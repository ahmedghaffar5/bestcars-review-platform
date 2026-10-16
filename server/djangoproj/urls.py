from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from django.views.decorators.cache import never_cache

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),
    path('about/', never_cache(TemplateView.as_view(template_name='About.html'))),
    path('contact/', never_cache(TemplateView.as_view(template_name='Contact.html'))),
    path('dealers/', never_cache(TemplateView.as_view(template_name='index.html'))),
    path('login/', never_cache(TemplateView.as_view(template_name='index.html'))),
    path('register/', never_cache(TemplateView.as_view(template_name='index.html'))),
    path('dealer/<int:dealer_id>/', never_cache(TemplateView.as_view(template_name='index.html'))),
    path('postreview/<int:dealer_id>/', never_cache(TemplateView.as_view(template_name='index.html'))),
    path('', never_cache(TemplateView.as_view(template_name='Home.html'))),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
