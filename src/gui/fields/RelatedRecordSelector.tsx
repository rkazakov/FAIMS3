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
 * Filename: RelatedRecordSelector.tsx
 * Description:
 *   TODO
 */

import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

import {Field, FieldProps} from 'formik';
import {Autocomplete} from 'formik-material-ui-lab';

import * as ROUTES from '../../constants/routes';
import {FAIMSTypeName} from '../../datamodel/core';
import {RecordReference} from '../../datamodel/ui';
import {getAllRecordsOfType} from '../../data_storage/queries';
import {
  getDefaultuiSetting,
  Defaultcomponentsetting,
} from './BasicFieldSettings';
import LibraryBooksIcon from '@material-ui/icons/Bookmarks';
import {option} from '../../datamodel/typesystem';
import {
  ProjectUIModel,
  componenentSettingprops,
  FAIMSEVENTTYPE,
} from '../../datamodel/ui';
import {useLocation, Link} from 'react-router-dom';

/* eslint-disable @typescript-eslint/no-unused-vars */
interface Props {
  related_type: FAIMSTypeName;
  relation_type: FAIMSTypeName;
  multiple?: boolean;
  id: string;
}

export function RelatedRecordSelector(props: FieldProps & Props) {
  const project_id = props.form.values['_project_id'];
  const field_name = props.field.name;
  const [options, setOptions] = React.useState<RecordReference[]>([]);
  const multiple =
    options.length > 0 && props.multiple !== undefined ? props.multiple : false;
  React.useEffect(() => {
    if (project_id !== undefined) {
      (async () => {
        const records = await getAllRecordsOfType(
          project_id,
          props.related_type
        );
        setOptions(records);
      })();
    }
  }, []);
  // Note the "multiple" option below, that seems to control whether multiple
  // entries can in entered.
  // TODO: Have the relation_type set the multiplicity of the system
  return (
    <div>
      <Field
        multiple={multiple}
        id={props.id ?? 'asynchronous-demo'}
        name={field_name}
        component={Autocomplete}
        getOptionSelected={(option: RecordReference, value: RecordReference) =>
          option.project_id === value.project_id &&
          option.record_id === value.record_id
        }
        getOptionLabel={(option: RecordReference) => option.record_label}
        options={options}
        defaultValue={null}
        // value={multiple?props.form.values[props.field.name]:props.form.values[props.field.name]}
        renderInput={(params: any) => (
          <TextField
            {...params}
            label="Select Record "
            variant="outlined"
            InputProps={{
              ...params.InputProps,
            }}
          />
        )}
      />
      {project_id !== undefined && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to={
            ROUTES.PROJECT +
            project_id +
            ROUTES.RECORD_CREATE +
            props.related_type +
            '?link=' +
            useLocation().pathname
          }
        >
          New Record
        </Button>
      )}
    </div>
  );
}

const uiSpec = {
  'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
  'component-name': 'RelatedRecordSelector',
  'type-returned': 'faims-core::Relationship', // matches a type in the Project Model
  'component-parameters': {
    fullWidth: true,
    helperText: 'Select a Form or Field',
    variant: 'outlined',
    required: true,
    related_type: '',
    relation_type: 'faims-core::Child',
    InputProps: {
      type: 'text', // must be a valid html type
    },
    multiple: false,
    SelectProps: {},
    InputLabelProps: {
      label: 'Related Field',
    },
    FormHelperTextProps: {},
  },
  validationSchema: [['yup.string'], ['yup.required']],
  initialValue: [],
};

