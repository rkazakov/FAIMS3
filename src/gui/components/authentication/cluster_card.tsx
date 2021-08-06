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
 * Filename: projectCard.tsx
 * Description:
 *   TODO
 */

import {
  Card as MuiCard,
  CardActions,
  CardContent,
  CardHeader,
} from '@material-ui/core';

import {makeStyles} from '@material-ui/core/styles';

type ClusterCardProps = {};

const useStyles = makeStyles(() => ({
  cardHeader: {
    alignItems: 'flex-start',
  },
}));

export default function ClusterCard(props: ClusterCardProps) {
  const classes = useStyles();
  return (
    <MuiCard>
      <CardHeader className={classes.cardHeader} title={<b>Listing</b>} />
      <CardContent style={{paddingTop: 0}}></CardContent>
      <CardActions></CardActions>
    </MuiCard>
  );
}
