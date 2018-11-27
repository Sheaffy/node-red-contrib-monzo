# node-red-contrib-monzo

### This is a node-red package that will allow you to retrive information from monzo, using your access token.

This is an easy to use node, all you have to do is input a access token and select what information you want under the request dropdown.



- [Installation](#installation)
- [Getting your AccessToken](#token)
- [Usage](#usage)
- [Capability](#cap)


### <a name="installation"></a> Installation
##### <a name="installation-npm"></a> Install via npm
```js
npm install node-red-contrib-monzo
```

### <a name="token"></a> Getting your Token
To get your access token you will need to go to "https://developers.monzo.com/api/playground" and log in with your monzo account, you will see your access token on the playground page.

### <a name="usage"></a> How to use this node.
After you have placed the node, enter its configuration and add a token. Once added, select the request type you would like to do. To make a request simply inject anything into the input node to get a response from the output node.

### <a name="cap"></a> Capability
This node can retreive three kinds of information from your monzo account.
- Account Information
- Balance Information
- Pots