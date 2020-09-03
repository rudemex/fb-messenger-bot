const appRouter = (app, version) => {

    require('./health')(app);
    require('./message')(app);
    require('./bot')(app);

    app.get("/", (req, res) => {
        res.status(200).send(`Welcome to server bot - version ${encodeURI(version)}`);
    });
}

module.exports = appRouter;