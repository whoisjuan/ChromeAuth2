<p align="center">
  <img src="https://whoisjuan.github.io/alt-images/chromeauth2.png" alt="ChromeAuth2: Chrome Extension OAuth2 Library"/>
</p>
===============================

<br>

[[ ChromeAuth2 is a modification and expansion of <b>chrome-ex-oauth2</b>, a chrome extension oAuth library created by JJ Ford.
You can see there original library here: <a href="https://github.com/jjNford/chrome-ex-oauth2"> jjNford/chrome-ex-oauth2</a> and the original fork here: <a href="https://github.com/whoisjuan/chrome-ex-oauth2"> whoisjuan/chrome-ex-oauth2 </a> ]]

ChromeAuth2 is a Chrome Extension OAuth2 Library that provides a straight-forward and easy-to-use alternative to launch an OAuth2 Flows within a Chrome Extension.

By using ChromeAuth2 you would be able to start an authorization process from a Chrome Extension `popup.html` view. ChromeAuth2 would then complete the authorization "dance" and store the token in a Chrome Storage instance that can be accessed from any script within your extension. 

<br>
<br>

How To Use
----------
#### 1. Add the following to your extension manifest:

	

	{
		...
		...
		
		"permissions":{
			"https://github.com/login/oauth/access_token",
			"tabs",
			"storage"
		},
		
		"content_scripts":[{
			"matches":["https://github.com/robots.txt*"],
			"js":["libs/chrome-ex-oauth2/injection.js"],
			"run_at":"document_start"
		}],
		
		...
		...
	}


The `permissions` url and `content_script` -> `matches` URL are determined by the API you are requesting authorization for. We will be requesting permission to launch tabs and use the Chrome native storage.
	
We also would need to grant permission to an injection script ('injection.js') that would be launched to complete the OAuth dance. Please have in mind that you need to replace the "matches" URL with your OAuth Redirection URL. The injection would be launched after hitting the Redirection URL. In this case you would need to replace `https://github.com/robots.txt*` with the URL you setup with your authorization provider.

<br>

Also make sure to give "Web Accesible Resources" permissions to your 'libs' folders. The extension would need explicit access to this folder after adding the library.


		{
		      "web_accessible_resources": [
				"libs/*"
			  ]
		}

<br>
<br>

#### 2. Add your application and API provider information to `libs/chrome-ex-auth/oauth2.js`:


		(function() {
			window.oauth2 = {
			
			access_token_url: "{your-access-token-url}",
			authorization_url: "{your-authorization-url}",
			client_id: "{your-client-id}",
			client_secret: "{your-client-secret}",
			redirect_url: "{your-redirect-url}",
			scopes: [{your-array-of-scopes}],
			
			...
			...
		
		})();			


***Note:*** The provided function is only a boiler-plate. The variable names and the variables you pass to the Authorization API would be specific to your API provider. Some authorization APIs would require other parameters like  `scope` and `response-type`. 

You would need to include those parameters in your initial variables and modify the `start()` function to include the newly added parameters. You might also need to add some logic if you have an array of scopes or other array of values that need to be passed to the URL:
	

		start: function() {
			    window.close();
			    // Modify this url depending on the parameters that your API providers requires you to pass.
			    var url = this.authorization_url + "?client_id=" + this.client_id + "&redirect_uri=" + this.redirect_url + "&response_type=" + this.response_type + "&scope=" + this.scope;
			    // Use this logic to include several scopes.
			    // for(var i in this.scopes) {
			    //     url += this.scopes[i];
			    // }
			    chrome.tabs.create({ url: url, active: true });
			},		
			

<br>
<br>

#### 3. Include the authorization script `popup.html` view of your project:


	<html>
	...
	...
	<body>
		...
		...
		
		<script src="libs/chrome-ex-oauth/oauth2.js"></script>
		
		...
		...
	</body>
	</html>

	
<br>
<br>

#### 4. To launch the authorization flow, run this function from your script: 

	window.oauth2.start();


The ideal way to call `oauth2.start()` function and initialize the library flow is by calling it from a button or link in your extension html:
	
popup.html

	<button id="oauth-button"> Click Me to Authorize with GitHub</button>
<br>

popup.js or background.js

	$('#oauth-button').click(function() {
    	    window.oauth2.start();
	});

<br>
<br>
	
#### 5. Please include attribution to library: 

For your convenience here is a comment that you can add to your extension for attribution:

	/**
	* ChromeAuth2 is an open-source library created by https://github.com/jjNford
	* with contributions and branding by https://github.com/whoisjuan
	*
	* Redistribution of this work, with or without modification, is permitted if
	* proper attributions to the original author and main contributors are added.
	* The orginal author and main contributors encourage the use of their work but 
	* do not endorse any specific project in which their work is used.
	
	
	*Copyright-2017 2012: Original Author, JJ Ford and Contributor, Juan J Ramirez.

   	*Licensed under the Apache License, Version 2.0 (the "License");
   	*you may not use this file except in compliance with the License.
   	*You may obtain a copy of the License at

       	*http://www.apache.org/licenses/LICENSE-2.0
	*/
	
<br>
<br>

How Does it Work
----------

<p align="center">
  <img src="https://whoisjuan.github.io/alt-images/flow.png" alt="ChromeAuth2: Chrome Extension OAuth2 Library Flow"/>
</p>


<br>
<br>

API
---

>**start()**
><br><br>
>Starts the authorization process.

<br>

>**finish()**
><br><br>
>Finishes the authorization process (Already setup on the library flow. If you want to alter this function or its behavior, make sure to use it exclusively within the OAuth flow and after succesfully invoking and executing. `start()`.

<br>

>**getToken()**
><br><br>
>Retrieves the applications authorization token from the Chrome Storage.

<br>

>**clearToken()**
><br><br>
>Clears the applications token from the Chrome Storage.

--
<sub>This library has only been tested with the [GitHub API v3](http://developer.github.com/v3/) and [LIFX Remote Control API v1](https://api.developer.lifx.com/)</sub>
