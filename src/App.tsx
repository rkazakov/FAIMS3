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
 * Filename: App.tsx
 * Description:
 *   TODO
 */

import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import * as ROUTES from './constants/routes';
import NavBar from './gui/components/navbar';
import Footer from './gui/components/footer';
import {Index} from './gui/pages';
import {SignUp} from './gui/pages/signup';
import {SignIn} from './gui/pages/signin';
import AboutBuild from './gui/pages/about-build';
import {ForgotPassword} from './gui/pages/forgot-password';
import Home from './gui/pages/home';
import ProjectList from './gui/pages/project-list';
import Project from './gui/pages/project';
import RecordList from './gui/pages/record-list';
import Record from './gui/pages/record';
import RecordCreate from './gui/pages/record-create';
import NotFound404 from './gui/pages/404';
import {StateProvider} from './store';

import {MuiThemeProvider} from '@material-ui/core/styles';

// import {unstable_createMuiStrictModeTheme as createMuiTheme} from '@material-ui/core';
// https://stackoverflow.com/a/64135466/3562777 temporary solution to remove findDOMNode is depreciated in StrictMode warning
// will be resolved in material-ui v5

import {createdProjects} from './sync/state';
import {ProjectsList} from './datamodel/database';
import theme from './gui/theme';

type AppProps = {};

type AppState = {
  projects: ProjectsList;
  global_error: null | {};
};

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    const projects: ProjectsList = {};

    this.state = {
      projects: projects,
      global_error: null,
    };

    for (const active_id in createdProjects) {
      projects[active_id] = createdProjects[active_id].project;
    }
  }

  render() {
    return (
      <StateProvider>
        <MuiThemeProvider theme={theme}>
          <Router>
            <NavBar />
            <Switch>
              <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
              <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
              <Route
                exact
                path={ROUTES.FORGOT_PASSWORD}
                component={ForgotPassword}
              />

              <Route exact path={ROUTES.HOME} component={Home} />
              <Route exact path={ROUTES.RECORD_LIST} component={RecordList} />
              <Route exact path={ROUTES.PROJECT_LIST} component={ProjectList} />
              <Route
                exact
                path={ROUTES.PROJECT + ':project_id'}
                component={Project}
              />
              <Route
                exact
                path={
                  ROUTES.PROJECT +
                  ':project_id' +
                  ROUTES.RECORD_CREATE +
                  ROUTES.RECORD_TYPE +
                  ':type_name'
                }
                component={RecordCreate}
              />
              <Route
                exact
                path={
                  ROUTES.PROJECT +
                  ':project_id' +
                  ROUTES.RECORD +
                  ':record_id' +
                  ROUTES.REVISION +
                  ':revision_id'
                }
                component={Record}
              />
              <Route exact path="/" component={Index} />
              <Route exact path={ROUTES.ABOUT_BUILD} component={AboutBuild} />
              <Route component={NotFound404} />
            </Switch>
            <Footer />
          </Router>
        </MuiThemeProvider>
      </StateProvider>
    );
  }
}

export default App;
