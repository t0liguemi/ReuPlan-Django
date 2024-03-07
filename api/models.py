from django.db import models

class User(models.Model):
    name = models.CharField(max_length=250)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)
    premium = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

class Evento(models.Model):
    name = models.CharField(max_length=250)
    lugar = models.CharField(max_length=250)
    inicio = models.DateTimeField()
    final = models.DateTimeField()
    duracion = models.IntegerField(null=True)
    descripcion = models.CharField(max_length=250)
    privacidad1 = models.BooleanField(default=False)
    privacidad2 = models.BooleanField(default=False)
    privacidad3 = models.BooleanField(default=False)
    privacidad4 = models.BooleanField(default=False)
    requisitos1 = models.BooleanField(default=False)
    requisitos2 = models.BooleanField(default=False)
    requisitos3 = models.BooleanField(default=False)
    requisitos4 = models.BooleanField(default=False)
    respondidos = models.IntegerField(default=0)
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
