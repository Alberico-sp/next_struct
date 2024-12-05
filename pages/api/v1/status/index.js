import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersionResult.rows[0].server_version;

  const dbMaxConnResult = await database.query("SHOW max_connections;");
  const dbMaxConnValue = dbMaxConnResult.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;
  const dbOpenedResult = await database.query({
    text: "select count(*)::int count from pg_stat_activity where datname= $1;",
    values: [dbName],
  });

  const dbOpenedValue = dbOpenedResult.rows[0].count;

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: parseInt(dbMaxConnValue),
        opened_connections: dbOpenedValue,
      },
    },
  });
}

export default status;
