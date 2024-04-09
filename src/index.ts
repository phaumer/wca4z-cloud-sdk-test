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
import { HttpsProxyAgent } from "https-proxy-agent";

const apiKey = "<your-api-key>";
const watsonxIamAuthUrl = "https://iam.cloud.ibm.com/identity/token";
const watsonxEndpointUrl = "https://api.dataplatform.cloud.ibm.com";

const proxyProtocol = "http";
const proxyHost = "<your-proxy.company.com>";
const proxyPort = 3128;

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

const httpsProxyAgent = new HttpsProxyAgent(
  `${proxyProtocol}://${proxyHost}:${proxyPort}`
);

const proxyAuthenticator = new IamAuthenticator({
  url: watsonxIamAuthUrl,
  httpsAgent: httpsProxyAgent,
  apikey: apiKey,
});

const proxyTestRequest = new TestRequest({
  headers: {
    "user-agent": "ibm.zopeneditor/4.0.0",
  },
  serviceUrl: watsonxEndpointUrl,
  authenticator: proxyAuthenticator,
  jar: true,
  timeout: 120000,
  validateStatus: () => true,
  httpsAgent: httpsProxyAgent,
});

try {
  const proxyResult = await proxyTestRequest.getProjects();
  console.log(
    `WCA4Z Test SUCCESS. Proxy request results: ${JSON.stringify(proxyResult)}`
  );
} catch (error) {
  console.log(`WCA4Z Test ERROR: Proxy request failed with ${error}`);
}
