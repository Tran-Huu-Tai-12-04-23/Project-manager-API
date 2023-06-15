const { connect } = require("../configDb");

class User {
  async findUser(condition) {
    try {
      const db = await connect();
      const collection = await db.collection("user"); // Use "this.db" to access the database connection
      const queryResult = await collection.findOne({ ...condition });
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

  async editUser(data) {
    try {
      const db = await connect();
      const collection = await db.collection("user"); // Use "this.db" to access the database connection
      const updateData = {
        $set: {
          id: data.uid,
          displayName: data.displayName,
        },
      };
      if (data.photoURL) {
        updateData.$set.photoURL = data.photoURL;
      }
      const options = {
        returnOriginal: false,
      };
      const queryResult = await collection.findOneAndUpdate(
        { email: data.email },
        updateData,
        options
      );
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
