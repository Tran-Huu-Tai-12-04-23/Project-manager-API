const { connect } = require("../configDb");

class User {
  async findUsers() {
    try {
      const db = await connect();
      const collection = await db.collection("user"); // Use "this.db" to access the database connection
      const queryResult = await collection.find({}).toArray();
      return queryResult;
    } catch (error) {
      console.error("Error querying users:", error);
      throw error;
    }
  }

  async createNewUser(user) {
    try {
      const db = await connect();
      const collection = await db.collection("user"); // Use "this.db" to access the database connection
      const queryResult = await collection.insertOne({ ...user });
      return queryResult;
    } catch (error) {
      console.error("Error querying users:", error);
      throw error;
    }
  }

  async checkEmailAlready(email) {
    try {
      const db = await connect();
      const collection = await db.collection("user"); // Use "this.db" to access the database connection
      const queryResult = await collection.countDocuments({ email: email });
      if (queryResult) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error querying users:", error);
      throw error;
    }
  }

  async checkUserNameAlready(username) {
    try {
      const db = await connect();
      const collection = await db.collection("user"); // Use "this.db" to access the database connection
      const queryResult = await collection.countDocuments({
        username: username,
      });
      if (queryResult) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error querying users:", error);
      throw error;
    }
  }
}

module.exports = new User();
