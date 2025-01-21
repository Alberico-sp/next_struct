import database from "infra/database.js";
import { InternalServerError } from "infra/errors.js";

async function status(request, response) {
  try {
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
  } catch (error) {
    const publicErrorObj = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dentro do catch do controller:");
    console.error(publicErrorObj);

    response.status(500).json({ publicErrorObj });
  }
}

export default status;
