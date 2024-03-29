# IBM watsonx Code Assistant for Z Cloud SDK test script

- Modify the [index.ts](./src/index.ts) file with your api-key and proxy information.
- Install nodejs 18 and npm 9.8 (or similar versions)
- Run with

```bash
export DEBUG=ibm-cloud-sdk-core*
npm install
npm run test
```

- Depending on how your proxy is configure try changing `http` to `https` in the proxy headers.
- See this doc page to learn more about Cloud SDK: <https://github.com/IBM/node-sdk-core/blob/main/README.md>
- See this section <https://github.com/axios/axios?tab=readme-ov-file#request-config> for how to use the SDK with a proxy.
