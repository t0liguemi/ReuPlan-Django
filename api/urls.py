from django.urls import path
from .views import *

urlpatterns = [
    path('user/create', CreateUser.as_view()),
    path('event/create', CreateEvent.as_view()),
    path('user', Users.as_view()),
    path('event/all', Events.as_view()),
    path('event/get/<int:event_id>', GetEventDetails, name='event-details'),
    path('user/get/<int:user_id>', GetUserDetails, name='user-details'),
    path('event/<int:event_id>/organizer', EventOrgData, name='organizer-details'),
    path('invite', Invitee.as_view()),
    path('invite/delete/<int:invite_id>', DeleteInvite)
]
