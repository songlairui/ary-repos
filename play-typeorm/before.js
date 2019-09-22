const { createConnection } = require("typeorm");

async function init(entities = []) {
    return await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "rvdata",
        database: "ary_repos",
        entities
    });
}

module.exports = init

