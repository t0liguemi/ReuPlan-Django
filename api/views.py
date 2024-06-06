import json
import os
from .models import *
from .serializers import *
from .utils import *
from django.shortcuts import render, get_object_or_404
from django.core.mail import send_mail
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.http import JsonResponse,HttpResponseForbidden
from django.middleware.csrf import CsrfViewMiddleware, get_token
from django.contrib.auth import authenticate,login, get_user_model, logout
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import authentication_classes,permission_classes,api_view,throttle_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.throttling import AnonRateThrottle,UserRateThrottle
from dotenv import load_dotenv
from ReuPlan_Django.settings import EMAIL_HOST_USER
import datetime

load_dotenv()

@ensure_csrf_cookie
def get_csrf_token(request):
    csrf_token = get_token(request)
    response = JsonResponse({'csrfToken': csrf_token})
    response.set_cookie('csrftoken', csrf_token, domain='127.0.0.1', path='/', secure=True, httponly=True, samesite='None')
    return response

def ApiConnected(request):
    return JsonResponse({'msg':'Reuplan está en linea!'})

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
@api_view(['GET'])
def GetUserDetails(request):
    user_id = request.user
    user = User.objects.filter(username=request.user).first()
    if user is None:
        return JsonResponse({'error':'Not found'},status=404)
    return JsonResponse({
        'username':user.username,
        'id':user.id,
        'name':user.name,
        'email':user.email,
    })

"""""
class LoginView(APIView):
    throttle_classes=[AnonRateThrottle]
    permission_classes=[AllowAny]
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def post(self, request):
        user = get_object_or_404(User,username=request.data['username'])
        if not user.check_password(request.data['password']):
            return Response({'error':'Invalid Credentials'},status=status.HTTP_404_NOT_FOUND)
        token,_ = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        return Response({'token':token.key,'user':serializer.data['username'],'user_id':user.pk},status=status.HTTP_200_OK)
"""    
        
@throttle_classes([AnonRateThrottle])
@api_view(["POST"])
@permission_classes([])
@csrf_protect
def Login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username,password=password)
    if user and user.is_active:
        login(request,user)
        token,_ = Token.objects.get_or_create(user=user)
        return JsonResponse({'token':token.key,'user':user.username,'user_id':user.pk},status=200)
    else:
        return JsonResponse({'error':'Invalid Credentials'},status=404)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated]) 
class LogoutView(APIView):
    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def delete(self, request):
        user=User.objects.filter(username=request.data.get('username')).first()
        # Get the user's token
        token = Token.objects.get(user=user)
        # Delete the token
        token.delete()
        logout(request)
        return Response({'success': 'Logged out successfully'}, status=status.HTTP_200_OK)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
@api_view(['GET'])
def GetSession(request):
    return JsonResponse({'isAuthenticated':True},status=status.HTTP_200_OK)        

