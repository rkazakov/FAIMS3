/*
 * Copyright 2021 Macquarie University
 *
 * Licensed under the Apache License Version 2.0 (the, "License");
 * you may not use, this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND either express or implied.
 * See, the License, for the specific language governing permissions and
 * limitations under the License.
 *
 * Filename: record-create.tsx
 * Description:
 *   TODO
 */

import React, {useContext, useState, useEffect} from 'react';
import {Redirect, useHistory, useParams, useLocation} from 'react-router-dom';

import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from '@material-ui/core';

import {ActionType} from '../../actions';
import * as ROUTES from '../../constants/routes';
import {store} from '../../store';

import {generateFAIMSDataID} from '../../data_storage';
import {getProjectInfo, listenProjectInfo} from '../../databaseAccess';
import {ProjectID, RecordID} from '../../datamodel/core';
import {ProjectUIModel, ProjectInformation} from '../../datamodel/ui';
import {
  getUiSpecForProject,
  getReturnedTypesForViewSet,
} from '../../uiSpecification';
import {newStagedData} from '../../sync/draft-storage';

import Breadcrumbs from '../components/ui/breadcrumbs';
import RecordForm from '../components/record/form';
import {useEventedPromise, constantArgsShared} from '../pouchHook';

interface DraftCreateProps {
  project_id: ProjectID;
  type_name: string;
}

function DraftCreate(props: DraftCreateProps) {
  const {project_id, type_name} = props;

  const {dispatch} = useContext(store);
  const history = useHistory();

  const [error, setError] = useState(null as null | {});
  const [draft_id, setDraft_id] = useState(null as null | string);
  const [uiSpec, setUISpec] = useState(null as null | ProjectUIModel);

  useEffect(() => {
    getUiSpecForProject(project_id).then(setUISpec, setError);
  }, [project_id]);

  useEffect(() => {
    if (uiSpec !== null) {
      const field_types = getReturnedTypesForViewSet(uiSpec, type_name);
      newStagedData(project_id, null, type_name, field_types).then(
        setDraft_id,
        setError
      );
    } else {
      setDraft_id(null);
    }
  }, [project_id, uiSpec]);

  if (error !== null) {
    dispatch({
      type: ActionType.ADD_ALERT,
      payload: {
        message: 'Could not create a draft: ' + error.toString(),
        severity: 'warning',
      },
    });
    history.goBack();
    return <React.Fragment />;
  } else if (draft_id === null) {
    // Creating new draft loading
    return <CircularProgress size={12} thickness={4} />;
  } else {
    return (
      <Redirect
        to={
          ROUTES.PROJECT +
          project_id +
          ROUTES.RECORD_CREATE +
          type_name +
          ROUTES.RECORD_DRAFT +
          draft_id +
          useLocation().search
        }
      />
    );
  }
}

interface DraftEditProps {
  project_id: ProjectID;
  type_name: string;
  draft_id: string;
  project_info: ProjectInformation | null;
  record_id: RecordID;
}

function DraftEdit(props: DraftEditProps) {
  const {project_id, type_name, draft_id, project_info, record_id} = props;
  const {dispatch} = useContext(store);
  const history = useHistory();

  const [uiSpec, setUISpec] = useState(null as null | ProjectUIModel);
  const [error, setError] = useState(null as null | {});

  useEffect(() => {
    getUiSpecForProject(project_id).then(setUISpec, setError);
  }, [project_id]);

  if (error !== null) {
    dispatch({
      type: ActionType.ADD_ALERT,
      payload: {
        message: 'Could not edit draft: ' + error.toString(),
        severity: 'warning',
      },
    });
    history.goBack();
    return <React.Fragment />;
  } else if (uiSpec === null) {
    // Loading
    return <CircularProgress size={12} thickness={4} />;
  } else {
    // Loaded, variant picked, show form:
    return (
      <React.Fragment>
        <Box mb={2}>
          <Typography variant={'h2'} component={'h1'}>
            Record Record
          </Typography>
          <Typography variant={'subtitle1'} gutterBottom>
            Add an record for the{' '}
            {project_info !== null ? project_info.name : project_id} project.
          </Typography>
        </Box>
        <Paper square>
          <Box p={3}>
            <RecordForm
              project_id={project_id}
              draft_id={draft_id}
              type={type_name}
              ui_specification={uiSpec}
              record_id={record_id}
            />
          </Box>
        </Paper>
      </React.Fragment>
    );
  }
}

export default function RecordCreate() {
  const {project_id, type_name, draft_id} = useParams<{
    project_id: ProjectID;
    type_name: string;
    draft_id?: string;
  }>();

  let project_info: ProjectInformation | null;
  try {
    project_info = useEventedPromise(
      getProjectInfo,
      constantArgsShared(listenProjectInfo, project_id),
      false,
      [project_id],
      project_id
    ).expect();
  } catch (err: any) {
    if (err.message !== 'missing') {
      throw err;
    } else {
      return <Redirect to="/404" />;
    }
  }

  const breadcrumbs = [
    {link: ROUTES.HOME, title: 'Home'},
    {link: ROUTES.PROJECT_LIST, title: 'Notebooks'},
    {
      link: ROUTES.PROJECT + project_id,
      title: project_info !== null ? project_info.name : project_id,
    },
    {title: 'Edit Draft'},
  ];

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Breadcrumbs data={breadcrumbs} />
        {draft_id === undefined ? (
          <DraftCreate project_id={project_id} type_name={type_name} />
        ) : (
          <DraftEdit
            project_info={project_info}
            project_id={project_id}
            type_name={type_name}
            draft_id={draft_id}
            record_id={generateFAIMSDataID()}
          />
        )}
      </Container>
    </React.Fragment>
  );
}
