const { getConnection, releaseConnection } = require('../util/mongo');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// util/mongo.js creates connection with config.host+config.cluster+config.credentials, 
// and this import is just for config.database and config.collection
const config = require('../config/mongo.json');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = class newsfeedback {
    constructor(user_id, news_id, feedback_type) {
        this.user_id = user_id;
        this.news_id = news_id;
        this.feedback_type = feedback_type;
    }
    static async fetchAll() {
        // RAW DATA :
        // ----------
        // let client;
        // try {
        //     client = await getConnection();
        //     const database = client.db(config.database);
        //     const collection = database.collection(config.news_feedback);
        //     const result = await collection.find().toArray();
        //     return result;
        // } finally {
        //     if (client) {
        //         releaseConnection(client);
        //     }
        // }


        // grouped by news_id and counted the $feedback_type=false and $feedback_type=true answer :
        let client;
        try {
            client = await getConnection();
            const database = client.db(config.database);
            const collection = database.collection(config.news_feedback);
            const result = await collection.aggregate([
                {
                    $group: {
                        _id: "$news_id",
                        feedback_type_false_count: {
                            $sum: { $cond: [{ $eq: ["$feedback_type", false] }, 1, 0] }
                        },
                        feedback_type_true_count: {
                            $sum: { $cond: [{ $eq: ["$feedback_type", true] }, 1, 0] }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        news_id: "$_id",
                        feedback_type_false_count: 1,
                        feedback_type_true_count: 1
                    }
                }
            ]).toArray();
            return result;
        } finally {
            if (client) {
                releaseConnection(client);
            }
        }
    }
    static async fetchSpecific(user_id) {
        let client;
        try {
            client = await getConnection();
            const database = client.db(config.database);
            const collection = database.collection(config.news_feedback);
            const result = await collection.find({
                user_id: parseInt(user_id)
            }).toArray();
            return result;
        } finally {
            if (client) {
                releaseConnection(client);
            }
        }
    }
    static async save(feedback) {
        let intValue = feedback.feedback_type;
        let boolValue;
        if (intValue === 0) {
            boolValue = false;
        } else if (intValue === 1) {
            boolValue = true;
        }
        let client;
        try {
            client = await getConnection();
            const database = client.db(config.database);
            const collection = database.collection(config.news_feedback);
            const result = await collection.insertOne({
                user_id: feedback.user_id,
                news_id: feedback.news_id,
                feedback_type: boolValue,
                created_at: new Date()
            });
            return result.insertedId;
        } finally {
            if (client) {
                releaseConnection(client);
            }
        }
    }
    static async delete(feedback) {
	  let client;
	  try {
	    client = await getConnection();
	    const database = client.db(config.database);
	    const collection = database.collection(config.news_feedback);
	    const result = await collection.deleteOne({ user_id: feedback.user_id, news_id: feedback.news_id });
	    return result.deletedCount;
	  } finally {
	    if (client) {
	      releaseConnection(client);
	    }
	  }
    }
};