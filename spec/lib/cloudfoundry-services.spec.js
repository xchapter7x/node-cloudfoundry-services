var VcapServices = require("../../src/lib/cloudfoundry-services");
var _ = require("underscore");

describe( "Cloudfoundry-Services helper class", function () {
  var defaultServiceName, defaultVcap;

  beforeEach(function () {
    defaultVcap = {
      "rediscloud": [
        {
          "credentials": {
            "hostname": "my.fake.url.com",
            "password": "myfakepass",
            "port": "12345"
          },
          "label": "rediscloud",
          "name": "universal-demo-service-1",
          "plan": "25mb",
          "tags": [
            "redis",
            "key-value",
            "Data Stores",
            "Data Store"
          ]
        },
        {
          "credentials": {
            "hostname": "my.fake.url.com",
            "password": "myfakepass",
            "port": "12345"
          },
          "label": "rediscloud",
          "name": "universal-demo-service-2",
          "plan": "25mb",
          "tags": [
            "redis",
            "key-value",
            "Data Stores",
            "Data Store"
          ]
        },
        {
          "credentials": {
            "hostname": "my.fake.url.com",
            "password": "myfakepass",
            "port": "12345"
          },
          "label": "rediscloud",
          "name": "universal-demo-service-3",
          "plan": "25mb",
          "tags": [
            "redis",
            "key-value",
            "Data Stores",
            "Data Store"
          ]
        }
      ]
    };
    defaultServiceName = "rediscloud";
  });

  describe("constructor", function() {
    var services,
    controlInstanceName;

    beforeEach(function () {
      controlInstanceName = "testInstance";
      services = new VcapServices(defaultServiceName, controlInstanceName);
    });

    it("should take 2 arguments and assigns them to serviceName & instanceName", function () {
      expect(services.serviceName).toEqual(defaultServiceName);
      expect(services.instanceName).toEqual(controlInstanceName);
    });

    it("should take an optional 3rd argument to overwrite the default vcap assignment", function () {
      var controlObject = {my: "vcap object"};
      services = new VcapServices(defaultServiceName, controlInstanceName, controlObject);
      expect(services.vcapServices).toEqual(controlObject);
    });

    it("should set value in env.VCAP_SERVICES to vcapServices if not overwritten", function () {
      expect(services.vcapServices).toEqual(process.env.VCAP_SERVICES);
    });

    it("should set instanceName to regex if undefined", function () {
      services = new VcapServices(defaultServiceName);
      expect(_.isRegExp(services.instanceName)).toEqual(true);
    });
  });

  describe("get/set ServiceVariables method", function() {

    it("should return the vcap_services object", function() {
      var controlInstanceName = "testInstance";
      var services = new VcapServices(defaultServiceName, controlInstanceName, defaultVcap);
      expect(services.getServiceVariables()).toEqual(defaultVcap);
    });
  });

  describe("findAllInstances method", function() {
    var services,
    controlInstanceName;

    beforeEach(function () {
      controlInstanceName = new RegExp("universal-demo-service.*", "g");
      services = new VcapServices(defaultServiceName, controlInstanceName, defaultVcap);
    });

    it("should return all service instances of a given service type that match regex on instance name", function() {
      var controlServiceList = services.getServiceVariables()[defaultServiceName];
      expect(services.findAllInstances()).toEqual(controlServiceList);
    });
  });

  describe("findAllCredentials method", function() {
    var services,
    controlInstanceName;

    beforeEach(function () {
      controlInstanceName = new RegExp("universal-demo-service.*", "g");
      services = new VcapServices(defaultServiceName, controlInstanceName, defaultVcap);
    });

    it("should return all service instances of a given service type that match regex on instance name", function() {
      var controlServiceList = services.getServiceVariables()[defaultServiceName];
      expect(services.findAllCredentials()).toEqual(_.map(controlServiceList, function(m){
        return m.credentials;
      }));
    });
  });

  describe("findMatchingInstances method", function() {

    it("should return only exact matching service instances of a given service type", function() {
      var controlInstanceName = "universal-demo-service-1";
      var services = new VcapServices(defaultServiceName, controlInstanceName, defaultVcap);
      var matches = services.findMatchingInstances();
      var controlMatches = _.find(services.getServiceVariables()[defaultServiceName], function(elem) {
        return elem.name === controlInstanceName;
      });
      expect(matches).toEqual([controlMatches]);
    });

    it("should return only regex matching service instances of a given service type", function() {
      var controlInstanceName = new RegExp(".*", "g");
      var services = new VcapServices(defaultServiceName, controlInstanceName, defaultVcap);
      var matches = services.findMatchingInstances();

      var controlMatches = _.filter(services.getServiceVariables()[defaultServiceName], function(elem) {
        return (controlInstanceName.test(elem.name) === true);
      });
      expect(matches).toEqual(controlMatches);
    });
  });

  describe("findMatchingCredentials method", function() {

    it("should return only exact matching service instances credentials of a given service type", function() {
      var controlInstanceName = "universal-demo-service-1";
      var services = new VcapServices(defaultServiceName, controlInstanceName, defaultVcap);
      var matches = services.findMatchingCredentials();
      var controlMatches = _.find(services.getServiceVariables()[defaultServiceName], function(elem) {
        return elem.name === controlInstanceName;
      });
      expect(matches).toEqual([controlMatches.credentials]);
    });

    it("should return only regex matching service instances credentials of a given service type", function() {
      var controlInstanceName = new RegExp(".*", "g");
      var services = new VcapServices(defaultServiceName, controlInstanceName, defaultVcap);
      var matches = services.findMatchingCredentials();

      var controlMatches = _.filter(services.getServiceVariables()[defaultServiceName], function(elem) {
        return (controlInstanceName.test(elem.name) === true);
      });
      expect(matches).toEqual(_.map(controlMatches, function(m){
        return m.credentials;
      }));
    });
  });

  describe("findFirstInstance method", function() {
    it("should return only first regex matching service instance of a given service type", function() {
      var controlInstanceName = new RegExp(".*", "g");
      var services = new VcapServices(defaultServiceName, controlInstanceName, defaultVcap);
      var matches = services.findFirstInstance();

      var controlMatches = _.find(services.getServiceVariables()[defaultServiceName], function(elem) {
        return (controlInstanceName.test(elem.name) === true);
      });
      expect(matches).toEqual(controlMatches);
    });
  });

  describe("findFirstCredential method", function() {
    it("should return only first regex matching service credentials instance of a given service type", function() {
      var controlInstanceName = new RegExp(".*", "g");
      var services = new VcapServices(defaultServiceName, controlInstanceName, defaultVcap);
      var matches = services.findFirstCredential();

      var controlMatches = _.find(services.getServiceVariables()[defaultServiceName], function(elem) {
        return (controlInstanceName.test(elem.name) === true);
      });
      expect(matches).toEqual(controlMatches.credentials);
    });
  });


});
