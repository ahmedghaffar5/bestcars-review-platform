from django.contrib import admin

from .models import CarMake, CarModel


class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1


@admin.register(CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]
    list_display = ('name', 'description')


@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('car_make', 'name', 'type', 'year')
    list_filter = ('car_make', 'type', 'year')
