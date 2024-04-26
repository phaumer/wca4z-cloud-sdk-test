/*
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2024. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *
 */

import extend from "extend";
import { BaseService, IamAuthenticator } from "ibm-cloud-sdk-core";
import { HttpsProxyAgent, HttpsProxyAgentOptions } from "https-proxy-agent";

const apikey = "<your-api-key>";
const watsonxEndpointUrl = "https://api.dataplatform.cloud.ibm.com";
const iamUrl = "https://iam.cloud.ibm.com";

const proxyProtocol = "http";
const proxyHost = "<your-proxy.company.com>";
const proxyPort = 3128;
const proxyAuthorizationHeader = "Basic <base64-username:password>";
const proxyEnabled = true;

class TestRequest extends BaseService {
  public async getProjects(): Promise<any> {
    const parameters = {
      options: {
        url: "/v1/wca/codegen/c2j/projects",
        method: "GET",
      },
      defaultOptions: extend(true, {}, this.baseOptions, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    };
    return await this.createRequest(parameters);
  }
}

const proxyAgentOptions = proxyAuthorizationHeader
  ? ({
      headers: { "Proxy-Authorization": proxyAuthorizationHeader },
    } as HttpsProxyAgentOptions<string>)
  : undefined;

const httpsProxyAgent = new HttpsProxyAgent(
  `${proxyProtocol}://${proxyHost}:${proxyPort}`,
  proxyAgentOptions
);

const httpsAgentProperty = extend(
  {},
  {
    httpsAgent: proxyEnabled ? httpsProxyAgent : undefined,
    proxy: proxyEnabled ? false : undefined,
  }
);

const authenticator = new IamAuthenticator({
  url: iamUrl,
  ...httpsAgentProperty,
  apikey,
  disableSslVerification: true,
});

const proxyTestRequest = new TestRequest({
  headers: {
    "user-agent": "ibm.zopeneditor/4.0.0",
  },
  serviceUrl: watsonxEndpointUrl,
  authenticator: authenticator,
  ...httpsAgentProperty,
  disableSslVerification: true,
  jar: true,
  timeout: 120000,
  validateStatus: () => true,
});

try {
  const proxyResult = await proxyTestRequest.getProjects();
  console.log(
    `WCA4Z Test SUCCESS. Proxy request results: ${JSON.stringify(proxyResult)}`
  );
} catch (error) {
  console.log(`WCA4Z Test ERROR: Proxy request failed with ${error}`);
}
