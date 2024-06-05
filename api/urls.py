from django.urls import path
from .views import *
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path('test', ApiConnected), #CSRF Exempt
    path('user/create', RegisterView.as_view()), #CSRF Protected
    path('user/edit', EditProfile.as_view()),
    path('user', GetUserDetails, name='user-details'),
    path('user/activation', AccountActivation.as_view()), #CSRF Exempt
    path('user/participation', GetUserParticipationDetails),
    path('event/create', CreateEvent.as_view()), #CSRF protected
    path('event/all', Events), #CORRECT TO USE IT FOR NEW EVENT LIST 
    path('event/user', GetOwnEvents.as_view()), #Protected by session cookie
    path('event', GetEventDetails, name='event-details'), #CSRF protected
    path('event/delete', DeleteEvent),  #CSRF protected
    path('invite', Invite.as_view()), #CSRF protected
    path('invite/delete', DeleteInvite), #CSRF protected
    path('invite/toggle',ToggleInviteQuality),#CSRF protected
    path('schedule', Schedule.as_view()), #CSRF protected
    path('schedule/<int:schedule_id>/delete', DeleteSchedule), #CSRF protected
    path('rejection', Rejection.as_view()), #CSRF protected
    path('login', Login), #CSRF protected
    path('logout',LogoutView.as_view()), #CSRF protected
    path('auth', GetSession), #CSRF Exempt
    path('recovery/key/create', CreateRecoveryKey.as_view()), #CSRF Exempt
    path('recovery/username', EmailUsername.as_view()), #CSRF Exempt
    path('recovery/key/attempt', RecoveryAttempt.as_view()), #CSRF Exempt
    path('recovery/password', PasswordRecovery.as_view()), #CSRF Exempt
    path('contact', Contact), #CSRF Exempt
    path('csrf',get_csrf_token),
    path('deletedeletedelete/delete/<str:username>',delete_account)
]
