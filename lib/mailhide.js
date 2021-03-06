// Generated by CoffeeScript 1.4.0

/*
 * Provides easy use of the reCAPTCHA Mailhide API.
 * 
 * See:
 * http://www.google.com/recaptcha/mailhide/
 * https://developers.google.com/recaptcha/docs/mailhideapi
*/


(function() {
  var Mailhide, crypto, fs, querystring;

  fs = require('fs');

  crypto = require('crypto');

  querystring = require('querystring');

  Mailhide = (function() {

    function Mailhide(options) {
      if (options == null) {
        options = {};
      }
      if (options.privateKeyFile != null) {
        this.privateKey = (fs.readFileSync(options.privateKeyFile, 'utf8')).slice(0, -1);
      } else if (options.privateKey != null) {
        this.privateKey = options.privateKey;
      } else {
        throw new Error('Specify privateKey or privateKeyFile');
      }
      if (options.publicKeyFile != null) {
        this.publicKey = (fs.readFileSync(options.publicKeyFile, 'utf8')).slice(0, -1);
      } else if (options.publicKey != null) {
        this.publicKey = options.publicKey;
      } else {
        throw new Error('Specify privateKey or privateKeyFile');
      }
      if (options.cipher != null) {
        this.cipher = options.cipher;
      } else {
        this.createCipher();
      }
    }

    Mailhide.prototype.createCipher = function() {
      var iv, key;
      key = new Buffer(this.privateKey, 'hex');
      iv = new Buffer('00000000000000000000000000000000', 'hex');
      return this.cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    };

    Mailhide.prototype.url = function(email, encoding) {
      var ciphered, cipheredBase64, url;
      if (encoding == null) {
        encoding = 'utf8';
      }
      ciphered = '';
      ciphered += this.cipher.update(email, encoding, 'base64');
      ciphered += this.cipher.final('base64');
      cipheredBase64 = ciphered.replace(/\+/g, '-').replace(/\//g, '_');
      url = 'http://www.google.com/recaptcha/mailhide/d?';
      url += querystring.stringify({
        k: this.publicKey,
        c: cipheredBase64
      });
      this.createCipher();
      return url;
    };

    return Mailhide;

  })();

  module.exports = Mailhide;

}).call(this);