class RegisterView(APIView):
    permission_classes=[AllowAny]
    throttle_classes=[AnonRateThrottle]
    serializer_class=UserSerializer
    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user_model = get_user_model()
            user = user_model.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password'],
                name=serializer.validated_data.get('name',None)
                  # Optional if you have username field
            )
            activation_key = generate_random_string(16)
            key = SignupKey.objects.create(key=activation_key,user=user)
            if not key:
                return Response({'error':'Something went wrong'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            link = "https://reuplan.lol/#/activate/"+activation_key
            subject="Bienvenidx a ReuPlan"
            message="Hola "+serializer.validated_data.get('username')+" !\n"+"Tu cuenta de ReuPlan ha sido creada con éxito, para activarla haz click en el siguiente enlace :\n"+link+"\n\n"+"Esperamos que reuplan te sea útil!"
            email=serializer.validated_data['email']
            recipient_list = [email]
            send_mail(subject,message,EMAIL_HOST_USER,recipient_list,fail_silently=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated]) 
class EditProfile(APIView):
    throttle_classes=[UserRateThrottle]
    def patch(self, request):
        user = User.objects.filter(pk=request.data.get('userID')).first()
        if user:
            # Update the user's password and name if provided in the request
            new_password=request.data.get('password')
            new_name=request.data.get('name')
            if new_password:
                user.set_password(new_password)
            user.name = new_name
            user.save()
            return Response({'msg':'User details changed successfully'}, status=status.HTTP_200_OK)
        return Response({'error':'Not possible to change information'}, status=status.HTTP_400_BAD_REQUEST)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class CreateEvent(APIView):
    throttle_classes=[UserRateThrottle]
    serializer_class = EventoSerializer
    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def post(self, request, format=None):
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

    def patch(self,request,format=None):
            # Create an Evento instance
            evento = Evento.objects.filter(pk=request.data.get('idEvento')).first()
            if evento is not None:
                idOrganizador = request.data.get("organizador")
                organizador = User.objects.get(pk=idOrganizador)
                # Set attributes from request data
                evento.organizador=organizador
                evento.name = request.data.get("name")
                evento.lugar = request.data.get("lugar")
                evento.inicio = request.data.get("inicio")
                evento.final = request.data.get("final")
                evento.duracion = request.data.get("duracion")
                evento.descripcion = request.data.get("descripcion")
                evento.privacidad1 = request.data.get("privacidad1")
                evento.privacidad2 = request.data.get("privacidad2")
                evento.privacidad3 = request.data.get("privacidad3")
                evento.privacidad4 = request.data.get("privacidad4")
                evento.requisitos1 = request.data.get("requisitos1")
                evento.requisitos2 = request.data.get("requisitos2")
                evento.requisitos3 = request.data.get("requisitos3")
                evento.requisitos4 = request.data.get("requisitos4")
                evento.respondidos = request.data.get("respondidos")
                evento.mapsQuery = request.data.get("mapsQuery")
                if evento.final < evento.inicio:
                    return Response({"error":"Final previo al inicio"}, status=status.HTTP_400_BAD_REQUEST)

                # Save the Evento instance to the database
                evento.save()
                # Return response
                return Response({"msg": "Evento editado satisfactoriamente", "id": evento.id}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error':'Error al editar el evento'},status=status.HTTP_400_BAD_REQUEST)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@throttle_classes([UserRateThrottle])
@api_view(["GET"])
def Events(request):
    user =  User.objects.filter(username=request.user).first()
    if user is None:
        return HttpResponseForbidden('No user defined')
    events = Evento.objects.all()
    parsed_events = [EventoSerializer(evento).data for evento in events]
    return JsonResponse({'events':parsed_events}, status=status.HTTP_200_OK)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class GetOwnEvents(APIView):
    throttle_classes=[UserRateThrottle]
    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def get(self,request,format=None):
        user = request.user
        if user is None:
            return Response({'error':'No user found'}, status=status.HTTP_404_NOT_FOUND)
        events = Evento.objects.filter(organizador_id=user.id)
        if events is None:
            return Response({'error': 'No events not found for this user'}, status=status.HTTP_404_NOT_FOUND)
        serialized_events = [EventoSerializer(event).data for event in events]
        return Response({'events':serialized_events}, status=status.HTTP_200_OK)

@throttle_classes([UserRateThrottle])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
@csrf_protect
def GetEventDetails(request): #Gets all the info to build an event page (details, invitations, responses, rejections)
    event = Evento.objects.filter(id=request.data.get('event_id')).first()

    if event is None:
        return JsonResponse({'error': 'Event not found'}, status=404)
    else:
        # Serialize the event object
        event_serialized = EventoSerializer(event).data
        organizerID = event_serialized['organizador']
        organizer = User.objects.filter(pk=organizerID).first()
        organizer_serialized = UserSerializer(organizer).data
        # Retrieve invitations related to the event
        invitations = Invitacion.objects.filter(evento=event)
        rejections = Rechazado.objects.filter(evento=event)
        responses = Respuesta.objects.filter(evento=event)
        # Serialize each invitation and store in a dictionary
        invite_list_serialized = []
        for invitation in invitations:
            invite_serialized = InvitacionSerializer(invitation).data
            invitee_serialized = UserSerializer(invitation.invitado).data
            invite_serialized['invitado'] = invitee_serialized
            invite_list_serialized.append(invite_serialized)
        rejections_list_serialized = [RechazadoSerializer(rejection).data for rejection in rejections]
        responses_list_serialized = [RespuestaSerializer(response).data for response in responses]
        # Return JSON response containing event details and invitation details
        return JsonResponse({
            'event': event_serialized,
            'organizador': organizer_serialized,
            'invitaciones': invite_list_serialized,
            'respuestas':responses_list_serialized,
            'rechazos':rejections_list_serialized,
        })

"""
@throttle_classes([UserRateThrottle])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(["GET"])
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
"""


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class Invite(APIView):
    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    throttle_classes=[UserRateThrottle]
    def post(self, request):
        user = User.objects.filter(Q(email=request.data.get('invitado')) | Q(username=request.data.get('invitado'))).first()
        if user is not None:
            target_event = Evento.objects.filter(pk=request.data.get("evento")).first()
            invitee = user
            imprescindible = request.data.get("imprescindible")
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
            subject="Reuplan: Invitación a un evento"
            message="Hola! Has sido invitado a al evento "+target_event.name+", creado por el usuario "+target_event.organizador.username+" en ReuPlan, entra a la plataforma para verlo! https://reuplan.lol/#/event/"+str(target_event.id)
            email=invitee.email
            recipient_list = [email]
            send_mail(subject,message,EMAIL_HOST_USER,recipient_list,fail_silently=True)
            return Response({"msg": "Invitación creada satisfactoriamente"}, status=status.HTTP_201_CREATED)
        else:
            return Response({'err':'no se ha encontrado al invitado'},status=status.HTTP_404_NOT_FOUND)

@throttle_classes([UserRateThrottle])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(["POST"])
@csrf_protect
def ToggleInviteQuality(request): #Changes the "imprescindicible" status of an invitee
    invite=Invitacion.objects.filter(id=request.data.get('invite_id')).first()
    if invite:
        invite.imprescindible=not invite.imprescindible
        invite.save()
        return JsonResponse({'msg':'Toggled invite quality'},status=200)
    else:
        return JsonResponse({'err':'Not possible'},status=400)
    
@throttle_classes([UserRateThrottle])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_protect
@api_view(['DELETE'])
def DeleteInvite(request): #Deletes an invitation given its ID
    invite = Invitacion.objects.filter(id=request.data.get('invite_id')).first()
    if invite:
        invite.delete()
        return JsonResponse({"msg": "Invitación eliminada"}, status=200)       
            
    else:
        return JsonResponse({"error": "Invitación no encontrada"}, status=404)

@throttle_classes([UserRateThrottle]) 
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
@csrf_protect
def DeleteEvent(request): #Delets an event given its ID
    event = Evento.objects.filter(pk=request.data.get('event_id')).first()
    if event is not None:
        event.delete()
        return JsonResponse({'msg':'Evento eliminado satisfactoriamente'},status=200)
    else:
        return JsonResponse({'error':'evento no encontrado'})

@throttle_classes([UserRateThrottle])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated]) 
@api_view(['GET'])
def GetUserParticipationDetails(request): #Returns the invitations, rejections and responses from the logged in user
    user = User.objects.filter(username=request.user).first()
    if user is None:
        return JsonResponse({'error': 'User not found'}, status=404)
    else:
        # Serialize the user object
        user_serialized = UserSerializer(user).data
        # Retrieve received invitations for the user
        invitations = Invitacion.objects.filter(invitado=user)
        invitations_list_serialized = [InvitacionSerializer(invitation).data for invitation in invitations]
        # Retrieve emitted rejections for the user
        emitted_rejections = Rechazado.objects.filter(invitado=user)
        emitted_rejections_list_serialized = [RechazadoSerializer(rejection).data for rejection in emitted_rejections]
        # Retrieve responses for the user
        responses = Respuesta.objects.filter(invitado=user)
        responses_list_serialized = [RespuestaSerializer(response).data for response in responses]

        events = []
        for invitation in invitations:
            events.append(EventoSerializer(invitation.evento).data)

        # Return JSON response containing user details and participation details
        return JsonResponse({
            'user': user_serialized,
            'received_invitations': invitations_list_serialized,
            'emitted_rejections': emitted_rejections_list_serialized,
            'responses': responses_list_serialized,
            'eventDetails':events
        })

