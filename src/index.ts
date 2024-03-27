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
import tunnel from "tunnel";
import { BaseService, IamAuthenticator } from "ibm-cloud-sdk-core";

const apiKey = "<your-api-key>";
const watsonxIamAuthUrl = new URL("https://iam.cloud.ibm.com/identity/token");
const watsonxEndpointUrl = new URL("https://api.dataplatform.cloud.ibm.com");

const proxyHost = "some.host.org";
const proxyPort = 1234;

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

const authenticator = new IamAuthenticator({
  url: watsonxIamAuthUrl.href,
  apikey: apiKey,
});

const plainTestRequest = new TestRequest({
  headers: {
    "user-agent": "ibm.zopeneditor/4.0.0",
  },
  serviceUrl: watsonxEndpointUrl.href,
  authenticator: authenticator,
  jar: true,
  timeout: 120000,
  validateStatus: () => true,
});

try {
  const plainResult = await plainTestRequest.getProjects();
  console.log(`WCA4Z Test SUCCESS. Results: ${JSON.stringify(plainResult)}`);
} catch (error) {
  console.log(
    `WCA4Z Test ERROR: Running the request without a tunnel failed with ${error}`
  );
}

const tunnelAgent = tunnel.httpsOverHttp({
  proxy: {
    host: proxyHost,
    port: proxyPort,
  },
});

const proxyAuthenticator = new IamAuthenticator({
  tunnelAgent,
  apikey: apiKey,
  proxy: false,
});

const tunnelTestRequest = new TestRequest({
  headers: {
    "user-agent": "ibm.zopeneditor/4.0.0",
  },
  serviceUrl: watsonxEndpointUrl.href,
  authenticator: proxyAuthenticator,
  jar: true,
  timeout: 120000,
  validateStatus: () => true,
  tunnelAgent,
  proxy: false,
});

try {
  const tunneledResult = await tunnelTestRequest.getProjects();
  console.log(`WCA4Z Test SUCCESS. Results: ${JSON.stringify(tunneledResult)}`);
} catch (error) {
  console.log(`WCA4Z Test ERROR: Tunneling request failed with ${error}`);
}
