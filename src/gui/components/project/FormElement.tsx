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
 * Filename: FormElement.tsx
 * Description: This is the file for formelemnets for Notebook Creation, not contain any information about handler(check other files)
 *   TODO: any type
 *   TODO: different design settings
 */

import React from 'react';
import {useState} from 'react';
import {Formik, Form, Field} from 'formik';
import {Grid, Box} from '@material-ui/core';
import {getComponentByName} from '../../component_registry';
import {setProjectInitialValues} from './data/ComponentSetting';
import {TickButton} from './tabs/ProjectButton';

/* TODO: fix eslint @KateSHENG */
/* eslint-disable */

type FormElement = {
  uiSpec: any;
  handleChangeForm: any;
  currentView: string;
  handleSubmit?: any;
};

export const getComponentFromField = (
  uiSpec: any,
  fieldName: string,
  formProps: any,
  handleChangeC: any,
  uidesign = 'alert'
) => {
  // console.log('getComponentFromField');

  const fields = uiSpec['fields'];
  const fieldConfig = fields[fieldName];
  const namespace = fieldConfig['component-namespace'];
  const name = fieldConfig['component-name'];
  let Component: React.Component;
  try {
    Component = getComponentByName(namespace, name);
  } catch (err) {
    return <>Error</>;
  }
  const value = formProps.values[fieldName];

  return (
    <Box key={fieldName}>
      <Field
        component={Component}
        name={fieldName}
        onChange={(e: React.FocusEvent<{name: string}>) => {
          formProps.handleChange(e);
          handleChangeC(e);
        }}
        onBlur={(e: React.FocusEvent<{name: string}>) => {
          formProps.handleChange(e);
          handleChangeC(e);
        }}
        value={value}
        {...fieldConfig['component-parameters']}
        {...fieldConfig['component-parameters']['InputProps']}
        {...fieldConfig['component-parameters']['SelectProps']}
        {...fieldConfig['component-parameters']['InputLabelProps']}
        {...fieldConfig['component-parameters']['FormHelperTextProps']}
      />
    </Box>
  );
};

export function FormForm(props: FormElement) {
  const {currentView, handleChangeForm, ...others} = props;
  const [uiSpec, setUISpec] = useState(props.uiSpec);
  const initialValues = setProjectInitialValues(uiSpec, currentView, {});
  return (
    <Formik
      initialValues={initialValues}
      validateOnMount={true}
      onSubmit={(values, {setSubmitting}) => {
        setTimeout(() => {
          setSubmitting(false);
          props.handleSubmit(values);
        }, 500);
      }}
    >
      {formProps => {
        return (
          <Form id="form">
            <Grid container>
              <Grid item sm={11} xs={12}>
                <Grid container>
                  {uiSpec['views'][currentView]['fields'].map(
                    (field: any, index: any) => (
                      <Grid
                        item
                        sm={
                          uiSpec['views'][currentView]['fields'].length === 1
                            ? 11
                            : 2
                        }
                        xs={12}
                        key={field}
                      >
                        {getComponentFromField(
                          uiSpec,
                          field,
                          formProps,
                          handleChangeForm
                        )}
                      </Grid>
                    )
                  )}
                </Grid>
              </Grid>
              <Grid item sm={1} xs={12}>
                <TickButton id="submit" type="submit" />
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}

// export  function FormElement (props: FormElement){

//   const [currentView, setCurrentView] = useState(props.view);
//   const [designvalue,setDesignvalue] = useState(1);
//   const [uiSpec,setUISpec] = useState(props.uiSpec);
//   const formProps=props.formProps;
//   const [fieldNames,setFieldNames]=useState<Array<any>>(uiSpec['views'][currentView]['fields'])
//   const [uidesign,setuidesign]=useState<string>(uiSpec['views'][currentView]['uidesign'])

//   const setnewPage = () =>{
//     // This method is to change form uispecific when uispecific changes=> inital value, uiSpefic, views
//     setFieldNames(uiSpec['views'][currentView]['fields'])
//     setuidesign(uiSpec['views'][currentView]['uidesign'])
//   }

//   // useEffect(() => {
//   //   console.log('ui changes')
//   //   console.log(uiSpec)

//   //    setnewPage()
//   //   }, [uiSpec,currentView]);

//    const handelonClickSetting = (id:any) => {
//     setDesignvalue(id)
//   }

//   const handleChangeC = (event:any) => {
//      props.handleChangeForm(event)
//    }
//   return (
//     <React.Fragment>
//     {uidesign==='form'?
//       fieldNames.map(fieldName => {
//         return getComponentFromField(uiSpec,fieldName, formProps,handleChangeC,uidesign);
//         }):
//       <Grid container spacing={1} >
//         <Grid item sm={4} xs={12} >
//           {fieldNames.length>0?getComponentFromField(uiSpec,fieldNames[0], formProps,handleChangeC):''}
//         </Grid>
//         <Grid item sm={1} xs={3} >
//           <SettingCard handelonClick={handelonClickSetting} />
//         </Grid>
//         <Grid item sm={7} xs={9}>
//           {uidesign==='settings'?fieldNames.length>designvalue+1?
//             [designvalue,designvalue+1].map(value => {
//               return getComponentFromField(uiSpec,fieldNames[value], formProps,handleChangeC,uidesign);
//             }):''
//             :getComponentFromField(uiSpec,fieldNames[1], formProps,handleChangeC,'alert')
//           }
//         </Grid>
//       </Grid>
//     }
//     </React.Fragment>
//     );

// }