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
 * Filename: project.tsx
 * Description:
 *   TODO
 */

import React from 'react';
import {useParams, Redirect} from 'react-router-dom';
import {Link as RouterLink} from 'react-router-dom';

import {Box, Button, Container, Typography, Paper} from '@material-ui/core';

import Breadcrumbs from '../components/ui/breadcrumbs';
import * as ROUTES from '../../constants/routes';

import {getProjectInfo} from '../../databaseAccess';
import {ProjectID} from '../../datamodel/core';

export default function ProjectSettings() {
  const {project_id} = useParams<{project_id: ProjectID}>();
  const project_info = getProjectInfo(project_id);
  const breadcrumbs = [
    {link: ROUTES.INDEX, title: 'Index'},
    {link: ROUTES.PROJECT_LIST, title: 'Projects'},
    {
      link: ROUTES.PROJECT + project_id,
      title: project_info !== null ? project_info.name : '',
    },
    {title: 'Settings'},
  ];
  return project_info ? (
    <Container maxWidth="lg">
      <Breadcrumbs data={breadcrumbs} />

      <Box mb={2}>
        <Typography variant={'h2'} component={'h1'}>
          {project_info !== null ? project_info.name : project_id} Settings
        </Typography>
        <Typography variant={'subtitle1'} gutterBottom>
          Update the project settings for
          {project_info !== null ? project_info.name : project_id}.
        </Typography>
      </Box>
      <Paper square>
        <Button
          color="primary"
          component={RouterLink}
          to={ROUTES.PROJECT + project_id + ROUTES.AUTOINCREMENT_LIST}
        >
          Edit AutoIncrement Allocations
        </Button>
      </Paper>
    </Container>
  ) : (
    <Redirect to="/404" />
  );
}