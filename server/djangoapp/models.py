from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class CarMake(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return self.name


class CarModel(models.Model):
    CAR_TYPES = [
        ('Sedan', 'Sedan'),
        ('SUV', 'SUV'),
        ('Truck', 'Truck'),
        ('Coupe', 'Coupe'),
        ('Hatchback', 'Hatchback'),
        ('Wagon', 'Wagon'),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='car_models')
    name = models.CharField(max_length=120)
    type = models.CharField(max_length=20, choices=CAR_TYPES, default='Sedan')
    year = models.IntegerField(default=2023, validators=[MinValueValidator(2015), MaxValueValidator(2023)])
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return f'{self.car_make.name} {self.name}'
