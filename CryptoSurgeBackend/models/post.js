const config = require('../config/mongo.json');
const { getConnection, releaseConnection } = require('../util/mongo');

module.exports = class Post {
    constructor(title, body, user) {
        this.title = title;
        this.body = body;
        this.user = user;
    }
    static async fetchAll() {
        let client;
        try {
            client = await getConnection();
            const database = client.db('hub_fundamental_analysis');
            const collection = database.collection('posts_financial_statements');
            const result = await collection.find().sort({ created: -1 }).toArray();
            return result;
        } finally {
            if (client) {
                releaseConnection(client);
            }
        }
    }
    static async save(post) {
        let client;
        try {
            client = await getConnection();
            const database = client.db('hub_fundamental_analysis');
            const collection = database.collection('posts_financial_statements');
            /////////// get id to assign to post by incrementing seq ////////////
            const sequenceName = 'postId';
	        const counters_database = client.db('hub_fundamental_analysis');
	        const counters_collection = counters_database.collection('counters');
	        const counters_result = await counters_collection.findOne({ _id: sequenceName });
	        let seq;
	        if (counters_result) {
	            seq = counters_result.seq + 1;
	            await counters_collection.updateOne({ _id: sequenceName }, { $set: { seq: seq } });
	        } else {
	            seq = 1;
	            await counters_collection.insertOne({ _id: sequenceName, seq: seq });
	        }
	        //////////////////////////////////////////////////////////////////////////////
            const nextId = seq;
            const result = await collection.insertOne({
                id: nextId,
                user: Number(post.user),
                title: post.title,
                body: post.body,
                created: new Date()
            });
            return result.insertedId;
        } finally {
            if (client) {
                releaseConnection(client);
            }
        }
    }
    static async delete(post_id) {
        let client;
        try {
            
            client = await getConnection();
            const database = client.db('hub_fundamental_analysis');
            const collection = database.collection('posts_financial_statements');

            const database2= client.db(config.database);
            const collection2 = database2.collection(config.posts_feedback);

            const result = await collection.deleteOne({
                id: parseInt(post_id),
            });

            const result2 = await collection2.deleteMany({ post_id: post_id });
            return result.deletedCount;
        } finally {
            if (client) {
                releaseConnection(client);
            }
        }
    }
};
