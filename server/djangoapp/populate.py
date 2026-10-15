from djangoapp.models import CarMake, CarModel


def seed_default_data():
    makes = {
        'NISSAN': ['Pathfinder', 'Qashqai', 'XTRAIL'],
        'Mercedes': ['A-Class', 'C-Class', 'E-Class'],
        'Audi': ['A4', 'A5', 'A6'],
        'Kia': ['Sorrento', 'Carnival', 'Cerato'],
        'Toyota': ['Corolla', 'Camry', 'Kluger'],
    }
    for make_name, model_names in makes.items():
        make, _ = CarMake.objects.get_or_create(
            name=make_name,
            defaults={'description': f'{make_name} vehicles'},
        )
        for name in model_names:
            CarModel.objects.get_or_create(
                car_make=make,
                name=name,
                defaults={
                    'type': 'Sedan' if name in {'Cerato', 'Corolla', 'Camry'} else 'SUV',
                    'year': 2023,
                    'description': f'{make_name} {name}',
                },
            )


def initiate():
    seed_default_data()
