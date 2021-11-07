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
 * Filename: ProjectInfo.tsx
 * Description:This is the file about Project Info
 *
 */
import React from 'react';
import {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

import {
  Button,
  Grid,
  Box,
  ButtonGroup,
  Typography,
  AppBar,
  Hidden,
} from '@material-ui/core';
import {Formik, Form, Field, FormikProps, FormikValues} from 'formik';
import FieldsListCard from './FieldsListCard';
import {SettingCard} from './PSettingCard';
import {getComponentFromField, FormForm} from '../FormElement';
import {TabTab, TabEditable} from './TabTab';
import TabPanel from './TabPanel';
import {
  setProjectInitialValues,
  getid,
  updateuiSpec,
  gettabform,
  getprojectform,
} from '../data/ComponentSetting';
import {
  ProjevtValueList,
  FAIMShandlerType,
  BehaviourProperties,
  } from '../../../../datamodel/ui'
import {TickButton, AddUserButton, ProjectSubmit} from './ProjectButton';
import {
  setUiSpecForProject,
  getUiSpecForProject,
} from '../../../../uiSpecification';
import {data_dbs, metadata_dbs} from '../../../../sync/databases';
import {getProjectInfo} from '../../../../databaseAccess';
import {ProjectUIModel} from '../../../../datamodel/ui';
import {UserRoleList} from './PSettingCard';
import Alert from '@material-ui/lab/Alert';
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  newfield: {
    // backgroundColor:'#e1e4e8',
    // borderTop:'1px solid #e1e4e8',
  },
  newfield_button: {
    textAlign: 'right',
  },
  addfield: {
    // border:'1px solid #e1e4e8',
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  settingtab: {
    backgroundColor: '#e1e4e8',
  },
}));

type ProjectInfoProps = {
  project_id: string |null;
  projectvalue: ProjevtValueList;
  setProjectValue: FAIMShandlerType;
  handleChangeFormProject: FAIMShandlerType;
  setProjecttabvalue: FAIMShandlerType;
  formProps:any;
};

