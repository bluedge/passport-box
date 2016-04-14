var OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , util = require('util');
  
/**
 * `Strategy` constructor.
 *
 * The BOX authentication strategy authenticates requests by delegating to
 * BOX using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientId`      	your Box application's client id
 *   - `clientSecret`  	your Box application's client secret
 *   - `callbackURL`   	URL to which Box will redirect the user after granting authorization (optional of set in your Box Application
 *   - `grant_type`		Must be authorization_code
 *
 * Examples:
 *
 *     passport.use(new BoxStrategy({
 *         client_id: '123-456-789',
 *         client_secret: 'shhh-its-a-secret'
 *         redirect_uri: 'https://www.example.net/auth/box/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
	options = options || {};
	// http://developers.box.com/oauth/
	options.authorizationURL = options.authorizationURL || 'https://api.box.com/oauth2/authorize';
	options.tokenURL = options.tokenURL || 'https://api.box.com/oauth2/token';
	options.grant_type = options.grant_type || 'authorization_code';
	
	OAuth2Strategy.call(this, options, verify);
	this.name = 'box';
	this._oauth2._useAuthorizationHeaderForGET = true;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from box.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `box`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://api.box.com/2.0/users/me', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'box' };
      profile.id = json.id;
      profile.name = json.name;
      profile.login = json.login;
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;