const fs = require('fs');
class Helper {
    remove(filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('File removed successfully');
          });
    }
}

module.exports = new Helper();