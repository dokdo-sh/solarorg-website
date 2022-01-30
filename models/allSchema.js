/***
*
* Solar Website Models
*
**/

module.exports = function(mongoose) {

	const Schema = mongoose.Schema;
	const ObjectId = Schema.Types.ObjectId;
	const Mixed = Schema.Types.Mixed;

	const decimal2JSON = (v, i, prev) => {
	  if (v !== null && typeof v === 'object') {
		if (v.constructor.name === 'Decimal128')
		  prev[i] = v.toString();
		else
		  Object.entries(v).forEach(([key, value]) => decimal2JSON(value, key, prev ? prev[i] : v));
	  }
	};
	
    const BlogPostSchema = new Schema({
		user: {
			type: ObjectId,
			ref: 'user',
			index: true,
			required: true
		},
		title: {
			type: String,
			default: ''
		},
		tags: {
			type: String,
			default: ''
		},
		headerImage: {
			type: String,
			default: ''
		},
		body: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: ''
		}
	}, { timestamps: true, collation: { locale: 'en_US', strength: 2 },
		toJSON: {
		  transform: (doc, ret) => {
			decimal2JSON(ret);
			return ret;
		  }
		}
	});
	
    const LoginHistorySchema = new Schema({
		user: {
			type: ObjectId,
			ref: 'user',
			index: true,
			required: true
		},
		ipAddress: {
			type: String,
			default: ''
		},
		sessionId: {
			type: String,
			default: ''
		},
		userAgent: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: ''
		}
	}, { timestamps: true, collation: { locale: 'en_US', strength: 2 },
		toJSON: {
		  transform: (doc, ret) => {
			decimal2JSON(ret);
			return ret;
		  }
		}
	});

    const UserSchema = new Schema({
		displayName: {
			type: String,
			default: ''
		},
		username: {
			type: String,
			default: '',
			index: true,
			unique: true
		},
		password: {
			type: String,
			default: ''
		},
		twoFactorSecret: {
			type: String,
			default: ''
		},
		lastLoginAt: {
			type: Number,
			default: 0
		},
		ipLastLogin: {
			type: String,
			default: ''
		},
		isActive: {
			type: Boolean,
			default: true
		}
	}, { timestamps: true, collation: { locale: 'en_US', strength: 2 },
		toJSON: {
		  transform: (doc, ret) => {
			decimal2JSON(ret);
			return ret;
		  }
		}
	});
	
	var models = {
      blogPost : mongoose.model('blogPost', BlogPostSchema),
      loginHistory : mongoose.model('loginHistory', LoginHistorySchema),
      user : mongoose.model('user', UserSchema),
    };
    
    return models;
    
}