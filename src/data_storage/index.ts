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
 * Filename: index.ts
 * Description:
 *   TODO
 */

import {v4 as uuidv4} from 'uuid';

import {getDataDB} from '../sync';
import {RecordID, ProjectID, RevisionID} from '../datamodel/core';
import {Revision} from '../datamodel/database';
import {Record, RecordMetadata} from '../datamodel/ui';
import {
  addNewRevisionFromForm,
  createNewRecord,
  generateFAIMSRevisionID,
  getRecord,
  getRevision,
  getFormDataFromRevision,
  updateHeads,
} from './internals';

export interface ProjectRevisionListing {
  [_id: string]: string[];
}

export type RecordRevisionListing = RevisionID[];

export function generateFAIMSDataID(): RecordID {
  return uuidv4();
}

// Commented as this does not work with the find below for some unknown reason
//async function ensureRecordIndex(project_id: ProjectID) {
//  const datadb = getDataDB(project_id);
//  try {
//    return datadb.createIndex({
//      index: {
//        fields: ['format_version'],
//        name: RECORD_INDEX_NAME,
//      },
//    });
//  } catch (err) {
//    console.error(err);
//    throw Error('Failed to create record index');
//  }
//}

export async function getFirstRecordHead(
  project_id: ProjectID,
  record_id: RecordID
): Promise<RevisionID> {
  const record = await getRecord(project_id, record_id);
  return record.heads[0];
}

export async function upsertFAIMSData(
  project_id: ProjectID,
  record: Record
): Promise<RevisionID> {
  if (record.record_id === undefined) {
    throw Error('record_id required to save record');
  }
  const revision_id = generateFAIMSRevisionID();
  if (record.revision_id === null) {
    await createNewRecord(project_id, record, revision_id);
    await addNewRevisionFromForm(project_id, record, revision_id);
  } else {
    await addNewRevisionFromForm(project_id, record, revision_id);
    await updateHeads(
      project_id,
      record.record_id,
      [record.revision_id],
      revision_id
    );
  }
  return revision_id;
}

export async function getFullRecordData(
  project_id: ProjectID,
  record_id: RecordID,
  revision_id: RevisionID
): Promise<Record | null> {
  const revision = await getRevision(project_id, revision_id);
  if (revision.deleted === true) {
    return null;
  }
  const record = await getRecord(project_id, record_id);
  const form_data = await getFormDataFromRevision(project_id, revision);
  return {
    project_id: project_id,
    record_id: record_id,
    revision_id: revision_id,
    type: revision.type,
    data: form_data,
    updated_by: revision.created_by,
    updated: new Date(revision.created),
    created: new Date(record.created),
    created_by: record.created_by,
  };
}

export async function listFAIMSRecordRevisions(
  project_id: ProjectID,
  record_id: RecordID
): Promise<RecordRevisionListing> {
  try {
    const record = await getRecord(project_id, record_id);
    return record.revisions;
  } catch (err) {
    console.warn(err);
    throw Error(`failed to list data for id ${record_id}`);
  }
}

export async function listFAIMSProjectRevisions(
  project_id: ProjectID
): Promise<ProjectRevisionListing> {
  const datadb = getDataDB(project_id);
  try {
    const result = await datadb.allDocs();
    const revmap: ProjectRevisionListing = {};
    for (const row of result.rows) {
      const _id: RecordID = row.key;
      revmap[_id] = await listFAIMSRecordRevisions(project_id, _id);
    }
    return revmap;
  } catch (err) {
    console.warn(err);
    throw Error('failed to list data in project');
  }
}

export async function deleteFAIMSDataForID(
  project_id: ProjectID,
  record_id: RecordID,
  userid: string
): Promise<RevisionID> {
  const record = await getRecord(project_id, record_id);
  if (record.heads.length !== 1) {
    throw Error('Too many head revisions, must choose a specific head');
  }
  try {
    return await setRecordAsDeleted(
      project_id,
      record_id,
      record.heads[0],
      userid
    );
  } catch (err) {
    console.warn(err);
    throw Error('failed to delete data with id');
  }
}

export async function undeleteFAIMSDataForID(
  project_id: ProjectID,
  record_id: RecordID,
  userid: string
): Promise<RevisionID> {
  const record = await getRecord(project_id, record_id);
  if (record.heads.length !== 1) {
    throw Error('Too many head revisions, must choose a specific head');
  }
  try {
    return await setRecordAsUndeleted(
      project_id,
      record_id,
      record.heads[0],
      userid
    );
  } catch (err) {
    console.warn(err);
    throw Error('failed to undelete data with id');
  }
}

export async function setRecordAsDeleted(
  project_id: ProjectID,
  obsid: RecordID,
  base_revid: RevisionID,
  user: string
): Promise<RevisionID> {
  const datadb = getDataDB(project_id);
  const date = new Date();
  const base_revision = await getRevision(project_id, base_revid);
  const new_rev_id = generateFAIMSRevisionID();
  const new_revision: Revision = {
    _id: new_rev_id,
    revision_format_version: 1,
    avps: base_revision.avps,
    type: base_revision.type,
    record_id: obsid,
    parents: [base_revid],
    created: date.toISOString(),
    created_by: user,
    deleted: true,
  };
  await datadb.put(new_revision);
  await updateHeads(project_id, obsid, [base_revision._id], new_rev_id);
  return new_rev_id;
}

export async function setRecordAsUndeleted(
  project_id: ProjectID,
  obsid: RecordID,
  base_revid: RevisionID,
  user: string
): Promise<RevisionID> {
  const datadb = getDataDB(project_id);
  const date = new Date();
  const base_revision = await getRevision(project_id, base_revid);
  const new_rev_id = generateFAIMSRevisionID();
  const new_revision: Revision = {
    _id: new_rev_id,
    revision_format_version: 1,
    avps: base_revision.avps,
    type: base_revision.type,
    record_id: obsid,
    parents: [base_revid],
    created: date.toISOString(),
    created_by: user,
    deleted: false,
  };
  await datadb.put(new_revision);
  await updateHeads(project_id, obsid, [base_revision._id], new_rev_id);
  return new_rev_id;
}

export async function getRecordMetadata(
  project_id: ProjectID,
  record_id: RecordID,
  revision_id: RevisionID
): Promise<RecordMetadata> {
  try {
    const record = await getRecord(project_id, record_id);
    const revision = await getRevision(project_id, revision_id);
    return {
      project_id: project_id,
      record_id: record_id,
      revision_id: revision_id,
      created: new Date(record.created),
      created_by: record.created_by,
      updated: new Date(revision.created),
      updated_by: revision.created_by,
      conflicts: record.heads.length > 1,
    };
  } catch (err) {
    console.error(err);
    throw Error('failed to get metadata');
  }
}