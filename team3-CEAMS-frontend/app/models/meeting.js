import DS from 'ember-data';

export default DS.Model.extend({
  startDateTime: DS.attr(),
  endDateTime: DS.attr(),
  meetingAttendingMeeting: DS.attr('MeetingTopics'),
  meetingMinutes: DS.attr('MeetingMinutes')
});
