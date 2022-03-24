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
 * Filename: meta.tsx
 * Description:
 *   TODO
 */

import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {Alert} from '@mui/material';

import {ActionType} from '../../../actions';
import * as ROUTES from '../../../constants/routes';
import {store} from '../../../store';
import {ProjectID, RecordID, RevisionID} from '../../../datamodel/core';
import {getCurrentUserId} from '../../../users';
import {setRecordAsDeleted} from '../../../data_storage';

type RecordDeleteProps = {
  project_id: ProjectID;
  record_id: RecordID;
  revision_id: RevisionID;
};

export default function RecordDelete(props: RecordDeleteProps) {
  const {project_id, record_id, revision_id} = props;
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const globalState = useContext(store);
  const {dispatch} = globalState;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    getCurrentUserId(project_id)
      .then(userid =>
        setRecordAsDeleted(project_id, record_id, revision_id, userid)
      )
      .then(() => {
        dispatch({
          type: ActionType.ADD_ALERT,
          payload: {
            message: 'Record ' + record_id + ' deleted',
            severity: 'success',
          },
        });
        history.push(ROUTES.PROJECT + project_id);
      })
      .catch(err => {
        console.log('Could not delete record: ' + record_id, err);
        dispatch({
          type: ActionType.ADD_ALERT,
          payload: {
            message: 'Could not delete record: ' + record_id,
            severity: 'error',
          },
        });
      });
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        startIcon={<DeleteIcon />}
      >
        Delete record
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Delete record ' + record_id}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={'div'}>
            <Alert severity="warning">
              You cannot reverse this action! Be sure you wish to delete this
              record.
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" variant={'contained'}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