export default function ProjectInfoTab(props: ProjectInfoProps) {
  const {projectvalue, setProjectValue, project_id, formProps,...others} = props;
  const [infotabvalue, setinfotabvalue] = useState(0);
  const [uiSpec_general, setUISpecG] = useState<ProjectUIModel>({
    fields: {},
    views: {},
    viewsets: {},
    visible_types: []})

  const [accessgroup, setaccessgroup] = useState([]);
  const [uiSpec_access, setUISpecA] = useState<ProjectUIModel>({
    fields: {},
    views: {},
    viewsets: {},
    visible_types: [],
  });
  const [accessAdded,setAccessAdded]= useState('')
  const [metaAdded,setMetaAdded]= useState('')
  const [uiSpec_meta, setUISpecM] = useState<ProjectUIModel>({
    fields: {},
    views: {},
    viewsets: {},
    visible_types: []})

  useEffect(() => {
    setini();
  }, []);

  useEffect(() => {
    setUISpecA(getprojectform(projectvalue, 'info_group'));
  }, [accessgroup]);

  useEffect(() => {
    if (projectvalue['name'] !== undefined && projectvalue['name'] !== '') {

      setUISpecG(getprojectform(projectvalue, 'info_general'));
      console.debug('update');
    }
  }, [projectvalue['name']]);

  // useEffect(() => {
  //   if (projectvalue['name'] !== undefined && projectvalue['name'] !== '') {

  //     setUISpecM({...getprojectform(projectvalue, 'project_meta')})
  //     console.debug('update');
  //   }
  // }, [projectvalue['meta']]);

  const setini = () => {
    setUISpecA(getprojectform(projectvalue, 'info_group'));
    setUISpecG({...getprojectform(projectvalue, 'info_general')});
    setUISpecM({...getprojectform(projectvalue, 'project_meta')})
    setinfotabvalue(0);
  };

  const handleChangeFormProject = (event: any) => {
    const newproject = projectvalue;
    newproject[event.target.name] = event.target.value;
    setProjectValue({...newproject});
  };
  const handleChangetab = (event: any, index: number) => {
    setinfotabvalue(index);
  };

  const handleAddAccess = (accessadded:string) => {
    if (accessadded === '') return false;
    const newproject = projectvalue;
    newproject['accesses'] = [...newproject['accesses'], accessadded]; //need to reset the add user role value
    setProjectValue(newproject);
    setaccessgroup(newproject['accesses']);
    return true;
  };

  const handleaddmeta = (metaAdded:string) =>{
    console.log(metaAdded)
    if (metaAdded === '') return false;
    const newproject = projectvalue;
    newproject['meta'][metaAdded] = ''; //need to reset the add user role value
    setProjectValue(newproject);
    setUISpecM({...getprojectform(newproject, 'project_meta')})
    return true;
  }

  const handleformchangeAccess = (event: any) => {setAccessAdded(event.target.value)};


  const deleteuserrole = (userrole: string) => {
    console.log(userrole);
    const newproject = projectvalue;
    newproject['accesses'] = newproject['accesses'].filter(
      (access: string) => access !== userrole
    );
    setProjectValue(newproject);
    setaccessgroup(newproject['accesses']);
  };

  const handleChangeFormProjectMeta=(event: any) => {
    const newproject = projectvalue;
    newproject['meta'][event.target.name] = event.target.value;
    setProjectValue({...newproject});
  };

  const getfields = (uiSp:any) =>{
    return uiSp['views']['start-view']['fields']
  }

  const isready=(uiSp:any)=>{
    if(uiSp['views']['start-view'] !== undefined) return true;
    return false
  }

  const metaTab = () =>{
    return (
      <Grid container>
        <Grid item sm={8} xs={12}>
          Meta List:
        {isready(uiSpec_meta)&& 
          uiSpec_meta['views']['start-view']['fields'].map((fieldName: string) =>
            getComponentFromField(
              uiSpec_meta,
              fieldName,
              formProps,
              handleChangeFormProjectMeta
            )
          )
        }
        </Grid>
        <Grid item sm={12} xs={12}><br/><hr/> Add New Meta Component<br/></Grid>
        <Grid item sm={4} xs={12}>
        {getfields(getprojectform(projectvalue,'projectmetaadd')).map((fieldName: string) =>
            getComponentFromField(
              getprojectform(projectvalue,'projectmetaadd'),
              fieldName,
              formProps,
              (event:any)=>setMetaAdded(event.target.value)
            )
          )
        }
        </Grid>
        <Grid item sm={2} xs={12}><br/><AddUserButton id='submit' type="button" onButtonClick={handleaddmeta} value={metaAdded} /></Grid>
        <Grid item sm={6} xs={12}>
          <Alert severity="info">
            Add Meta component by filling Label and clicking the Add button
          </Alert>
        </Grid>
        
        

        
      </Grid>
    )
  }

  const infoTab = () =>{
    return (
      <Grid container>
            <Grid item sm={8} xs={12}>
              
                  
                        {isready(uiSpec_general)&& (getfields(uiSpec_general).map((fieldName: string) =>
                              getComponentFromField(
                                uiSpec_general,
                                fieldName,
                                formProps,
                                handleChangeFormProject
                              )
                            ))
                            }
                        <br />
                        <ProjectSubmit
                          id="gotonext_info"
                          type="submit"
                          isSubmitting={false}
                          text="Go To Next"
                          onButtonClick={() => setinfotabvalue(1)}
                        />
                        
              <br />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Alert severity="info">
                Give project a name and an description
              </Alert>
            </Grid>
          </Grid>
    )
  }

  const accessTab = () =>{
    return(
    <Grid container>
      <Grid item sm={8} xs={12}>
          <Grid container>
            <Grid item sm={6} xs={12}>
                      {isready(uiSpec_access)&&getfields(uiSpec_access).map((fieldName: string) =>
                            getComponentFromField(
                              uiSpec_access,
                              fieldName,
                              formProps,
                              handleformchangeAccess
                            )
                          )
                        }
                      <Box pl={2} pr={2}>

          <AddUserButton id='submit' type="button" onButtonClick={handleAddAccess} value={accessAdded} /></Box>
            </Grid>
            <Grid item sm={1} xs={12}></Grid>
            <Grid item sm={5} xs={12}>
              <UserRoleList
                users={projectvalue.accesses}
                deleteuserrole={deleteuserrole}
              />
            </Grid>
          </Grid>
      </Grid>
      <Grid item sm={4} xs={12}>
        <Alert severity="info">
          All projects have an admin, moderator, and team roles by
          default. define any new roles required here. You will be able to
          assign users to these roles later in the User tab.
        </Alert>
      </Grid>
      <ProjectSubmit
        id="gotonext_info"
        type="submit"
        isSubmitting={false}
        text="Go To Next"
        onButtonClick={() => props.setProjecttabvalue(1)}
      />
    </Grid>
  
  )
  }


  const attachment = () =>{
    return (
      <Grid>
        {getfields(getprojectform(projectvalue,'attachments')).map((fieldName: string) =>
            getComponentFromField(
              getprojectform(projectvalue,'attachments'),
              fieldName,
              formProps,
              (event:any)=>setMetaAdded(event.target.value)
            )
          )
        }
      </Grid>
    )
  }

  return (
    <Grid container>
      <Grid item sm={12} xs={12}>
        <TabTab
          tabs={['general','Meta','User Role','Attachment']}
          value={infotabvalue}
          handleChange={handleChangetab}
          tab_id="primarytab"
        />
        <TabPanel value={infotabvalue} index={0} tabname="primarytab">
          {infoTab()}
        </TabPanel>
        <TabPanel value={infotabvalue} index={2} tabname="primarytab">
        {accessTab()}
        </TabPanel>
        <TabPanel value={infotabvalue} index={1} tabname="primarytab">
        {metaTab()}
        </TabPanel>
        <TabPanel value={infotabvalue} index={3} tabname="primarytab">
          Add Attachment Here
          {attachment()}
        </TabPanel>
      </Grid>
    </Grid>
  );
}
