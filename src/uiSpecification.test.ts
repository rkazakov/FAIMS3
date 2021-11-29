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
 * Filename: uiSpecification.test.js
 * Description:
 *   TODO
 */

import {testProp, fc} from 'jest-fast-check';
import PouchDB from 'pouchdb';
import {getUiSpecForProject, setUiSpecForProject} from './uiSpecification';
import {ProjectID} from './datamodel/core';
import {UI_SPECIFICATION_NAME} from './datamodel/database';
import {equals} from './utils/eqTestSupport';

import {getProjectDB} from './sync/index';

PouchDB.plugin(require('pouchdb-adapter-memory')); // enable memory adapter for testing

const projdbs: any = {};

function mockProjectDB(project_id: ProjectID) {
  if (projdbs[project_id] === undefined) {
    const db = new PouchDB(project_id, {adapter: 'memory'});
    projdbs[project_id] = db;
  }
  return projdbs[project_id];
}

async function cleanProjectDBS() {
  let db;
  for (const project_id in projdbs) {
    db = projdbs[project_id];
    delete projdbs[project_id];

    if (db !== undefined) {
      try {
        await db.destroy();
        //await db.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

jest.mock('./sync/index', () => ({
  getProjectDB: mockProjectDB,
}));

describe('roundtrip reading and writing to db', () => {
  testProp(
    'ui roundtrip',
    [
      fc.fullUnicodeString(),
      fc.dictionary(fc.fullUnicodeString(), fc.unicodeJsonObject()), // fields
      fc.dictionary(
        fc.fullUnicodeString(),
        fc.record({
          label: fc.fullUnicodeString(),
          next_label: fc.fullUnicodeString(),
          fields: fc.array(fc.fullUnicodeString()),
        })
      ), // views
      fc.dictionary(
        fc.fullUnicodeString(),
        fc.record({
          label: fc.fullUnicodeString(),
          submit_label: fc.fullUnicodeString(),
          views: fc.array(fc.fullUnicodeString()),
        })
      ), // viewsets
      fc.array(fc.fullUnicodeString()), // visible_types
    ],
    async (project_id, fields, views, viewsets, visible_types) => {
      await cleanProjectDBS();
      fc.pre(projdbs !== {});

      const uiInfo = {
        _id: UI_SPECIFICATION_NAME,
        fields: fields,
        views: views,
        viewsets: viewsets,
        visible_types: visible_types,
      };

      const meta_db = getProjectDB(project_id);

      return setUiSpecForProject(meta_db, uiInfo)
        .then(_result => {
          return getUiSpecForProject(project_id);
        })
        .then(result => {
          delete result['_rev'];
          expect(equals(result, uiInfo)).toBe(true);
        });
    }
  );
});
