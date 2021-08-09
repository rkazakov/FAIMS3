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
 * Filename: staging.ts
 * Description:
 *   TODO
 */

export interface SavedView {
  // ID: active_id + '/' + view_name
  // OR: active_id + '/' + view_name + '/' + existing.observation + '/' + existing.revision
  _id: string;
  // Fields
  [key: string]: unknown;
}
