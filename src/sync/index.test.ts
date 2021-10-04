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
 * Filename: index.test.js
 * Description:
 *   TODO
 */

import {testProp, fc} from 'jest-fast-check';
import PouchDB from 'pouchdb';

import {LOCALLY_CREATED_PROJECT_PREFIX} from '../datamodel/database';
import {create_new_project_dbs} from './new-project';

PouchDB.plugin(require('pouchdb-adapter-memory')); // enable memory adapter for testing

describe('test project creation', () => {
  testProp(
    'test project creation',
    [
      fc.fullUnicodeString(), // project name
    ],
    async name => {
      return create_new_project_dbs(name).then(proj_id => {
        expect(proj_id).toEqual(
          expect.stringContaining(LOCALLY_CREATED_PROJECT_PREFIX)
        );
      });
    }
  );
});