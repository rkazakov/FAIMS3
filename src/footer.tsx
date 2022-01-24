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
 * Filename: footer.tsx
 * Description:
 *   Brian,please add html here
 */
import React from 'react';
// Brian,please replace below html here and in envrionmnet file REACT_APP_SERVICES=XXX
const html = `
<hr/>
<div style="margin-left:20%; margin-right:20%; font-size:60%">

The <a href="https://faims.edu.au/">FAIMS 3.0 Electronic Field Notebooks
project</a> received investment
(<a href="https://dx.doi.org/10.47486/PL110">doi: 10.47486/PL110</a>) from
the <a href="https://ardc.edu.au/">Australian Research Data Commons(ARDC)</a>, <a
href="https://www.mq.edu.au/">Macquarie University</a>, <a
href="https://www.csiro.au/en/about/people/business-units/mineral-resources">CSIRO</a>,
<a href="https://www.unsw.edu.au/">UNSW Sydney</a>, <a
href="https://www.latrobe.edu.au/">La Trobe University</a> and <a
href="https://international.au.dk/">Aarhus University</a>. We are proud to
collaborate with more than a dozen other <a
href="https://faims.edu.au/partners/">partners</a>. Contribute to this <a href="https://github.com/FAIMS/FAIMS3">project on GitHub!</a>
</div>
`;

export function EHTML() {
  const _html = {__html: html};
  return <div dangerouslySetInnerHTML={_html} />;
}

export const EFooter = <EHTML />;
