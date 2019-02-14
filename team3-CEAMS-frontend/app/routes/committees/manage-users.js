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
          lastName: "fetcher",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        },
      ],
      members: [
        {
          _id: "43tgrarg",
          firstName: "Jakeo",
          lastName: "Bakeo",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        },
        {
          _id: "f43gagaaa",
          firstName: "Jonathon",
          lastName: "Lastname",
          email: "jason.chin@gmail.com",
          building: "ACHUB",
          officeNumber: "32"
        }
      ]
    };
  }
});
