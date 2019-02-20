import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return {
      allUsers: [
        {
          _id: "wiofvnewoi",
          firstName: "Jason",
          lastName: "Chin",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        },
        {
          _id: "asghfddsf",
          firstName: "Welson",
          lastName: "Wei",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        },
        {
          _id: "asdfgdsfawfd",
          firstName: "Evan",
          lastName: "Hutnik",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        },
        {
          _id: "hhrtfsdgs",
          firstName: "Billy",
          lastName: "Fincher",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        },
      ],
      members: [
        {
          _id: "43tgrarg",
          firstName: "Jake",
          lastName: "Prouse",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        },
        {
          _id: "f43gagaaa",
          firstName: "Jonathan",
          lastName: "Hay",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }
      ]
    };
  }
});
