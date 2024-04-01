from rest_framework import serializers
from .models import *

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        
        fields = ['id', 'username', 'email', 'name', 'key','password']

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = ['id',
                'name',
                'lugar',
                'inicio',
                'final',
                'duracion',
                'descripcion',
                'privacidad1',
                'privacidad2',
                'privacidad3',
                'privacidad4',
                'requisitos1',
                'requisitos2', 
                'requisitos3', 
                'requisitos4', 
                'respondidos', 
                'mapsQuery',
                'organizador']

class InvitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitacion
        fields = ['id', 'evento', 'invitado', 'imprescindible']

class RespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ['id', 'evento', 'invitado', 'fecha', 'inicio', 'final']

class RechazadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rechazado
        fields = ['id', 'evento', 'invitado']