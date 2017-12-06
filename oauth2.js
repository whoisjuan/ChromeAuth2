(function() {
    window.oauth2 = {

        access_token_url: "https://github.com/login/oauth/access_token",
        authorization_url: "https://github.com/login/oauth/authorize",
        client_id: "00011111aaaaabbbbbbbccccccddddddd",
        client_secret: "000111112222222333333aaaaabbbbbccccccdddddddeeeee",
        redirect_url: "https://github.com/robots.txt",
        scopes: [],

        key: "oauth2_token",

        /**
         * Starts the authorization process.
         */
        start: function() {
            window.close();
            var url = this.authorization_url + "?client_id=" + this.client_id + "&redirect_uri=" + this.redirect_url + "&scopes=";
            for(var i in this.scopes) {
                url += this.scopes[i];
            }
            chrome.tabs.create({url: url, active: true});
        },

        /**
         * Finishes the oauth2 process by exchanging the given authorization code for an
         * authorization token. The authroiztion token is saved to the browsers local storage.
         * If the redirect page does not return an authorization code or an error occures when 
         * exchanging the authorization code for an authorization token then the oauth2 process dies
         * and the authorization tab is closed.
         * 
         * @param url The url of the redirect page specified in the authorization request.
         */
        finish: function(url) {

            function removeTab() {
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.remove(tab.id);
                });
            };

            if(url.match(/\?error=(.+)/)) {
                removeTab();
            } else {
                var code = url.match(/\?code=([\w\/\-]+)/)[1];

                var that = this;
                var data = new FormData();
                data.append('client_id', this.client_id);
                data.append('client_secret', this.client_secret);
                data.append('code', code);

                // Send request for authorization token.
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('readystatechange', function(event) {
                    if(xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            if(xhr.responseText.match(/error=/)) {
                                removeTab();
                            } else {
                                // Parsing JSON Response.
                                var response = xhr.responseText;
                                var jsonResponse = JSON.parse(response);
                                // Replace "access_token" with the parameter
                                // relevant to the API you're using.
                                var tokenOauth = jsonResponse.access_token
                                var obj = { 'token': tokenOauth };
                                // Storing in Chrome Local Storage.
                                chrome.storage.local.set(obj, function() {
                                    // Notify that we saved.
                                    console.log('oAuth Token saved');
                                });
                                removeTab();
                            }
                        } else {
                            removeTab();
                        }
                    }
                });
                xhr.open('POST', this.access_token_url, true);
                xhr.send(data);
            }
        },
        
        /**
         * Retreives the authorization token from Chrome Storage.
         */
        getToken: function() {
            chrome.storage.local.get("token", function(result) {
                return result.token
            });
        },

        /**
         * Clears the authorization token from the Chrome storage.
         */
        clearToken: function() {
            chrome.storage.local.remove("token", function() {
                console.log("Token Cleared")
            });
        }
    }
})();
