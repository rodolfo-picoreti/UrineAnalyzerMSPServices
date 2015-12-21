let _ = Meteor.npmRequire('underscore')

Services.utils.find = function (array, prop, value) {
  let result = _.find(array, (obj) => obj[prop] == value) 
  if (typeof result === 'undefined') {
    throw `Services Utils: invalid ${prop}: ${value}`
  }
  return result
}
