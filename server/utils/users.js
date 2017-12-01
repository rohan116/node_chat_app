[{
  id: '/sfdgdcascacas',
  name:"andrew",
  room:"the room"
}]

class Users {
  constructor(){
      this.users = [];
  }

  addUser(id,name,room){
    var user = {id,name,room};
    this.users.push(user);
    return user;
  }

  removeUser(id){
    //return user that was removed
    var removeID = this.getUser(id);
    if(removeID){
      this.users = this.users.filter((user) => user.id !== id);
    }
    return removeID;
  }

  getUser(id){
    return this.users.filter((user) => user.id === id)[0];
    //return getID;
  }

  getUserList(room){
    var users = this.users.filter((user) => {
      return user.room.toUpperCase() === room.toUpperCase();
    });
    var namesArray = users.map((user) => {
      return user.name;
    });
    return namesArray;
  }
}


module.exports ={Users};
