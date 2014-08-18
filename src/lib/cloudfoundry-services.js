var _ = require("underscore");

var cfServices = function(serviceName, instanceName, vcap) {
  var defaultInstanceRegex = new RegExp(".*","g");
  this.vcapServices = vcap || process.env.VCAP_SERVICES;
  this.serviceName = serviceName;
  this.instanceName = instanceName || defaultInstanceRegex;
};

cfServices.prototype.getServiceVariables = function() {
  return this.vcapServices;
};

cfServices.prototype.findAllInstances = function() {
  return this._findMetaData.call(this, function(servicesList) {
    return servicesList;
  });
};

cfServices.prototype.findMatchingInstances = function() {
  return this._findMetaData.call(this, _.filter);
};

cfServices.prototype.findFirstInstance = function() {
  return this._findMetaData.call(this, _.find);
};

cfServices.prototype._filterVcap = function(service) {
  var isMatch;

  if(_.isRegExp(this.instanceName)) {
    isMatch = (this.instanceName.test(service.name) === true);

  } else {
    isMatch = (service.name === this.instanceName);
  }
  return isMatch;
};

cfServices.prototype._findMetaData = function(findFunctor) {
  var metaData = {};

  if(_.has(this.getServiceVariables(), this.serviceName) === true) {
    metaData = findFunctor(this.vcapServices[this.serviceName], this._filterVcap.bind(this));
  }
  return metaData;
};

cfServices.prototype.findFirstCredential = function() {
  return this.findFirstInstance().credentials;
};

cfServices.prototype.findAllCredentials = function() {
  var instanceMatches = this.findAllInstances();

  return _.map(instanceMatches, function(instance) {
    return instance.credentials;
  });
};

cfServices.prototype.findMatchingCredentials = function() {
  var instanceMatches = this.findMatchingInstances();

  return _.map(instanceMatches, function(instance) {
    return instance.credentials;
  });
};

module.exports = cfServices;
