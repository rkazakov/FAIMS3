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
 * Filename: project-create.tsx
 * Description:
 *   TODO
 */
import React from 'react';
import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {v4 as uuidv4} from 'uuid';
import grey from '@material-ui/core/colors/grey';

import {Button, Grid, Box, ButtonGroup, Typography,AppBar,Hidden} from '@material-ui/core';
import {Formik, Form, Field, FormikProps,FormikValues} from 'formik';
import FieldsListCard from './tabs/FieldsListCard';
import {SettingCard} from './tabs/PSettingCard';
import {getComponentFromField} from './FormElement';
import {TabTab,TabEditable} from './tabs/TabTab'
import {FieldSettings,getcomponent,getfieldname,convertuiSpecToProps,setProjectInitialValues,getid,updateuiSpec} from './data/ComponentSetting'
import {CusButton,CloseButton,UpButton,DownButton,AddButton} from './tabs/ProjectButton'
import {setUiSpecForProject,getUiSpecForProject} from '../../../uiSpecification';
import {data_dbs, metadata_dbs} from '../../../sync/databases';
import {ProjectUIModel} from '../../../datamodel/ui'
import {create_new_project_dbs}  from '../../../sync/new-project'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  newfield:{
    // backgroundColor:'#e1e4e8',
    // borderTop:'1px solid #e1e4e8',
  },
  newfield_button:{
    textAlign:'right',
  },
  addfield:{
    // border:'1px solid #e1e4e8',
    flexGrow: 1,
    padding: theme.spacing(2),
  }
}));



