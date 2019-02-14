import DS from 'ember-data';

export default DS.Model.extend({
  meetingTitle: DS.attr(),
  meetingPlace: DS.attr(),
  meetingObjective: DS.attr(),
  meetingDescription: DS.attr(),
  otherDetail: DS.attr(),
  recommendation: DS.attr(),
  decision: DS.attr(),
  meetingTopics: DS.hasMany('MeetingTopics'),
  meetings: DS.hasMany('Meetings'),
  memberAttendeds: DS.hasMany('MemberAttendeds')
});
