import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBady = await response.json();
      expect(responseBady.updated_at).toBeDefined();

      const parseUpdatedAt = new Date(responseBady.updated_at).toISOString();
      expect(responseBady.updated_at).toEqual(parseUpdatedAt);

      expect(responseBady.dependencies.database.version).toEqual("16.0");
      expect(responseBady.dependencies.database.max_connections).toEqual(100);
      expect(responseBady.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
