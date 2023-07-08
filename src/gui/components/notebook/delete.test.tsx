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
 * Filename: delete.test.tsx
 * Description:
 *   TODO
 */

import RecordDelete from './delete';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {deleteStagedData} from '../../../sync/draft-storage';

const testDeleteData = {
  project_id: 'test-id',
  record_id: 'test-record-id',
  revision_id: 'test-revision-id',
  draft_id: 'test-draft-id',
  show_label: true,
  handleRefresh: jest.fn(),
};

function mockGetCurrentUserId() {
  return new Promise(resolve => {
    resolve('test-user-id');
  });
}

jest.mock('../../../users', () => ({
  getCurrentUserId: mockGetCurrentUserId,
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../sync/draft-storage', () => ({
  deleteStagedData: jest.fn(),
}));

test('Check delete component', async () => {
  render(<RecordDelete {...testDeleteData} />);
  expect(screen.getByTestId('delete-btn')).toBeTruthy();

  fireEvent.click(screen.getByTestId('delete-btn'));

  expect(screen.getByText('Cancel')).toBeTruthy();

  expect(screen.getByTestId('confirm-delete')).toBeTruthy();

  fireEvent.click(screen.getByTestId('confirm-delete'));

  await waitFor(() => {
    expect(deleteStagedData).toBeCalledTimes(1);
  });
});
