import { lazy } from 'react';

const Reports = lazy(() =>
  import('./reports' /* webpackChunkName: "channels" */)
);

export default Reports;
