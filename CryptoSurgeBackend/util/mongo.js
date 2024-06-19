// const { MongoClient, ServerApiVersion, Timestamp } = require('mongodb');
// const config = require('../config/mongo.json');

// let pool = [];
// const maxPoolSize = 10;

// async function createConnection() {
// 	const client = new MongoClient('mongodb+srv://'+config.host+'/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName='+config.cluster, {
// 		tlsCertificateKeyFile: config.credentials,
// 		serverApi: ServerApiVersion.v1
// 	});
// 	await client.connect();
// 	return client;
// }

// async function getConnection() {
//   if (pool.length < maxPoolSize) {
//     const client = await createConnection();
//     pool.push(client);
//     return client;
//   } else {
//     return pool.find(client => client.isConnected());
//   }
// }

// async function releaseConnection(client) {
//   // Reset the client state (if needed) before returning it to the pool
//   await client.close();
// }

// module.exports = { getConnection, releaseConnection };




const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config/mongo.json');

let pool = [];
const maxPoolSize = 20;

async function createConnection() {
    const client = new MongoClient(`mongodb+srv://${config.host}/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=${config.cluster}`, {
        tlsCertificateKeyFile: config.credentials,
        serverApi: ServerApiVersion.v1,
    });
    await client.connect();
    // console.log('New MongoDB connection created.');
    return client;
}

async function getConnection() {
    for (let client of pool) {
        if (client.topology.isConnected()) {
            return client;
        }
    }
    if (pool.length < maxPoolSize) {
        const client = await createConnection();
        pool.push(client);
        return client;
    } else {
        throw new Error('No available connections and connection pool limit reached');
    }
}

async function releaseConnection(client) {
    const index = pool.indexOf(client);
    if (index > -1) {
        pool.splice(index, 1);
    }
    await client.close();
    // console.log('Connection closed and removed from pool.');
}

process.on('exit', () => {
    pool.forEach(client => client.close());
});

process.on('SIGINT', () => {
    pool.forEach(client => client.close());
    process.exit();
});

module.exports = { getConnection, releaseConnection };