const uiSetting = () => {
  const newuiSetting: ProjectUIModel = getDefaultuiSetting();
  // console.log(generatenewfield('faims-custom','Select',null,null,null))
  // newuiSetting['fields']['related_type']=
  // newuiSetting['fields']['relation_type']=generatenewfield('faims-custom','Select',null,'related_type',null)
  // newuiSetting['fields']['relation_type']['component-parameters']['ElementProps']=[{
  //   value: 'faims-core::Child',
  //   label: 'Contained',
  // }]
  newuiSetting['fields']['multiple'] = {
    'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
    'component-name': 'Checkbox',
    'type-returned': 'faims-core::Bool', // matches a type in the Project Model
    'component-parameters': {
      name: 'multiple',
      id: 'multiple',
      required: false,
      type: 'checkbox',
      FormControlLabelProps: {
        label: 'Multiple',
      },
      FormHelperTextProps: {
        children: 'Tick if user can add multiple record for this relateionship',
      },
      // Label: {label: 'Terms and Conditions'},
    },
    validationSchema: [
      ['yup.bool'],
      ['yup.oneOf', [true], 'You must accept the terms and conditions'],
      ['yup.required'],
    ],
    initialValue: false,
  };
  newuiSetting['fields']['relation_type'] = {
    'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
    'component-name': 'Select',
    'type-returned': 'faims-core::String', // matches a type in the Project Model
    'component-parameters': {
      fullWidth: true,
      helperText: '',
      variant: 'outlined',
      required: true,
      select: true,
      InputProps: {},
      SelectProps: {},
      ElementProps: {
        options: [
          {
            value: 'faims-core::Child',
            label: 'Contained',
          },
          {
            value: 'faims-core::Linked',
            label: 'Linked',
          },
        ],
      },
      InputLabelProps: {
        label: 'Select Relation Type',
      },
    },
    validationSchema: [['yup.string']],
    initialValue: 'faims-core::Child',
  };
  newuiSetting['fields']['related_type'] = {
    'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
    'component-name': 'Select',
    'type-returned': 'faims-core::String', // matches a type in the Project Model
    'component-parameters': {
      fullWidth: true,
      helperText: 'Select Form ',
      variant: 'outlined',
      required: true,
      select: true,
      InputProps: {},
      SelectProps: {},
      ElementProps: {
        options: [],
      },
      InputLabelProps: {
        label: 'Select ',
      },
    },
    validationSchema: [['yup.string']],
    initialValue: '',
  };

  newuiSetting['views']['FormParamater']['fields'] = [
    'related_type',
    'relation_type',
    'multiple',
  ];
  newuiSetting['viewsets'] = {
    settings: {
      views: ['FormParamater'],
      label: 'settings',
    },
  };

  return newuiSetting;
};

export function getLinkedBuilderIcon() {
  return <LibraryBooksIcon />;
}

export const LinkedSetting = [uiSetting(), uiSpec];

export function Linkedcomponentsetting(props: componenentSettingprops) {
  const [uiSetting, setuiSetting] = React.useState(props.uiSetting);

  React.useEffect(() => {
    setini();
  }, [props.uiSpec['visible_types']]);

  const setrelatedtype = (options: Array<option>) => {
    if (options.length > 0) {
      //get numbers of fields that not IDs
      const newvalues = uiSetting;
      // const options: Array<option> = [];
      // fields.map(
      //   (field: string, index: number) =>
      //     (options[index] = {
      //       value: field,
      //       label: field,
      //     })
      // );
      if (newvalues['fields']['related_type' + props.fieldName] !== undefined)
        newvalues['fields']['related_type' + props.fieldName][
          'component-parameters'
        ]['ElementProps']['options'] = options;

      setuiSetting({...newvalues});
    }
  };

  const setini = () => {
    const options: Array<option> = [];
    //TODO pass the value of all field in this form
    const fields: Array<option> = [];
    props.uiSpec['visible_types'].map((viewset: string) =>
      fields.push({
        label: props.uiSpec['viewsets'][viewset]['label'] ?? viewset,
        value: viewset,
      })
    );
    //fields=fields.filter((type:string)=>type!==props.currentform)
    setrelatedtype(fields);
  };

  const handlerchanges = (event: FAIMSEVENTTYPE) => {
    if (event.target.name.replace(props.fieldName, '') === 'multiple') {
      const newvalues = props.uiSpec;
      newvalues['fields'][props.fieldName]['component-parameters']['multiple'] =
        event.target.checked;
      props.setuiSpec({...newvalues});
    }
  };

  return (
    <Defaultcomponentsetting
      handlerchanges={handlerchanges}
      {...props}
      fieldui={props.fieldui}
      uiSetting={uiSetting}
    />
  );
}
