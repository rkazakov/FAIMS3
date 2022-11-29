import React, {useEffect} from 'react';
import {Stack, Button, FormHelperText} from '@mui/material';
// import moment from 'moment';
import {fieldToTextField, TextFieldProps} from 'formik-mui';
import MuiTextField from '@mui/material/TextField';
import {
  ProjectUIModel,
  componenentSettingprops,
  FAIMSEVENTTYPE,
} from '../../datamodel/ui';
import {
  DefaultComponentSetting,
  getDefaultuiSetting,
} from './BasicFieldSettings';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
export function getLocalDate(value: Date) {
  /**
   * Return local time in yyyy-MM-ddTHH:mm:ss format by converting to
   * ISO (which only returns UTC), shifting to your local TZ,
   * and chopping off the Z
   *
   * Add the timezone offset and convert to an ISO date,
   * then strip the timezone with the substring(0, 16)
   */
  // getTimezoneOffset returns your local timezone offset in minutes
  const offset = value.getTimezoneOffset() * 1000 * 60; // convert to ms
  const offsetDate = new Date(value).valueOf() - offset; // (valueOf returns milliseconds)
  const date = new Date(offsetDate).toISOString();
  return date.substring(0, 19);

  // the equivalent with moment.js
  // return moment(value).utcOffset(0, true).format('YYYY-MM-DDTHH:mm:ss');
}

export function DateTimeNow(props: TextFieldProps) {
  /**
   * Store value as ISO, but <input> elements of type datetime-local
   * requires format yyyy-MM-ddTHH:mm:ss. We separate the two by keeping
   * a local state displayValue for rendering, and use the formik value to
   * store the ISO formated datetime.
   *
   *
   * value: the formik-controlled value
   * displayValue: the input-expected value of format yyyy-MM-ddTHH:mm:ss
   */
  const {
    form: {setFieldValue, setFieldError},
    field: {name, value},
  } = props;

  const [displayValue, setDisplayValue] = React.useState('');

  const handleValues = (newValue: string) => {
    /**
     * The internal value is ISO, display value is yyyy-MM-ddTHH:mm:ss
     */
    const date = new Date(newValue);
    setFieldValue(name, date.toISOString());
  };

  const onChange = React.useCallback(
    event => {
      const {value} = event.target;
      handleValues(value);
    },
    [setFieldValue, name]
  );

  const onClick = React.useCallback(() => {
    // Populate the form with time now to within 1s.
    handleValues(getLocalDate(new Date()));
  }, [setFieldValue, name]);

  useEffect(() => {
    // if the value is updated, update the rendered value too
    if (value) {
      try {
        setDisplayValue(getLocalDate(new Date(value)));
      } catch (err) {
        setFieldError(name, 'Could not set displayValue. Contact support.');
        console.error(err);
      }
    }
  }, [value]);
  return (
    <React.Fragment>
      <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 1, sm: 0}}>
        <MuiTextField
          {...fieldToTextField(props)}
          label={props.label}
          type="datetime-local"
          inputProps={{
            step: 1, // this allows for 1s granularity
          }}
          sx={{
            minWidth: 250,
            '& .MuiOutlinedInput-root': {borderRadius: '4px 0px 0px 4px'},
          }}
          onChange={onChange}
          InputLabelProps={{
            shrink: true,
          }}
          value={displayValue}
          error={!!props.form.errors[name]}
        />
        <Button
          variant="contained"
          disableElevation
          aria-label="capture time now"
          onClick={onClick}
          sx={{
            borderRadius: {xs: '3px', sm: '0px 3px 3px 0px'},
          }}
        >
          Now
        </Button>
      </Stack>
      <FormHelperText
        children={
          props.helperText ? props.helperText : 'Select a date and time'
        }
      />
      {props.form.errors[name] && (
        <FormHelperText error={true} children={props.form.errors[name]} />
      )}
      {/*<br />*/}
      {/*value: {value}*/}
      {/*<br />*/}
      {/*displayValue: {displayValue}*/}
      {/*<Button onClick={() => setFieldError(name, 'ttest that')}>error</Button>*/}
    </React.Fragment>
  );
}
// TODO Kate to fill in for notebook editor
export function DateTimeNowComponentSettings(props: componenentSettingprops) {
  const {handlerchangewithview, ...others} = props;
  const handlerchanges = (event: FAIMSEVENTTYPE) => {};
  const handlerchangewithviewSpec = (event: FAIMSEVENTTYPE, view: string) => {
    //any actions that could in this form
    props.handlerchangewithview(event, view);
  };

  return (
    <DefaultComponentSetting
      handlerchangewithview={handlerchangewithviewSpec}
      handlerchanges={handlerchanges}
      {...others}
      fieldui={props.fieldui}
    />
  );
}
const uiSpec = {
  'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
  'component-name': 'DateTimeNow',
  'type-returned': 'faims-core::String', // matches a type in the Project Model
  'component-parameters': {
    fullWidth: true,
    helperText:
      'Add a datetime stamp (click now to record the current date+time)',
    variant: 'outlined',
    required: false,
    InputLabelProps: {
      label: 'DateTimeNow Field',
    },
  },
  validationSchema: [['yup.string']],
  initialValue: '',
};

const UISetting = () => {
  const newuiSetting: ProjectUIModel = getDefaultuiSetting();
//   // newuiSetting['fields']['datetime_now'] = {
//   //   'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
//   //   'component-name': 'DateTimeNow',
//   //   'type-returned': 'faims-core::String', // matches a type in the Project Model
//   //   'component-parameters': {
//   //     fullWidth: true,
//   //     helperText: '',
//   //     variant: 'outlined',
//   //     required: true,
//   //     InputProps: {},
//   //     SelectProps: {},
//   //     ElementProps: {},
//   //     InputLabelProps: {
//   //       label:
//   //         'Add a datetime stamp (clicking now records the current date+time).',
//   //     },
//   //   },
//   //   validationSchema: [['yup.string']],
//   //   initialValue: '',
//   // };
//   // newuiSetting['views']['FormParameter']['fields'] = ['helperText'];


  newuiSetting['viewsets'] = {
    settings: {
      views: ['InputLabelProps','FormParamater'],
      label: 'settings',
    },
  };

  return newuiSetting;
};

export function getDateTimeNowBuilderIcon() {
  return <BookmarksIcon />;
}
export const DateTimeNowSetting = [UISetting(), uiSpec];
