import { Card } from 'primereact/card';
import { useRouteError } from 'react-router-dom';

type RouteError = {
  status: number;
  statusText: string;
  internal: boolean;
  data: string;
  error: Error;
};

export default function ErrorBoundary() {
  const error = useRouteError() as RouteError;
  document.title = `${error.status} ${error.statusText}`;
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card title="Error" subTitle={error.status}>
        <p>{error.data ?? 'Unknown error'}</p>
      </Card>
    </div>
  );
}
