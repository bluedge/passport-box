# Passport-box

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [box](http://box.com/) using the OAuth 2.0 API.

This module lets you authenticate using box, in your Node.js applications.  
By plugging into Passport, box
authentication can be easily and unobtrusively integrated into any application or
framework that supports [Connect](http://www.senchalabs.org/connect/)-style
middleware, including [Express](http://expressjs.com/).

EXPRESS 4.x : Example is now compatible with expressjs 4

[![Build Status](https://travis-ci.org/bluedge/passport-box.png?branch=master)](https://travis-ci.org/bluedge/passport-box)


## Install

    $ npm install passport-box

## Usage

#### Configure Strategy

The box authentication strategy authenticates users using a box
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new BoxStrategy({
        clientID: BOX_CLIENT_ID,
        clientSecret: BOX_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/box/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ boxId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'box'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/box',
      passport.authenticate('box'));

    app.get('/auth/box/callback', 
      passport.authenticate('box', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example with Express 4, refer to the [login example](https://github.com/bluedge/passport-box/tree/master/examples/login).


## Credits

  - [Nicolas Alessandra](http://github.com/bluedge)


## Thanks

  - [Jared Hanson](http://github.com/jaredhanson)


## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Nicolas Alessandra <[http://bluedge.co.uk/](http://bluedge.co.uk/)>
