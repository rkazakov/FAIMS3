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
 * Filename: RecordTabBar.tsx
 * Description:
 *   ONLY for Draft use
 *   Steppers show sections of Form
 *   MobileStepper for samll screen ONLY
 */

import React from 'react';
import {
  Button,
  Box,
  Typography,
  Step,
  Stepper,
  StepButton,
  MobileStepper,
} from '@mui/material';
import {ProjectUIModel} from '../../../datamodel/ui';

type RecordStepperProps = {
  view_index: number;
  ui_specification: ProjectUIModel;
  viewsetName: string;
  activeStep: number;
  onChangeStepper: any;
};

export default function RecordStepper(props: RecordStepperProps) {
  const {
    view_index,
    ui_specification,
    viewsetName,
    activeStep,
    onChangeStepper,
  } = props;

  return (
    <>
      <Box display={{xs: 'none', sm: 'block'}} style={{padding: '3px'}}>
        <div style={{overflowX: 'hidden'}} className={'recordstepper'}>
          <Stepper
            nonLinear
            activeStep={view_index}
            alternativeLabel
            style={{overflowY: 'hidden', overflowX: 'auto'}}
          >
            {ui_specification.viewsets[viewsetName].views.map(
              (view_name: string, index: number) => (
                <Step key={view_name}>
                  <StepButton
                    onClick={() => {
                      onChangeStepper(view_name, index);
                    }}
                  >
                    {ui_specification.views[view_name].label}
                  </StepButton>
                </Step>
              )
            )}
          </Stepper>
        </div>
      </Box>
      <Box display={{xs: 'block', sm: 'none'}}>
        <MobileStepper
          variant="text"
          steps={ui_specification.viewsets[viewsetName].views.length}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={() => {
                const stepnum = activeStep + 1;
                onChangeStepper(
                  ui_specification.viewsets[viewsetName].views[stepnum],
                  stepnum
                );
              }}
              disabled={
                activeStep ===
                ui_specification.viewsets[viewsetName].views.length - 1
              }
            >
              Next
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={() => {
                const stepnum = activeStep - 1;
                onChangeStepper(
                  ui_specification.viewsets[viewsetName].views[stepnum],
                  stepnum
                );
              }}
              disabled={activeStep === 0}
            >
              Back
            </Button>
          }
        />
        <Typography variant="h5" align="center">
          {
            ui_specification.views[
              ui_specification.viewsets[viewsetName].views[activeStep]
            ].label
          }
        </Typography>
      </Box>
    </>
  );
}