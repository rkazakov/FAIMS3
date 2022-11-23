import React, {useEffect} from 'react';
import {Box, Paper, Chip, Link, Typography, Divider} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import {NavLink} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import {
  RecordLinksComponentProps,
  PARENT_CHILD_VOCAB,
  RecordLinkProps,
} from './types';
import {RecordLinksToolbar} from './toolbars';
import {RecordID} from '../../../../datamodel/core';
import RecordRouteDisplay from '../../ui/record_link';
import {grey} from '@mui/material/colors';

interface SortedDataType {
  [key: string]: Array<RecordLinkProps>;
}
export default function RecordLinkComponent(props: RecordLinksComponentProps) {
  /***
   * Links are stored as {record:..., relation_type_vocabPair:['verb1', 'verb2'], link:{record..., section:..., field...}}
   * The relation_type_vocabPair describes the relationship between the field and the linked record. The interface will follow the rule:
   * FIELD ['verb1'] RECORD, conversely, RECORD ['verb2'] FIELD.
   * i.e.,
   * FIELD 1 is above RECORD A, conversely, RECORD A 'is below' FIELD 1: ['is above', 'is below']
   * FIELD 1 abutts RECORD A, conversely, RECORD A 'is abutted by' FIELD 1: ['abutts', 'is abutted by']
   * FIELD A 'has child' RECORD B, conversely, RECORD B 'is child of' FIELD A ['has child', 'is child of']
   * FIELD A 'is child of' RECORD B, conversely, RECORD B 'has child' FIELD A ['is child of', 'has child']
   * For the Excavation usecase;
   * Record A1 Field X is above Record B2
   * Record A1 Field X is above Record C3
   * Record B2 is below Record A1 Field X
   * Record C3 is below Record A1 Field X
   * Record B2 Field Y abutts Record C3
   * Record C3 is abutted by Record B2 Field Y
   */

  const [sortedData, setSortedData] = React.useState({
    links_to_record: [],
    links_from_record: [],
  } as SortedDataType);
  function getRowId(row: any) {
    /***
     * Provide a unique row id for each row
     */
    return (
      row.record_id +
      row.relation_type_vocabPair[0] +
      row.link.record_id +
      row.link.field_id
    );
  }
  function recordDisplay(
    current_record_id: RecordID,
    record_id: RecordID,
    type: string,
    hrid: string | number,
    route: any
  ) {
    return record_id === current_record_id ? (
      <RecordRouteDisplay>This record</RecordRouteDisplay>
    ) : (
      <RecordRouteDisplay link={route}>{type + ' ' + hrid}</RecordRouteDisplay>
    );
  }

  // split the incoming array of links by their relationship type AND the type of link relative to this record.
  // i.e, is this record on the field side or the record side of the Field <==> Record relationship. This governs
  // how the verbs behave.
  useEffect(() => {
    if (props.record_links !== null) {
      const linksFromRecord: Array<RecordLinkProps> = [];
      const linksToRecord: Array<RecordLinkProps> = [];
      props.record_links.map(l => {
        // dummyRecordLinks.map(l => {
        // const key = JSON.stringify(l.relation_type_vocabPair);
        // if (l.record_id === props.record_id) {
        //   // link to this record from another field, push to dummySortObjectToRecord
        //   // if the array hasn't been previously set, create it
        //   if (linksToRecord[key] === undefined) {
        //     linksToRecord[key] = [];
        //   }
        //   linksToRecord[key].push(l);
        // } else {
        //   if (linksFromRecord[key] === undefined) {
        //     linksFromRecord[key] = [];
        //   }
        //   linksFromRecord[key].push(l);
        // }
        if (l.record_id === props.record_id) {
          linksToRecord.push(l);
        } else {
          linksFromRecord.push(l);
        }
      });
      setSortedData({
        links_to_record: linksToRecord,
        links_from_record: linksFromRecord,
      });
    }
  }, [props.record_links]);

  if (props.record_links !== null) {
    const columns = [
      {
        field: 'record',
        headerName: 'Record',
        headerClassName: 'faims-record-link--header',
        minWidth: 200,
        flex: 0.2,
        valueGetter: (params: GridCellParams) =>
          params.row.type + ' ' + params.row.hrid,
        renderCell: (params: GridCellParams) =>
          recordDisplay(
            props.record_id,
            params.row.record_id,
            params.row.type,
            params.row.hrid,
            params.row.route
          ),
      },
      {
        field: 'relation_type_vocabPair',
        headerName: 'Relationship',
        headerClassName: 'faims-record-link--header',
        minWidth: 200,
        flex: 0.2,
        valueGetter: (params: GridCellParams) =>
          props.record_id === params.row.record_id
            ? params.value[0]
            : params.value[0],
        renderCell: (params: GridCellParams) => (
          <Chip
            label={params.value}
            component={'span'}
            size={'small'}
            color={
              PARENT_CHILD_VOCAB.includes(params.value)
                ? 'secondary'
                : 'default'
            }
          />
        ),
      },
      {
        field: 'linked_record',
        headerName: 'Linked record',
        headerClassName: 'faims-record-link--header',
        minWidth: 150,
        flex: 0.2,
        valueGetter: (params: GridCellParams) =>
          params.row.link.type + params.row.link.hrid,
        renderCell: (params: GridCellParams) =>
          recordDisplay(
            props.record_id,
            params.row.link.record_id,
            params.row.link.type,
            params.row.link.hrid,
            params.row.link.route
          ),
      },
      {
        field: 'linked_section',
        headerName: 'Section',
        headerClassName: 'faims-record-link--header',
        minWidth: 150,
        flex: 0.15,
        valueGetter: (params: GridCellParams) => params.row.link.section_label,
        renderCell: (params: GridCellParams) => (
          <Typography variant={'body2'} fontWeight={'bold'}>
            <Link
              component={NavLink}
              to={params.row.link.route}
              underline={'none'}
              onClick={() => props.handleSetSection(params.row.link.section)}
            >
              {params.value}
            </Link>
          </Typography>
        ),
      },
      {
        field: 'linked_field',
        headerName: 'Field',
        headerClassName: 'faims-record-link--header',
        minWidth: 150,
        flex: 0.15,
        valueGetter: (params: GridCellParams) => params.row.link.field_label,
        renderCell: (params: GridCellParams) => (
          <Typography variant={'body2'} fontWeight={'bold'}>
            <Link
              component={NavLink}
              to={{
                pathname: params.row.link.route,
                hash: '#' + params.row.link.field_id,
              }}
              underline={'none'}
            >
              {params.value}
            </Link>
          </Typography>
        ),
      },
      {
        field: 'lastUpdatedBy',
        headerName: 'Last Updated By',
        headerClassName: 'faims-record-link--header',
        minWidth: 300,
        flex: 0.2,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        headerClassName: 'faims-record-link--header',
        flex: 0.1,
        minWidth: 100,
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            icon={<EditIcon color={'primary'} />}
            onClick={() => {
              alert('go to record>section>field');
              console.debug(params);
            }}
            label="Edit link"
            showInMenu
          />,
        ],
      },
    ];
    return (
      <Box component={Paper} elevation={0}>
        {Object.keys(sortedData).map(linkKey => {
          const subGroup = sortedData[linkKey];
          if (subGroup.length > 0) {
            return (
              <Box sx={{p: 1}}>
                <Typography variant={'body2'} fontWeight={'bold'} gutterBottom>
                  {linkKey === 'links_to_record'
                    ? 'Links to this record'
                    : 'Links from fields in this record'}
                </Typography>
                <DataGrid
                  autoHeight
                  density={'compact'}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  columns={
                    linkKey === 'links_to_record'
                      ? [
                          {
                            field: 'record',
                            headerName: 'Record',
                            headerClassName: 'faims-record-link--header',
                            minWidth: 200,
                            flex: 0.2,
                            valueGetter: (params: GridCellParams) =>
                              params.row.type + ' ' + params.row.hrid,
                            renderCell: (params: GridCellParams) =>
                              recordDisplay(
                                props.record_id,
                                params.row.record_id,
                                params.row.type,
                                params.row.hrid,
                                params.row.route
                              ),
                          },

                          {
                            field: 'relation_type_vocabPair',
                            headerName: 'Relationship',
                            headerClassName: 'faims-record-link--header',
                            minWidth: 150,
                            flex: 0.2,
                            valueGetter: (params: GridCellParams) =>
                              params.value[0],
                          },
                          {
                            field: 'linked_field',
                            headerName: 'Field',
                            headerClassName: 'faims-record-link--header',
                            minWidth: 300,
                            flex: 0.2,
                            valueGetter: (params: GridCellParams) =>
                              params.row.link.field_label,
                            renderCell: (params: GridCellParams) => (
                              <React.Fragment>
                                {recordDisplay(
                                  props.record_id,
                                  params.row.link.record_id,
                                  params.row.link.type,
                                  params.row.link.hrid,
                                  params.row.link.route
                                )}
                                <Typography
                                  variant={'body2'}
                                  fontWeight={'bold'}
                                  component={'span'}
                                  sx={{ml: '3px'}}
                                >
                                  {params.row.link.field_label}{' '}
                                </Typography>{' '}
                                <Typography
                                  variant={'caption'}
                                  sx={{
                                    backgroundColor: grey[300],
                                    py: '2px',
                                    px: '3px',
                                    borderRadius: '3px',
                                    ml: '3px',
                                  }}
                                  fontSize={'10px'}
                                >
                                  {params.row.link.section_label}
                                </Typography>
                              </React.Fragment>
                            ),
                          },
                          {
                            field: 'lastUpdatedBy',
                            headerName: 'Last Updated By',
                            headerClassName: 'faims-record-link--header',
                            minWidth: 300,
                            flex: 0.2,
                          },
                          {
                            field: 'actions',
                            type: 'actions',
                            headerName: 'Actions',
                            headerClassName: 'faims-record-link--header',
                            minWidth: 100,
                            flex: 0.2,
                            getActions: (params: GridRowParams) => [
                              <GridActionsCellItem
                                icon={<EditIcon color={'primary'} />}
                                onClick={() => {
                                  alert('go to record>section>field');
                                  console.debug(params);
                                }}
                                label="Edit link"
                                showInMenu
                              />,
                            ],
                          },
                        ]
                      : [
                          {
                            field: 'linked_field',
                            headerName: 'Field',
                            headerClassName: 'faims-record-link--header',
                            minWidth: 150,
                            flex: 0.2,
                            valueGetter: (params: GridCellParams) =>
                              params.row.link.field_label,
                            renderCell: (params: GridCellParams) => (
                              <React.Fragment>
                                <Typography
                                  variant={'body2'}
                                  fontWeight={'bold'}
                                  component={'span'}
                                >
                                  {params.row.link.field_label}{' '}
                                </Typography>{' '}
                                <Typography
                                  variant={'caption'}
                                  sx={{
                                    backgroundColor: grey[300],
                                    py: '2px',
                                    px: '3px',
                                    borderRadius: '3px',
                                    ml: '3px',
                                  }}
                                  fontSize={'10px'}
                                >
                                  {params.row.link.section_label}
                                </Typography>
                              </React.Fragment>
                            ),
                          },
                          {
                            field: 'relation_type_vocabPair',
                            headerName: 'Relationship',
                            headerClassName: 'faims-record-link--header',
                            minWidth: 200,
                            flex: 0.2,
                            valueGetter: (params: GridCellParams) =>
                              params.value[1],
                          },
                          {
                            field: 'record',
                            headerName: 'Record',
                            headerClassName: 'faims-record-link--header',
                            minWidth: 200,
                            flex: 0.2,
                            valueGetter: (params: GridCellParams) =>
                              params.row.type + ' ' + params.row.hrid,
                            renderCell: (params: GridCellParams) =>
                              recordDisplay(
                                props.record_id,
                                params.row.record_id,
                                params.row.type,
                                params.row.hrid,
                                params.row.route
                              ),
                          },
                          {
                            field: 'lastUpdatedBy',
                            headerName: 'Last Updated By',
                            headerClassName: 'faims-record-link--header',
                            minWidth: 300,
                            flex: 0.2,
                          },
                          {
                            field: 'actions',
                            type: 'actions',
                            headerName: 'Actions',
                            headerClassName: 'faims-record-link--header',
                            flex: 0.2,
                            minWidth: 100,
                            getActions: (params: GridRowParams) => [
                              <GridActionsCellItem
                                icon={<EditIcon color={'primary'} />}
                                onClick={() => {
                                  alert('go to record>section>field');
                                  console.debug(params);
                                }}
                                label="Edit link"
                                showInMenu
                              />,
                            ],
                          },
                        ]
                  }
                  initialState={{
                    sorting: {
                      sortModel: [{field: 'lastUpdatedBy', sort: 'desc'}],
                    },
                  }}
                  rows={subGroup}
                  getRowId={getRowId}
                  components={{
                    Footer: RecordLinksToolbar,
                  }}
                  sx={
                    {
                      // borderLeft: 'none',
                      // borderRight: 'none',
                      // borderTop: 'none',
                      // '& .MuiDataGrid-columnHeaders': {
                      //   borderRadius: 0,
                      // },
                    }
                  }
                />
              </Box>
            );
          } else {
            return <></>;
          }
        })}
      </Box>
    );
  } else {
    return <Box></Box>;
  }
}