const NEWFIELDS='newfield'
const sections_default=['SECTION1']
const variant_default=['FORM1']
const projecttabs=['Design','Preview']
const form_defult={'FORM1SECTION1':[]}
const projectname='newnotebook123'
const VISIBLE_TYPE='visible_types'
const variant_label=['main']
export default function CreateProjectCard(props:any) {
    // if(props.project_id===undefined) console.log('New Project'+props.project_id)
    const ini={_id:'new_notbook'}
    const classes = useStyles();
    const [project_id,setProjectID]=useState('');
    const [projectvalue,setProjectValue]=useState(ini)
    const [initialValues,setinitialValues]=useState(ini)
    const [projectuiSpec,setProjectuiSpec] = useState<Array<any>>()
    const [formcomponents,setFormComponents]= useState<any>(form_defult)
    const [formuiSpec,setFormuiSpec]=useState<{fields:any,views:any,viewsets:any,visible_types:any}>({fields:{},views:{},viewsets:{},visible_types:[]})
    const [uiSpec,setUISpec]=useState<{fields:any,views:any,viewsets:any,visible_types:any}>(props.uiSpec)
    const [isAddField,setIsAddField]=useState(true)
    const [currentView,setCurrentView]=useState(sections_default[0])
    const [formlabel,setformlabel]=useState(variant_label[0])
    const [designvalue,setDesignvalue]=useState<any>('settings')
    const [settingvalue,setsettingvalue]=useState<any>({fields:{},views:{}})
    const [formView,setFormView]=useState('start-view')
    const [formvariants,setFormVariants]= useState<any>(variant_default[0])
    const [formuiview,setformuiview]=useState(formvariants+currentView)
    const [formtabs,setformTabs]=useState<Array<string>>([])
    const [sectiontabs,setsectiontabs]=useState<Array<string>>([])
    const [tablists,setTablist]=useState<Array<string>>([])
    const [projecttabvalue,setProjecttabvalue]=useState(0)
    const [error, setError] = useState(null as null | {});



    useEffect(() => {

     setinit();
     if(project_id===''||project_id===null){
        getnewdb();
     }

    }, []);

    useEffect(() => {
      if(uiSpec!==null) {

        generateunifromformui(uiSpec)
        setFormuiSpec(uiSpec);
        console.log(formcomponents)
      }
      console.log('Update Changes')
      console.log(uiSpec)
    }, [uiSpec]);

     useEffect(() => {
      if(project_id!==''&&project_id!==null){
        saveformuiSpec()
        console.log(formuiSpec)
      }
      
    }, [formuiSpec]);

     const generateunifromformui = (formuiS:any) =>{
      const tabs=formtabs
      const {formui,newformcom}=updateuiSpec('newfromui',{formuiSpec:formuiS,formcomponents:formcomponents})
      console.log(formui)
      const newformvariants=formui[VISIBLE_TYPE][0]
      setFormVariants(newformvariants)
      setformTabs(formui[VISIBLE_TYPE].map((tab:string)=>tab=formui['viewsets'][tab]['label']))
      console.log(formvariants)
      setsectiontabs(formui['viewsets'][newformvariants]['views'].map((tab:string)=>tab=formuiSpec['views'][tab]['label']))
      setFormComponents(newformcom)
      setFormuiSpec(formui)
      const tt:Array<any>=[]
      tabs.map((tab:any,index:any)=>tt[index]={label:tab,isedited:false})
      setTablist(tt)
      return true;
    }

    const setinit =()=>{
      if(props.project_id!==undefined){
        getUiSpecForProject(props.project_id).then(setUISpec, setError);
        console.log(formuiSpec)
      }

      // if(props.project_id===undefined){
      // generate empty form
      const view=formvariants+sections_default[0]
      setCurrentView(view);
      const formview=formuiSpec
      formview['views'][view]={'fields':[],uidesign:'form','label':sections_default[0]}
      formview['viewsets']={'FORM1':{views:[view],label:'main'}}
      setFormuiSpec({fields:formuiSpec.fields,views:formview.views,viewsets:formview.viewsets,visible_types:variant_default})
      // const tabs=formview['visible_types'].map((tab:string)=>tab=formview['viewsets'][tab]['label'])
      setformTabs(variant_label)
      setsectiontabs(sections_default)

      setFormComponents((prevalue:any)=>{
        const newvalue=prevalue
        if(newvalue[view]===undefined) newvalue[view]=[]
        return newvalue;
      })
      

    }

    

    const submithandler = (values:any) =>{

    }
    
   

    const handleChangeForm = (event:any,type='change',value='') => {
      
      // setProjectValue()
      saveorsync()
      const {newviews,components}=updateuiSpec('updatefield',{event:event,formuiSpec:formuiSpec,formcomponents:formcomponents,formuiview:formuiview})
      setFormuiSpec({...formuiSpec,fields:newviews.fields})
      setFormComponents(components)
      // return true;
     }

     /****This function is to save data to DB TODO LIST*********/
     const saveorsync = () =>{
     }

    const handleAddField = (id:string) =>{
      const uuid=getid()

      const {newviews,components,newuiSpeclist,newuiSpec}=updateuiSpec('addfield',{uuid:uuid,id:id,formuiSpec:formuiSpec,formcomponents:formcomponents,formuiview:formuiview})
      setinitialValues({...initialValues,...setProjectInitialValues(newuiSpeclist,formView,{})})
      setFormComponents(components)
      setFormuiSpec({fields:newuiSpec,views:newviews,viewsets:formuiSpec.viewsets,visible_types:formuiSpec.visible_types})
      setIsAddField(false)
      console.log(initialValues)

    }

    const handleRemoveField = (index:string)=>{
      const {newviews,components}=updateuiSpec('removefield',{index:index,formuiSpec:formuiSpec,formcomponents:formcomponents,formuiview:formuiview})
      setFormComponents(components)
      setFormuiSpec({...formuiSpec,views:newviews.views})

    }
    const handleAddFieldButton = ()=>{
      setIsAddField(true)
    }
    const handleCloseFieldButton = () =>{
      setIsAddField(false)

    }


    const handleUpFieldButton = (index:any) =>{
      const {newviews,components}=updateuiSpec('switch',{index:index,type:false,formuiSpec:formuiSpec,formcomponents:formcomponents,formuiview:formuiview})
      setFormuiSpec({...formuiSpec,views:newviews.views})
      setFormComponents(components)
    }
    const handleDownFieldButton = (index:any) =>{
      
      const {newviews,components}=updateuiSpec('switch',{index:index,type:true,formuiSpec:formuiSpec,formcomponents:formcomponents,formuiview:formuiview})
      setFormuiSpec({...formuiSpec,views:newviews.views})
      setFormComponents(components)
      
    }

    const handelonClickSetting = (index:any,key:any) =>{

      const formcomponent=formcomponents
        formcomponent[formuiview].map((item:any)=>{
          item.id===key?item['designvalue']=index:item
        }
        )
       
      setFormComponents(formcomponent)
      setDesignvalue(index)


    }

    const handelonChangeSection = (event:any,index:number) =>{
      const id=formuiSpec['viewsets'][formvariants]['views'][index]
      setCurrentView(sectiontabs[index])
      setformuiview(id)
      

    }

    const handelonChangeVariants = (event:any,index:number)=>{
      const id=formuiSpec[VISIBLE_TYPE][index]
      setFormVariants(id)
      setformlabel(formtabs[index])
      
      if(formuiSpec['viewsets'][id]['views'].length>0){
        const tabs:any=[]
        if(formuiSpec['viewsets'][id]['views'].length>0){
          formuiSpec['viewsets'][id]['views'].map((tab:string,number:number)=>tabs[number]=formuiSpec['views'][tab]['label'])
        }
        setsectiontabs(tabs)
        setformuiview(formuiSpec['viewsets'][id]['views'][0])
        setCurrentView(formuiSpec['viewsets'][id]['views'][0])
        
      }
      else{
        setsectiontabs([]);
        setformuiview('')
        setCurrentView('')
        
      }
    }
    const handelonChangeLabel = (tabs:Array<string>,type:string) =>{
      const {newviews,components}=updateuiSpec('formvariants'+type,{tabs:tabs,formuiSpec:formuiSpec,formcomponents:formcomponents})
      setFormuiSpec({fields:formuiSpec.fields,views:newviews.views,viewsets:newviews.viewsets,visible_types:newviews.visible_types})
      
    }

    const handelonChangeLabelSection = (tabs:Array<string>,type:string) =>{
     const {newviews,components}=updateuiSpec('formvsection'+type,{tabs:tabs,formuiSpec:formuiSpec,formcomponents:formcomponents,formvariants:formvariants})
      setFormuiSpec({fields:formuiSpec.fields,views:newviews.views,viewsets:newviews.viewsets,visible_types:newviews.visible_types})
      setFormComponents(components)
    }



    const handleChangetab = (event:any,index:number) =>{
      setProjecttabvalue(index)
      // console.log(index)
    }
    const getfieldsFromCom = (formcomponent:any,view:string,formProps:any) =>{
      const fields=formcomponent.uiSpec['views'][view]['fields'];
      if(fields.length>0) 
        return fields.map((field:any) => {return getComponentFromField(formcomponent.uiSpec,field, formProps,handleChangeForm);
                        })
      return '';
    }


    const saveformuiSpec = async  () =>{
      try{
          console.log(await setUiSpecForProject(metadata_dbs[project_id].local, formuiSpec));
      }catch (err) {
      console.error('databases needs cleaning...');
      console.debug(err);
      }
    }


    const getnewdb = async  () =>{
      try{
       const p_id=await create_new_project_dbs(projectname);
       if(p_id!==null) setProjectID(p_id);
      }catch (err) {
      console.error('databases not created...');
      console.log(err);
      }
    }

  return ( 
    <div className={classes.root}> 
     <Grid container  >
      <Grid item sm={12} xs={12}>
        <AppBar position="static" color='primary'>
          <TabTab tabs={projecttabs} value={projecttabvalue} handleChange={handleChangetab}  tab_id='primarytab'/>
        </AppBar>
      </Grid>
      <Grid item sm={12} xs={12}>
        <TabEditable tabs={formtabs} value={formtabs.indexOf(formlabel)>0?formtabs.indexOf(formlabel):0} handleChange={handelonChangeVariants}  tab_id='subtab' handelonChangeLabel={handelonChangeLabel} />
        <TabEditable tabs={sectiontabs} value={sectiontabs.indexOf(currentView)>0?sectiontabs.indexOf(currentView):0} handleChange={handelonChangeSection}  tab_id='subtab' handelonChangeLabel={handelonChangeLabelSection}/>
      </Grid>
      <Grid item sm={8} xs={12}>  
        <Formik
          initialValues={initialValues}
          validateOnMount={true}
          onSubmit={(values, {setSubmitting}) => {
            setTimeout(() => {
              setSubmitting(false);
              submithandler(values)
            }, 500);}}
        >

        {formProps => {
              return (
                <Form >
                {formuiview!==''&&formcomponents[formuiview].length>0?formcomponents[formuiview].map((formcomponent:any,index:any)=>(
                <Grid container className={classes.newfield} key={`formcompoenet-form-${index}`}>
                <Grid item sm={10} xs={12}>
                  <Grid container spacing={1} >
                    <Grid item sm={4} xs={12} >
                      {getfieldsFromCom(formcomponent,'general',formProps)}
                    </Grid>
                    <Grid item sm={1} xs={3} >          
                      <SettingCard handelonClick={handelonClickSetting} key_id={formcomponent.id}/>  
                    </Grid>
                    <Grid item sm={7} xs={9}>
                      {getfieldsFromCom(formcomponent,formcomponent.designvalue,formProps)}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={2} xs={12} className={classes.newfield_button}>
                  {index>0?<UpButton  onButtonClick={handleUpFieldButton} value={index} id={index} text='X' />:''}
                  {index<formcomponents[formuiview].length-1?<DownButton  onButtonClick={handleDownFieldButton} value={index} id={index} text='X' />:''}
                  <CloseButton  onButtonClick={handleRemoveField} value={formcomponent.id} id={formcomponent.id} text='X' />
                </Grid>
                </Grid>
                )):''}
                </Form>
              );
        }}
        </Formik>
        <AddButton  onButtonClick={handleAddFieldButton}  text='ADD' />
        {isAddField?
        <Grid container className={classes.addfield} >
          <Grid item sm={11} xs={11}>
          <FieldsListCard cretenefield={handleAddField} />
          </Grid>
          <Grid item sm={1} xs={1} className={classes.newfield_button}>  
            <CloseButton  onButtonClick={handleCloseFieldButton} text='X' />
          </Grid>
        </Grid>
        :''}
      </Grid>
      <Grid item sm={4} xs={12}>
        <Box
              bgcolor={grey[200]}
              pl={2}
              pr={2}
              style={{overflowX: 'scroll'}}
            >
              <pre>{JSON.stringify(formuiSpec, null, 2)}</pre>
        </Box>
      </Grid>
    </Grid>
  </div>

  );
}

