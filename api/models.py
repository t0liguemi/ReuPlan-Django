from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError('The username field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True,default='')
    username = models.CharField(max_length=255, unique=True,default='')  # Username as identifier
    name = models.CharField(max_length=255, blank=True, default='', null=True)
    key = models.CharField(max_length=100, blank=True, null=False, default='',unique=True)  # Additional key field
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True,null=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'  # Set username as the identifier
    REQUIRED_FIELDS = ['email','key']

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',  # Change this to a unique related_name
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
    )
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    )

    def __str__(self):
        return self.username

class Evento(models.Model):
    name = models.CharField(max_length=250)
    lugar = models.CharField(max_length=250)
    inicio = models.DateField()
    final = models.DateField()
    duracion = models.IntegerField(null=True)
    descripcion = models.CharField(max_length=2000,null=True)
    privacidad1 = models.BooleanField(default=False)
    privacidad2 = models.BooleanField(default=False)
    privacidad3 = models.BooleanField(default=False)
    privacidad4 = models.BooleanField(default=False)
    requisitos1 = models.BooleanField(default=False)
    requisitos2 = models.BooleanField(default=False)
    requisitos3 = models.BooleanField(default=False)
    requisitos4 = models.BooleanField(default=False)
    respondidos = models.IntegerField(default=0,null=True)
    mapsQuery = models.BooleanField(default=False)
    organizador = models.ForeignKey(User, on_delete=models.CASCADE)
    invitados = models.ManyToManyField(User, through='Invitacion', related_name='eventos_invitado')

class Invitacion(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    invitado = models.ForeignKey(User, on_delete=models.CASCADE)
    imprescindible = models.BooleanField(default=False)

class Respuesta(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    invitado = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha = models.DateField()
    inicio = models.IntegerField()  # Assuming this represents time in military format
    final = models.IntegerField()

class Rechazado(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    invitado = models.ForeignKey(User, on_delete=models.CASCADE)
