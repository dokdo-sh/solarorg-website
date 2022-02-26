const express = require('express');
const router = express.Router();
const { encrypt, decrypt } = require('../helpers/cryptoFunctions');
const googleAuth = require('google_authenticator').authenticator;
const bcrypt = require('bcryptjs');
const fs = require('fs');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { convert } = require('html-to-text');
const Feed = require('feed').Feed;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET about pages */

router.get('/about-solar', function(req, res, next) {
    res.render('about/about-solar', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/roadmap', function(req, res, next) {
    res.render('about/roadmap', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/whitepaper', function(req, res, next) {
    res.render('about/whitepaper', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});
/*
router.get('/faq', function(req, res, next) {
    res.render('about/faq', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});*/

router.get('/privacy-policy', function(req, res, next) {
    res.render('about/privacy-policy', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET app pages */

router.get('/desktop-wallet', function(req, res, next) {
    res.render('apps/desktop-wallet', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});
/*
router.get('/mobile-wallet', function(req, res, next) {
    res.render('apps/mobile-wallet', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});*/
/*
router.get('/web-wallet', function(req, res, next) {
    res.render('apps/web-wallet', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});
*/
/* GET blockchain pages */

router.get('/staking', function(req, res, next) {
    res.render('blockchain/staking', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/dev-docs', function(req, res, next) {
    res.render('blockchain/dev-docs', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

router.get('/swap-details', function(req, res, next) {
    res.render('blockchain/swap-details', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET community page */

router.get('/community', function(req, res, next) {
    res.render('community', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id });
});

/* GET blog page */

router.get('/login', function(req, res, next) {

    if (req.session.user) {

        res.redirect('/account');

    } else {

        res.render('login', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id, messages: req.flash() });

    }

});


/* POST login page. */
router.post('/login', async function(req, res, next) {

    var db = req.app.get('db');

    var iniConfig = req.app.get('iniConfig');

    var username = req.body.username || "";
    var password = req.body.password || "";
    var twofactor = req.body.twofactor || "";

    if (username != '' && password != '' && twofactor != '') {

        var user = await db['user'].findOne({ username: username });

        if (!user) {
            req.flash('error', 'Login Incorrect')
            res.redirect('/login');
        } else {

            var checkGoogleAuth = new googleAuth();


            var validpass = bcrypt.compareSync(password, user.password);
            var decryptedsecret = decrypt(JSON.parse(user.twoFactorSecret), iniConfig.crypt_secret);

            var tokenValidates = checkGoogleAuth.verifyCode(decryptedsecret, twofactor);


            if (validpass == false || tokenValidates == false) {
                req.flash('error', 'Login Incorrect')
                res.redirect('/login');
            } else {

                await db['user'].updateOne({ _id: user._id }, { lastlogin: Date.now() });

                req.session.user = user;
                req.flash('notice', 'Login Successful')
                res.redirect('/addblog');

            }

        }

    } else {

        req.flash('error', 'Empty Login Provided')
        res.redirect('/login');

    }

});


router.get('/logout', function(req, res, next) {

    req.session.user = null;
    req.flash('notice', 'You have been logged out')
    res.redirect('/login');

});

router.get('/addblog', function(req, res, next) {

    if (req.session.user == null) {
        req.flash('notice', 'Please log in first')
        res.redirect('/login');
    } else {



        res.render('addblog', { title: 'Solar', csrfToken: req.csrfToken(), sessionId: req.session.id, messages: req.flash() });

    }

});

router.post('/addblog', upload.single('headerimage'), async function(req, res, next) {

    if (req.session.user == null) {
        req.flash('notice', 'Please log in first')
        res.redirect('/login');
    } else {

        var db = req.app.get('db');

        var title = req.body.title;
        var tags = req.body.tags[1];
        var body = req.body.body;

        var img = fs.readFileSync(req.file.path);
        var encode_img = img.toString('base64');
        var final_img = {
            contentType: req.file.mimetype,
            image: encode_img
        };

        var blogRecord = {
            user: req.session.user._id,
            title: title,
            tags: tags,
            headerImage: JSON.stringify(final_img),
            body: body,
            status: 'Active'
        };

        await db['blogPost'].create(blogRecord);

        req.flash('notice', 'Blog Entry Added')
        res.redirect('/addblog');

    }

});

router.get('/blog', async function(req, res, next) {

    var db = req.app.get('db');

    var limit = 25;
    if (req.query.limit) limit = req.query.limit;

    var skip = 0;
    if (req.query.skip) skip = req.query.skip;

    var blogPosts = await db['blogPost'].find({ status: 'Active' }).populate("user").select("title tags body user createdAt").sort({ createdAt: -1 }).skip(skip).limit(limit);

    var newPosts = [];

    for (let i = 0; i < blogPosts.length; i++) {

        let postInfo = blogPosts[i];

        let textBody = convert(postInfo.body);

        let thisPost = {
            id: postInfo._id,
            title: postInfo.title,
            tags: postInfo.tags,
            body: textBody.substring(0, 200),
            user: postInfo.user.displayName,
            postDate: new Date(postInfo.createdAt).toLocaleString()
        };

        newPosts.push(thisPost);

    }

    res.render('blog', { title: 'Solar Blog', csrfToken: req.csrfToken(), sessionId: req.session.id, messages: req.flash(), blogPosts: newPosts });

});

router.get('/blog/:blogid', async function(req, res, next) {

    var db = req.app.get('db');

    var blogid = req.params.blogid;

    var blogPost = await db['blogPost'].findOne({ _id: blogid }).populate("user").select("title headerImage tags body user createdAt");

    var blogItem = {};

    if (blogPost) {

        var image = {};
        try {
            image = JSON.parse(blogPost.headerImage);
        } catch (e) {

        }

        var headerimage = "";

        if (image.image != '') {
            try {
                headerimage = "data:" + image.contentType + ";base64," + image.image;
            } catch (e) {

            }
        }
        blogItem = {
            id: blogPost._id,
            title: blogPost.title,
            tags: blogPost.tags,
            body: blogPost.body,
            headerimage: headerimage,
            user: blogPost.user.displayName,
            postDate: new Date(blogPost.createdAt).toLocaleString()
        };

    }

    res.render('blogitem', { title: 'Solar Blog', csrfToken: req.csrfToken(), sessionId: req.session.id, messages: req.flash(), blogItem: blogItem });

});

router.get('/rss', async function(req, res, next) {

    var db = req.app.get('db');

    const feed = new Feed({
        title: "Solar News Feed",
        description: "News feed for the Solar project",
        id: "http://solar.org/",
        link: "http://solar.org/",
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: "http://solar.org/assets/images/logo/logo2.png",
        favicon: "http://solar.org/assets/images/favicon.png",
        copyright: "All rights reserved 2022, Solar",
        updated: new Date(), // optional, default = today
        generator: "Solar Feed", // optional, default = 'Feed for Node.js'
        feedLinks: {
            rss: "https://solar.org/rss",
            json: "https://solar.org/json"
        },
        author: {
            name: "Solar",
            email: "blog@solar.org",
            link: "https://solar.org/blog"
        }
    });

    var posts = await db['blogPost'].find({ status: 'Active' }).populate('user').sort({ createdAt: -1 }).limit(50);

    for (let i = 0; i < posts.length; i++) {

        var thispost = posts[i];

        var textBody = convert(thispost.body);

        var image = {};
        try {
            image = JSON.parse(thispost.headerImage);
        } catch (e) {

        }

        var headerimage = "";

        if (image.image != '') {
            try {
                headerimage = "data:" + image.contentType + ";base64," + image.image;
            } catch (e) {

            }
        }

        feed.addItem({
            title: thispost.title,
            id: thispost._id,
            link: "https://solar.org/blog/" + thispost._id,
            description: textBody.substr(0, 100),
            content: thispost.body,
            author: [{
                name: thispost.user.displayName
            }],
            date: new Date(thispost.createdAt),
            image: headerimage
        });

    }

    res.header("Content-Type", "application/xml");
    res.status(200).send(feed.rss2());


});

router.get('/json', async function(req, res, next) {

    var db = req.app.get('db');


    const feed = new Feed({
        title: "Solar News Feed",
        description: "News feed for the Solar project",
        id: "http://solar.org/",
        link: "http://solar.org/",
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: "http://solar.org/assets/images/logo/logo2.png",
        favicon: "http://solar.org/assets/images/favicon.png",
        copyright: "All rights reserved 2022, Solar",
        updated: new Date(), // optional, default = today
        generator: "Solar Feed", // optional, default = 'Feed for Node.js'
        feedLinks: {
            rss: "https://solar.org/rss",
            json: "https://solar.org/json"
        },
        author: {
            name: "Solar",
            email: "blog@solar.org",
            link: "https://solar.org/blog"
        }
    });

    var posts = await db['blogPost'].find({ status: 'Active' }).populate('user').sort({ createdAt: -1 }).limit(50);

    for (let i = 0; i < posts.length; i++) {

        var thispost = posts[i];

        var textBody = convert(thispost.body);

        var image = {};
        try {
            image = JSON.parse(thispost.headerImage);
        } catch (e) {

        }

        var headerimage = "";

        if (image.image != '') {
            try {
                headerimage = "data:" + image.contentType + ";base64," + image.image;
            } catch (e) {

            }
        }

        feed.addItem({
            title: thispost.title,
            id: thispost._id,
            link: "https://solar.org/blog/" + thispost._id,
            description: textBody.substr(0, 100),
            content: thispost.body,
            author: [{
                name: thispost.user.displayName
            }],
            date: new Date(thispost.createdAt),
            image: headerimage
        });

    }

    res.header("Content-Type", "application/json");
    res.status(200).send(feed.json1());

});


module.exports = router;