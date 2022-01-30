const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const googleAuth = require('google_authenticator').authenticator;
const fs = require('fs');
const ini = require('ini');
const crypto = require('crypto');
const base32 = require('hi-base32');
const { encrypt, decrypt } = require('./helpers/cryptoFunctions');


const iniConfig = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

if (process.argv.length <= 3) {
    console.log("Usage: " + __filename + " {username} {displayName}");
    process.exit(-1);
}

createUser(process.argv[2], process.argv[3]);


async function createUser(username, displayName) {

	await mongoose.connect(iniConfig.mongo_connect);
	var db = require('./models/allSchema')(mongoose);

	var randomPassword = Math.random().toString(36).slice(-10);

	var secretdata = Math.random().toString(36).slice(-8);

	var twofasecret = base32.encode(crypto.createHash('md5').update(secretdata).digest('hex'), true).substr(0,16);

	var encryptedtwofactor = JSON.stringify(encrypt(twofasecret, iniConfig.crypt_secret));

	var salt = await bcrypt.genSalt(10);
	var hash = await bcrypt.hash(randomPassword, salt);
	
	var newUser =	{
		displayName: displayName,
		username: username,
		password: hash,
		twoFactorSecret: encryptedtwofactor,
		lastLoginAt: 0,
		ipLastLogin: '',
		isActive: true
	};
	
	await db['user'].create(newUser);
	
	console.log("User Created!");
	console.log("Username: " + username);
	console.log("Display Name: " + displayName);
	console.log("Password: " + randomPassword);
	console.log("Two Factor Secret: " + twofasecret);

	process.exit();
	
}


