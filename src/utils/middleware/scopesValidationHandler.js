const boom = require('@hapi/boom');
const errorBoom = require('../functions/errorBoom')
//pasamos el array con scopes
const scopesValidationHandler = (allowedScopes) => {
  //usamos middleware
  return (req, res, next) => {
    //validamos que el req, tenga usuario y scopes
    if(!req.user || (req.user && !req.user.scopes)) {
      next(boom.unauthorized('Missing scopes'));
    }
    //validamos con la informacion en los scopes del jwt y el que pasamos a la funcion
    const hasScopes = allowedScopes.map(allowedScope => req.user.scopes.includes(allowedScope))
    const presentScopes = hasScopes.map((scopoe,index) => {if(scopoe) {return allowedScopes[index]}})
    const hasAccess = hasScopes.find(allowed => Boolean(allowed));

    if(hasAccess) {
      req.presentScopes=presentScopes
      next();
    }else {
      errorBoom(boom.unauthorized('Insufficient scopes'), res)
      next(boom.unauthorized('Insufficient scopes'));
    }

  }
}

module.exports = scopesValidationHandler;