# Plugin: Recording for vBrick

This plugin allow the user to have recording the conference in the vBrick platform.

## Plugin Configuration

The configuration file is located in `public/config.json`.

Here is an example of configuration:

```json
{
  "vbrick": {
    "url": "https://pexip.rev-eu.demo.vbrick.com",
    "client_id": "my-client-id",
    "redirect_uri": "https://pexip-infinity.com/local-plugin/redirect"
  }
}
```

You have to define the following parameters:

- **url:** The Vbrick environment to use.
- **client_id:** The key to access Vbrick.
- **redirect_uri:** Location to redirect after a successful authentication. The domain of this URL should be

You have to provision the `client_id` and `redirect_uri` into Vbrick.
  
  1. Open Vbrick webpage. This is the same that you have to define in the url.
  2. Go to `ADMIN > System Settings > API Keys`.
  3. Click on `+ Add Key`.
  4. Introduce the following parameters:
    - **name:** It's only a label to identify the key.
    - **key:** It's the value that we will use as `client_id`.
    - **authorized redirect uris:** Enter the `redirect_uri` that you want to use.
  5. Click on `Create`.

## Pexip Infinity Configuration

In order to use this plugin, our Pexip deployment should comply with the following requirements:

1. All the VMRs to record should contain a **SIP alias**. For example, if we have a VMR with alias `meet` in pexipdemo.com. We should also have another with the following format `meet@pexipdemo.com`.
2. You will need to configure the call routing to accept **SIP incoming** INVITES. Go to the Pexip Management node and create a new call routing (Services > Call Routing).

## Run the plugin

The first step is to download and compile all the dependencies:

```
npm install
```

Now we can launch the development server:

```
npm start
```

## Build the plugin

We can generate the `dist` folder with the build with the following command:

```
npm build
```
