from django.urls import path
from .views import *
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path('test', ApiConnected),
    path('user/create', RegisterView.as_view()),
    path('user', Users.as_view()),
    path('user/edit', EditProfile.as_view()),
    path('user/get/<int:user_id>', GetUserDetails, name='user-details'),
    path('event/create', CreateEvent.as_view()),
    path('event/all', Events.as_view()),
    path('event/get/<int:event_id>', GetEventDetails, name='event-details'),
    path('event/<int:event_id>/organizer', EventOrgData, name='organizer-details'),
    path('event/<int:event_id>/delete', DeleteEvent),
    path('invite', Invite.as_view()),
    path('invite/delete/<int:invite_id>', DeleteInvite),
    path('invite/<int:invite_id>/toggle',ToggleInviteQuality),
    path('user/<int:user_id>/participation', GetUserParticipationDetails),
    path('schedule', Schedule.as_view()),#Find rejection for event and delete it when a schedule is added
    path('schedule/<int:schedule_id>/delete', DeleteSchedule),
    path('rejection', Rejection.as_view()),
    path('docs', include_docs_urls(title="ReuplanAPI")),
    path('login', LoginView.as_view()),
    path('logout',LogoutView.as_view()),
    path('auth', session_view.as_view()),
    path('recovery/key/create', CreateRecoveryKey.as_view()),
    path('recovery/username', EmailUsername),
    path('recovery/key/attempt', RecoveryAttempt.as_view()),
    path('contact', Contact)
]
