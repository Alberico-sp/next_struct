import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBady = await response.json();
  return responseBady;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAt />
      <DbStatus />
    </>
  );
}

function UpdateAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updateAtText = "Carregando..";

  if (!isLoading && data) {
    updateAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updateAtText}</div>;
}

function DbStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let dbStatusInfo = "Carregando...";

  if (!isLoading && data) {
    dbStatusInfo = (
      <>
        <div> Versão: {data.dependencies.database.version} </div>
        <div>
          {" "}
          Conexões abertas: {data.dependencies.database.opened_connections}{" "}
        </div>
        <div>
          {" "}
          Conexões máximas: {data.dependencies.database.max_connections}{" "}
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      <div>{dbStatusInfo}</div>
    </>
  );
}
