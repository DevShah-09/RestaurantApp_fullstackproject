import uuid
from django.core.management.base import BaseCommand
from restaurant_info.models import Restaurant, Table


class Command(BaseCommand):
    help = 'Generate QR code tokens for restaurant tables'

    def add_arguments(self, parser):
        parser.add_argument(
            '--restaurant',
            type=str,
            help='Restaurant ID to generate tokens for (leave blank for all restaurants)',
        )
        parser.add_argument(
            '--table-count',
            type=int,
            default=5,
            help='Number of tables to create per restaurant (default: 5)',
        )

    def handle(self, *args, **options):
        restaurant_id = options.get('restaurant')
        table_count = options['table_count']

        if restaurant_id:
            try:
                restaurant = Restaurant.objects.get(id=restaurant_id)
                restaurants = [restaurant]
            except Restaurant.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Restaurant with ID {restaurant_id} not found')
                )
                return
        else:
            restaurants = Restaurant.objects.all()

        if not restaurants:
            self.stdout.write(
                self.style.WARNING('No restaurants found in the database')
            )
            return

        for restaurant in restaurants:
            self.stdout.write(f'\nGenerating tokens for: {restaurant.name}')
            
            # Get existing tables count
            existing_count = restaurant.tables.count()
            
            for i in range(1, table_count + 1):
                table_no = existing_count + i
                qr_token = str(uuid.uuid4())
                
                table, created = Table.objects.get_or_create(
                    restaurant=restaurant,
                    table_no=table_no,
                    defaults={'qr_code_token': qr_token}
                )
                
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'  ✓ Table {table_no}: {qr_token}'
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f'  ⊘ Table {table_no} already exists: {table.qr_code_token}'
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS('\n✓ QR token generation complete!')
        )
