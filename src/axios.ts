/*
 * Licensed Materials - Property of IBM
 * (c) Copyright David Whitman
 * (c) Copyright IBM Corporation 2024. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *
 */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

// Without this, I get "Error: unable to get local issuer certificate"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const apikey = "<your-api-key>";
const watsonxIamAuthBase = "https://iam.cloud.ibm.com";
const watsonxIamAuthPath = "/identity/token";
const proxyUrl = "<http://your-proxy.company.com:1234>";
const agent = new HttpsProxyAgent(proxyUrl);

const axiosDefaultConfig: AxiosRequestConfig = {
  proxy: false,
  httpsAgent: agent,
};

const axiosClient = axios.create({
  baseURL: watsonxIamAuthBase,
  ...axiosDefaultConfig,
});

const response: AxiosResponse = await axiosClient.post(
  watsonxIamAuthPath,
  new URLSearchParams({
    apikey,
    grant_type: "urn:ibm:params:oauth:grant-type:apikey",
  }),
  {
    headers: { "content-type": "application/x-www-form-urlencoded" },
  }
);

console.log(response.data);
