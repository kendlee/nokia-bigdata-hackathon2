module.exports = function(commaDelimitedDatadump) {
  var datadump = commaDelimitedDatadump.split(",");
  var INDEX_CONFIG_ID = 0;
  var INDEX_TECHNOLOGY = 1;
  var INDEX_SM_CONFIGURATION = 3;
  var INDEX_FSMF_TECHNOLOOGY = 4;
  var INDEX_LTE_BB_CAPACITY = 10;
  var INDEX_WCDMA_BB_CAPACITY = 13;
  var INDEX_GSM_BB_CAPACITY = 14;

  var configuration = {
    configId:datadump[INDEX_CONFIG_ID],
    smMode: {
      gsm: {
        enabled:false,
        bbCapacity:null
      },
      lte: {
        enabled:false,
        bbCapacity:null
      },
      wcdma: {
        enabled:false,
        bbCapacity:null
      },
    },
    smDeployment:[]
  }

  // handle technology configurations
  var technology = datadump[INDEX_TECHNOLOGY];
  if (technology.indexOf('G') > -1) {
    configuration.smMode.gsm.enabled = true;
    configuration.smMode.gsm.bbCapacity = datadump[INDEX_GSM_BB_CAPACITY];
  }
  if (technology.indexOf('L') > -1) {
    configuration.smMode.lte.enabled = true;
    configuration.smMode.lte.bbCapacity = {
      rcs:datadump[INDEX_LTE_BB_CAPACITY],
      bcs:datadump[INDEX_LTE_BB_CAPACITY+1],
      ecs:datadump[INDEX_LTE_BB_CAPACITY+2]
    };
  }
  if (technology.indexOf('W') > -1) {
    configuration.smMode.wcdma.enabled = true;
    configuration.smMode.wcdma.bbCapacity = datadump[INDEX_WCDMA_BB_CAPACITY];
  }

  // handle system module configurations
  var smConfiguration = datadump[INDEX_SM_CONFIGURATION].split('+');
  var smDeploymentCount = Math.ceil(smConfiguration.length / 3);
  var MAX_CARDS_PER_DEPLOYMENT = 3;

  for (var ctr = 0;ctr<smDeploymentCount;ctr++) {
    var offset = ctr * MAX_CARDS_PER_DEPLOYMENT;
    var deployment = {
      fsmf: {technology: technologyEnum(datadump[INDEX_FSMF_TECHNOLOOGY + offset])},
      extension: []
    };
    while (smConfiguration[++offset] && (offset%MAX_CARDS_PER_DEPLOYMENT != 0)) {
      deployment.extension.push({
        technology:datadump[INDEX_FSMF_TECHNOLOOGY+offset],
        fbbx:smConfiguration[offset]
      });
    }
    configuration.smDeployment.push(deployment);
  }
  return configuration;
}

function technologyEnum(technologyString) {
  if (technologyString === "WG")
    return "WCDMA & GSM";
  else if (technologyString === "LG")
    return "LTE & GSM";
  else
    return technologyString;
}