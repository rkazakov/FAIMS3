import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridCellParams} from '@material-ui/data-grid';
import {Typography} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';
import Link from '@material-ui/core/Link';

import {Observation} from '../../datamodel';
import * as ROUTES from '../../constants/routes';
import {listenObservationsList} from '../../databaseAccess';

type ObservationsTableProps = {
  listing_id_project_id: string;
  restrictRows: number;
  compact: boolean;
};

export default function ObservationsTable(props: ObservationsTableProps) {
  const {listing_id_project_id, compact} = props;
  const [loading, setLoading] = useState(true);
  const pouchObservationList = {};
  const [rows, setRows] = useState<Array<Observation>>([]);
  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: 'Obs ID',
      description: 'Observation ID',
      type: 'string',
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <Link
          component={RouterLink}
          to={ROUTES.getObservationRoute(
            listing_id_project_id || 'dummy',
            (params.getValue('_id') || '').toString()
          )}
        >
          {params.value}
        </Link>
      ),
    },
    {field: 'created', headerName: 'Created', type: 'dateTime', flex: 1},
    {field: 'created_by', headerName: 'Created by', type: 'string', flex: 1},
    {field: 'updated', headerName: 'Updated', type: 'dateTime', flex: 1},
    {
      field: 'updated_by',
      headerName: 'Last updated by',
      type: 'string',
      flex: 1,
    },
  ];
  useEffect(() => {
    if (listing_id_project_id === undefined) return; //dummy project
    const destroyListener = listenObservationsList(
      listing_id_project_id,
      newObservationList => {
        setLoading(false);
        Object.assign(pouchObservationList, newObservationList);
        setRows(Object.values(pouchObservationList));
      }
    );
    return destroyListener; // destroyListener called when this component unmounts.
  }, []);

  return (
    <div>
      <Typography variant="overline">Recent Observations</Typography>
      <div style={{height: compact ? 250 : 400, width: '100%'}}>
        <DataGrid
          rows={rows}
          loading={loading}
          getRowId={r => r._id}
          columns={columns}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </div>
  );
}
ObservationsTable.defaultProps = {
  compact: false,
};
