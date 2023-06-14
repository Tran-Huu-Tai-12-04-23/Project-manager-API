const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  process.env.MONGOOSE_URL ||
  "mongodb+srv://huutai:tai2k300@cluster0.xbemtzm.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    const database = client.db("managerProject");

    return database;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  } finally {
    // Don't close the client here, leave it open for the lifetime of your application
  }
}

module.exports = { connect };
