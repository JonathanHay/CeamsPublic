import DS from 'ember-data';

export default DS.Model.extend({
    startDateTime: DS.attr(),
    endDateTime: DS.attr(),
    memberAttendingMeeting: DS.belongsTo('MemberAttendingMeetings'),
    meetingMinutes: DS.belongsTo('MeetingMinutes')
});
