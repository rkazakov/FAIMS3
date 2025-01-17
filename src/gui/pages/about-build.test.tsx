/*
 * Copyright 2021, 2022 Macquarie University
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
 * Filename: about-build.tsx
 * Description:
 *   TODO
 */

import {fireEvent, render, screen} from '@testing-library/react';
import {BrowserRouter as Router} from 'react-router-dom';
import AboutBuild from './about-build';
import {doDumpDownload, doDumpShare} from '../../sync/data-dump';

jest.mock('../../sync/data-dump', () => ({
  doDumpShare: jest.fn(),
  doDumpDownload: jest.fn(),
}));

test('Check about-build component', async () => {
  render(
    <Router>
      <AboutBuild />
    </Router>
  );
  expect(screen.getByText('Directory Server')).toBeTruthy();

  expect(screen.getByText('Refresh the app')).toBeTruthy();

  expect(screen.getByText('Download local database contents')).toBeTruthy();

  expect(screen.getByText('Share local database contents')).toBeTruthy();

  expect(screen.getByText('Wipe and reset everything')).toBeTruthy();

  expect(screen.getByText('Open Mini-Fauxton')).toBeTruthy();

  fireEvent.click(screen.getByText('Download local database contents'));

  expect(doDumpDownload).toBeCalled();

  fireEvent.click(screen.getByText('Share local database contents'));

  expect(doDumpShare).toBeCalled();
});