@throttle_classes([UserRateThrottle])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated]) 
class Schedule(APIView): #Creates a response for an event that is a schedule for its calendar
    serializer_class = RespuestaSerializer
    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def post(self, request):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            evento=Evento.objects.filter(pk=serializer.data.get('evento')).first()
            invitado=User.objects.filter(pk=serializer.data.get('invitado')).first()
            fecha=serializer.data.get('fecha')
            inicio=serializer.data.get('inicio')
            final=serializer.data.get('final')
            #find if a rejection exists, if it does, add the schedule and delete the rejection
            rejection = Rechazado.objects.filter(evento=evento,invitado=invitado)
            if rejection:
                rejection.delete()
                Respuesta.objects.create(
                evento=evento,invitado=invitado,fecha=fecha,inicio=inicio,final=final
                )
                return Response({'msg':'horario agregado exitosamente, rechazo existente eliminado'},status=status.HTTP_201_CREATED)

            Respuesta.objects.create(
                evento=evento,invitado=invitado,fecha=fecha,inicio=inicio,final=final
            )
            
            return Response({'msg':'horario agregado satisfactoriamente'},status=status.HTTP_201_CREATED)

@throttle_classes([UserRateThrottle])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
@csrf_protect
def DeleteSchedule(request):
    schedule = Respuesta.objects.filter(pk=request.data.get('schedule_id')).first()
    if schedule is not None:
        schedule.delete()
        return JsonResponse({"msg": "Horario eliminado"}, status=200)
    else:
        return JsonResponse({"error": "Horario no encontrado"}, status=404)

