const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const UsersService = require('../../../services/users');
//passport use, con un nuevo objeto de basicStrategy de passport-http
passport.use(new BasicStrategy(async (email, password, cb) => {
  const userService = new UsersService();
  try {
    //get user
    const user = await userService.getUser({ email });

    //verificamos existencia
    if(!user) {
      return cb(boom.unauthorized(), false);
    }
    //verificamos password
    if(!(await bcrypt.compare(password, user.password))){
      return cb(boom.unauthorized(), false);
    }

    delete user.password;
    return cb(null, user)
  } catch (err ) {
    return cb(err)
  }
}))