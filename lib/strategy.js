var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


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
 *   - `clientId`     your Box application's client id
 *   - `clientSecret` your Box application's client secret
 *   - `callbackURL`  URL to which Box will redirect the user after granting authorization (optional of set in your Box Application
 *   - `grant_type`   Must be authorization_code
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
  this.name = options.name || 'box';
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
 *   - `provider`    // always set to `box`
 *   - `id`          // box's user id
 *   - `displayName` // box user's full name
 *   - `name`        // name parts
 *   - `emails`      // box login email
 *   - `photos`      // box avatar
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://api.box.com/2.0/users/me', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body)
        , nameParts = json.name.split(' ')
        , profile = { };

      // portable contacts schema
      // http://passportjs.org/guide/profile/
      profile.provider = 'box';
      profile.id = json.id;
      profile.displayName = json.name;
      profile.name = {
        givenName: nameParts.shift(),
        familyName: nameParts.pop(),
        middleName: nameParts.join(' ')
      };
      profile.emails = [ { value: json.login } ];
      profile.photos = [ { value: json.avatar_url } ];

      // passport-box extra
      profile.login = json.login;

      // passport extras
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