@throttle_classes([UserRateThrottle])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])     
class Rejection(APIView): #Creates a rejection object from a user for an event 
    serializer_class = RechazadoSerializer
    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def post(self, request):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            evento=Evento.objects.filter(pk=serializer.data.get('evento')).first()
            invitado=User.objects.filter(pk=serializer.data.get('invitado')).first()
            Rechazado.objects.create(
                evento=evento,invitado=invitado
            )
            #Find existing responses from the user to the event and delete them, when rejecting said event
            responses=Respuesta.objects.filter(invitado=invitado,evento=evento)
            if responses:
                responses.delete()
                return Response({'msg':'Rechazo agregado exitosamente, horarios existentes eliminados'})

            return Response({'msg':'Rechazo agregado satisfactoriamente'},status=status.HTTP_201_CREATED)
    
@throttle_classes([AnonRateThrottle])
class CreateRecoveryKey(APIView):
    permission_classes = [AllowAny]
    serializer_class = RecoveryKeySerializer
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def post(self, request):
        user = User.objects.filter(username=request.data.get('user')).first()
        if user is None:
            return Response({'error':'User not found'},status=status.HTTP_404_NOT_FOUND)
        existing_keys = RecoveryKey.objects.filter(user=user).first()
        if existing_keys:
            existing_keys.delete()
        key = generate_random_string(8)
        RecoveryKey.objects.create(key=key,user=user)
        subject="Reuplan: Recuperación de contraseña"
        message="Hola! Solicitaste un cambio de contraseña en ReuPlan.lol para la cuenta asociada a este correo. Ingresa el código "+str(key)+".\n\nSi no has solicitado este cambio, ignora este correo."
        email=user.email
        recipient_list = [email]
        send_mail(subject,message,EMAIL_HOST_USER,recipient_list,fail_silently=True)
        return Response({'message':'Recovery key created succesfully'},status=status.HTTP_201_CREATED)

