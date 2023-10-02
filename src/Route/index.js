const user = require('./user');
const project = require('./project');
const task = require('./task');
const note = require('./note');
const column = require('./column');
const link = require('./link');
const router = require('./user');

const applyRoute = (app) => {
    app.use(
        '/',
        router.get('/', (req, res) => {
            return res.json('Start with api');
        }),
    );
    app.use('/user', user);
    app.use('/project', project);
    app.use('/task', task);
    app.use('/note', note);
    app.use('/col', column);
    app.use('/link', link);
};

module.exports = applyRoute;
