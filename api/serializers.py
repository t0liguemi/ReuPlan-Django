from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password','username', 'premium']

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = ['id', 'name', 'lugar', 'inicio', 'final', 'duracion', 'descripcion', 'privacidad1', 'privacidad2', 'privacidad3', 'privacidad4', 'requisitos1', 'requisitos2', 'requisitos3', 'requisitos4', 'respondidos', 'mapsQuery','organizador']

class InvitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitacion
        fields = ['id', 'evento', 'invitado', 'imprescindible']

class RespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ['id', 'idEvento', 'idInvitado', 'fecha', 'inicio', 'final']

class RechazadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rechazado
        fields = ['id', 'idEvento', 'idInvitado']