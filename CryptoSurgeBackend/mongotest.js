const config = require('./config/mongo.json');
const { MongoClient, ServerApiVersion, Timestamp } = require('mongodb');
const client = new MongoClient('mongodb+srv://'+config.host+'/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName='+config.cluster, {
  tlsCertificateKeyFile: config.credentials,
  serverApi: ServerApiVersion.v1
});

async function run() {
  try {
    await client.connect();
    const database = client.db('hub_fundamental_analysis');
    const collection = database.collection(config.posts_feedback);
    const docCount = await collection.countDocuments({});


    //Add schema validation for feedback
    // await database.command({
    //   collMod: config.news_feedback,
    //   validator: {
    //     $jsonSchema: {
    //       bsonType: "object",
    //       required: ["user_id", "news_id", "feedback_type", "created_at"],
    //       properties: {
    //         _id: {
    //           bsonType: "objectId",
    //           description: "must be an ObjectId and is required"
    //         },
    //         user_id: {
    //           bsonType: "int",
    //           description: "must be an int and is required"
    //         },
    //         news_id: {
    //           bsonType: "int",
    //           description: "must be an int and is required"
    //         },
    //         feedback_type: {
    //           bsonType: "bool",
    //           description: "must be a boolean and is required"
    //         },
    //         created_at: {
    //           bsonType: "date",
    //           description: "must be a date and is required"
    //         }
    //       }
    //     }
    //   },

    //   validationLevel: "strict",
    //   validationAction: "error"
    // });



   // Add schema validation for posts
    // await database.command({
    //     collMod: 'posts_financial_statements',
    //     validator: {
    //         $jsonSchema: {
    //             bsonType: 'object',
    //             required: ['id', 'user', 'title', 'body', 'created'],
    //             properties: {
    //                 id: {
    //                     bsonType: 'int',
    //                     description: 'must be an int and is required'
    //                 },
    //                 user: {
    //                     bsonType: 'int',
    //                     description: 'must be a string and is required'
    //                 },
    //                 title: {
    //                     bsonType: 'string',
    //                     description: 'must be a string and is required'
    //                 },
    //                 body: {
    //                     bsonType: 'string',
    //                     description: 'must be a string and is required'
    //                 },
    //                 created: {
    //                     bsonType: 'date',
    //                     description: 'must be a date and is required'
    //                 }
    //             }
    //         }
    //     },
    //     validationLevel: 'strict',
    //     validationAction: 'error'
    // });



//     console.log(docCount);
//     const cursor = collection.find();
//     await cursor.forEach(doc => {
//       console.log(doc.post_id);
//     });




  } finally {
    await client.close();
  }
}


run().catch(console.dir);

