# node-red-contrib-monzo

### This is a node-red package that will allow you to retrive information from monzo, using your access token.

This is an easy to use node, all you have to do is input a access token and select what information you want under the request dropdown.



- [Installation](#installation)
- [Getting your temporary AccessToken](#temptoken)
- [Getting your permanent AccessToken](#permtoken)
- [Usage](#usage)
- [Capability](#cap)


### <a name="installation"></a> Installation
##### <a name="installation-npm"></a> Install via npm
```js
npm install node-red-contrib-monzo
```

### <a name="temptoken"></a> Getting your temporary token
To get your access token you will need to go to "https://developers.monzo.com/api/playground" and log in with your monzo account, you will see your access token on the playground page.

### <a name="permtoken"></a> Getting your permanent token
In order to have permanent authentication, this will require you to set up a monzo API client see "https://developers.monzo.com/apps/new", so that you can have a clientID and a API secret. (please node, the client will need Confidential set to TRUE, otherwise it will not automatically refresh).

### <a name="usage"></a> How to use this node.
After you have placed the node, enter its configuration you can either add a temporary token or a clientID and API secret. If you added the clientID and secret you will now need to go through the authentication process by clicking "Authenticate With Monzo". Once a access token is added, select the request type you would like to do. To make a request simply inject anything into the input node to get a response from the output node.

### <a name="cap"></a> Capability
This node can retreive three kinds of information from your monzo account.
- Account Information
- Balance Information
- Pots