@throttle_classes([AnonRateThrottle])
class RecoveryAttempt(APIView):
    serializer_class = RecoveryKeySerializer
    permission_classes = [AllowAny]
    def post (self,request):
        entered_key = request.data.get('key')
        user = User.objects.filter(username=request.data.get('username')).first()
        expected_key = RecoveryKey.objects.filter(user=user).first()
        if expected_key is None: # User enters a key before the key has been created
            return Response({'error':'Clave equivocada'},status=status.HTTP_404_NOT_FOUND) #message returns error to hide the fact that the key has not been created yet
        if datetime.datetime.now(datetime.UTC) - expected_key.created > datetime.timedelta(minutes=30): # User fails to enter a key within 30 minutes
            expected_key.delete()
            return Response({'error':'Clave expirada'},status=status.HTTP_400_BAD_REQUEST)
        if entered_key != expected_key.key:  #User fails to enter a key correctly
            expected_key.attempts = expected_key.attempts + 1
            if expected_key.attempts > 4: #User tries to enter a key more than 4 times
                expected_key.delete()
                return Response({'error':'Demasiados intentos'},status=status.HTTP_400_BAD_REQUEST)
            expected_key.save()
            return Response({'error':'Clave expirada'},status=status.HTTP_404_NOT_FOUND)
        if entered_key == expected_key.key: #User enters a key correctly
            expected_key.successful_attempt = True
            expected_key.save()
            return Response({'message':'Clave aceptada!'},status=status.HTTP_200_OK) #lead to frontend view to change password
        return Response({'error':'Algo salió mal!'},status=status.HTTP_400_BAD_REQUEST)
    

@throttle_classes([AnonRateThrottle])
class Contact(APIView):
    permission_classes = [AllowAny]
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def post (self,request):
        name=request.data.get('name')
        contacted_email=request.data.get('email')
        message=request.data.get('message')+"\n\n"+"Enviado por: "+str(contacted_email)+"\n\n"+str(name)
        subject="REUPLAN CONTACTO"
        email="merengueconjamon@gmail.com"
        recipient_list = [email]
        send_mail(subject,message,EMAIL_HOST_USER,recipient_list,fail_silently=True)
        return Response({'message':'Email sent succesfully'},status=status.HTTP_200_OK)

@throttle_classes([AnonRateThrottle])
class EmailUsername(APIView):
    permission_classes = [AllowAny]
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def post (self,request):
        requested_email=request.data.get('email')
        user=User.objects.filter(email=requested_email).first()
        if user is not None:
            message="Hola, has solicitado recuperar tu nombre de usuario en ReuPlan.lol.\n\n El nombre de usuario es: "+str(user.username)+".\n"+"\nSi deseas cambiar tu contraseña, utiliza ahora este nombre de usuario para solicitar el cambio."
            subject="Reuplan: Recuperación de nombre de usuario"
            email=requested_email
            recipient_list = [email]
            send_mail(subject,message,EMAIL_HOST_USER,recipient_list,fail_silently=True)
        return Response({'message':'If the account exists, an email will be sent'},status=status.HTTP_200_OK)


@throttle_classes([AnonRateThrottle])
class PasswordRecovery(APIView):
    permission_classes = [AllowAny]
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def patch (self,request):
        password=request.data.get('password')
        username=request.data.get('username')
        user=User.objects.filter(username=username).first()
        user.set_password(password)
        user.save()
        return Response({'message':'Password changed succesfully'},status=status.HTTP_200_OK)

@throttle_classes([AnonRateThrottle])
class AccountActivation(APIView):
    permission_classes = [AllowAny]
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    def post (self,request):
        requested_key=request.data.get('key')
        key = SignupKey.objects.filter(key=requested_key).first()
        if key is not None:
            if timezone.now() - key.created > datetime.timedelta(hours=24):
                key.delete()
                return Response({'error':'Key expired'},status=status.HTTP_400_BAD_REQUEST)
            user = key.user
            user.is_active=True
            user.save()
            key.delete()
            return Response({'message':'Account activated successfully'},status=status.HTTP_200_OK)
        else: return Response({'error':'Key not found'},status=status.HTTP_404_NOT_FOUND)


@throttle_classes([AnonRateThrottle])
@csrf_exempt
@permission_classes([AllowAny])
@api_view(["GET"])
def delete_account(request,username):
    user=User.objects.filter(username=username).first()
    if user is not None:
        user.delete()
        return Response({'message':'Account deleted successfully'},status=status.HTTP_200_OK)
