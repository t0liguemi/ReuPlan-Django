from django.shortcuts import render, get_object_or_404
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import *
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
import json

class Users(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def GetUserDetails(request,user_id):
    user = User.objects.filter(id=user_id).first()
    if user is None:
        return JsonResponse({'error':'Not found'},status=404)
    return JsonResponse({
        'username':user.username,
        'id':user.id,
        'name':user.name,
        'email':user.email,
        'premium':user.premium
    })

class CreateUser(APIView):
    serializer_class = UserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
        # Get the POST data
            name = serializer.data.get('name')
            email = serializer.data.get('email')
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            # Validate the data
            if not name or not email or not username or not password:
                return Response({'error':
                                  'Name, email, username, and password are required'}, status=status.HTTP_400_BAD_REQUEST)
            # Create the user
            try:
                user = User.objects.create(name=name, email=email, username=username, password=make_password(password))
                return Response({'success': 'User created successfully'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class CreateEvent(APIView):
    serializer_class = EventoSerializer
    def post(self, request,format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():   
            # Create an Evento instance
            evento = Evento()
            idOrganizador = serializer.data.get("organizador")
            organizador = User.objects.get(pk=idOrganizador)
            # Set attributes from request data
            evento.name = serializer.data.get("name")
            evento.lugar = serializer.data.get("lugar")
            evento.inicio = serializer.data.get("inicio")
            evento.final = serializer.data.get("final")
            evento.duracion = serializer.data.get("duracion")
            evento.descripcion = serializer.data.get("descripcion")
            evento.privacidad1 = serializer.data.get("privacidad1")
            evento.privacidad2 = serializer.data.get("privacidad2")
            evento.privacidad3 = serializer.data.get("privacidad3")
            evento.privacidad4 = serializer.data.get("privacidad4")
            evento.requisitos1 = serializer.data.get("requisitos1")
            evento.requisitos2 = serializer.data.get("requisitos2")
            evento.requisitos3 = serializer.data.get("requisitos3")
            evento.requisitos4 = serializer.data.get("requisitos4")
            evento.respondidos = serializer.data.get("respondidos")
            evento.mapsQuery = serializer.data.get("mapsQuery")
            evento.organizador = organizador
            if evento.final < evento.inicio:
                return Response({"error":"Final previo al inicio"}, status=status.HTTP_400_BAD_REQUEST)

            # Save the Evento instance to the database
            evento.save()
            # Return response
            return Response({"msg": "Evento creado satisfactoriamente", "id": evento.id}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class Events(generics.ListAPIView):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer

def GetEventDetails(request,event_id):
    event = Evento.objects.filter(id=event_id).first()
    if event is None:
        return JsonResponse({'error': 'Event not found'}, status=404)
    else:
        # Serialize the event object
        event_serialized = EventoSerializer(event).data
        # Retrieve invitations related to the event
        invitations = Invitacion.objects.filter(evento=event)
        rejections = Rechazado.objects.filter(evento=event)
        responses = Respuesta.objects.filter(evento=event)
        # Serialize each invitation and store in a dictionary
        invite_list_serialized = [InvitacionSerializer(invitation).data for invitation in invitations]
        rejections_list_serialized = [RechazadoSerializer(rejection).data for rejection in rejections]
        responses_list_serialized = [RespuestaSerializer(response).data for response in responses]
        
        # Return JSON response containing event details and invitation details
        return JsonResponse({
            'event': event_serialized,
            'invitaciones': invite_list_serialized,
            'respuestas':responses_list_serialized,
            'rechazos':rejections_list_serialized
        })

        
def EventOrgData(request,event_id):  
    evento = Evento.objects.filter(id=event_id).first()
    if evento:
        detalles_organizador = {
            "username": evento.organizador.username,
            "name": evento.organizador.name
        }
        return JsonResponse({"data": detalles_organizador}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

class Invitee(APIView):
    serializer_class = InvitacionSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            target_event = Evento.objects.filter(pk=serializer.data.get("evento")).first()
            invitee = User.objects.filter(pk=serializer.data.get("invitado")).first()
            print(target_event,invitee)
            imprescindible = serializer.data.get("imprescindible")
            # Check if the invitee already exists for the target event
            invitee_exists = Invitacion.objects.filter(invitado=invitee, evento=target_event)
            if invitee_exists:
                return JsonResponse({"msg": "El usuario ya está invitado"}, status=status.HTTP_409_CONFLICT)
            # Create a new invitation
            invitacion = Invitacion.objects.create(
                evento=target_event,
                invitado=invitee,
                imprescindible=imprescindible
            )
            return JsonResponse({"msg": "Invitación creada satisfactoriamente"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
def DeleteInvite(request, invite_id):
    invite = Invitacion.objects.filter(id=invite_id).first()
    if invite:
        invite.delete()
        return JsonResponse({"msg": "Invitación eliminada"}, status=200)       
            
    else:
        return JsonResponse({"error": "Invitación no encontrada"}, status=404)
    