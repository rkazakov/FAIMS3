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
 * Filename: projectMetadata.ts
 * Description:
 *   TODO
 */
import {getProjectDB} from './sync/index';
import {ProjectID} from './datamodel/core';
import {
  PROJECT_METADATA_PREFIX,
  EncodedProjectMetadata,
} from './datamodel/database';

export async function getProjectMetadata(
  project_id: ProjectID,
  metadata_key: string
): Promise<any> {
  const projdb = getProjectDB(project_id);
  try {
    const doc: EncodedProjectMetadata = await projdb.get(
      PROJECT_METADATA_PREFIX + '-' + metadata_key
    );
    return doc.metadata;
  } catch (err) {
    console.warn(err);
    throw Error('failed to find metadata');
  }
}

export async function setProjectMetadata(
  project_id: ProjectID,
  metadata_key: string,
  metadata: any
) {
  const projdb = getProjectDB(project_id);
  try {
    const doc: EncodedProjectMetadata = {
      _id: PROJECT_METADATA_PREFIX + '-' + metadata_key,
      is_attachment: false,
      metadata: metadata,
    };

    try {
      const existing_metaDoc = await projdb.get(
        PROJECT_METADATA_PREFIX + '-' + metadata_key
      );
      doc._rev = existing_metaDoc._rev;
    } catch (err) {
      // Probably no existing UI info
    }

    await projdb.put(doc);
  } catch (err) {
    console.warn(err);
    throw Error('failed to set metadata');
  }
}
