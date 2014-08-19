# cloudfoundry-services

## Is a helper library to parse the VCAP_SERVICES env variables
## to facilitate easy interaction with bound services in Cloud Foundry


### Constructor:

```javascript
cfServices(serviceName, instanceName/*optional (string or regex)*/, vcap/*optional*/)
```

### Available method calls:

**getServiceVariables()** - returns the vcap object

**findAllInstances()** - returns ALL service instances matching 'serviceName'

**findMatchingInstances()** - returns ALL service instance matching 'serviceName' & 'instanceName'

**findFirstInstance()** - returns FIRST service instance matching 'serviceName' & 'instanceName'

**findFirstCredential()** - returns the FIRST service instance credentials object matching 'serviceName' & 'instanceName'

**findAllCredentials()** - returns ALL service instance credentials objects matching 'serviceName'

**findMatchingCredentials()** - returns ALL service instance credentials objects matching 'serviceName' & 'instanceName'
