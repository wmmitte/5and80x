/**
 *
 * @author AmosT <amostankoano@gmail.com>
 * @since v1.0
 * @version 1.0
 *@date 2018-04-01
 *
 * Fichier de configuration générale de l'application
 *
 */

const params = {
    server: {
        adress: "localhost",
        port: 3001
    },
    database: {
        driver: "mongodb://",
        server: "localhost",
        port: 27017,
        databaseName: "dbCollections",
        user: "",
        password: ""
    },
    application: {
        name: "colMus",
        apiUrl: "/api",
        version: "v1"
    }
};

/**
 *
 * Variables de configurtions prédéfinies
 */
const config = {
    params: params,
    serverAdress: "http://" + params.server.adress + ":" + params.server.port,
    applicationEndpoint: "/" + params.application.name + params.application.apiUrl + "/" + params.application.version,
    databaseSourceName: params.database.driver + params.database.server + ":" + params.database.port + "/" + params.database.databaseName
};
    

module.exports = config;
