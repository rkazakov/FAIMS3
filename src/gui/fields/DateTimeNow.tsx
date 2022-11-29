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

type DateTimeNowProps = {
  is_auto_pick?: boolean;
  disabled?: boolean;
};

export function DateTimeNow(props: TextFieldProps & DateTimeNowProps) {
  /**
   * Store value as ISO, but <input> elements of type datetime-local
   * requires format yyyy-MM-ddTHH:mm:ss. We separate the two by keeping
   * a local state displayValue for rendering, and use the formik value to
   * store the ISO format datetime.
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
  const {helperText, is_auto_pick, ...others} = props;

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
  useEffect(() => {
    // set intial time when user open the notebook
    if (is_auto_pick === true && value === '') {
      try {
        const now = getLocalDate(new Date());
        setDisplayValue(now);
        handleValues(now);
      } catch (err) {
        setFieldError(name, 'Could not set displayValue. Contact support.');
        console.error(err);
      }
    }
  }, []);

  return (
    <React.Fragment>
      <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 1, sm: 0}}>
        <MuiTextField
          {...fieldToTextField(others)}
          label={props.label}
          type="datetime-local"
          inputProps={{
            step: 1, // this allows for 1s granularity
          }}
          sx={{
            // minWidth: 250,
            '& .MuiOutlinedInput-root': {borderRadius: '3px 0px 0px 4px'},
          }}
          onChange={onChange}
          InputLabelProps={{
            shrink: true,
          }}
          value={displayValue}
          error={!!props.form.errors[name]}
        />
        {props.disabled !== true && ( //add for view and conflict model
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
        )}
      </Stack>
      <FormHelperText
        children={props.helperText ? helperText : 'Select a date and time'}
      />
      {props.form.errors[name] && (
        <FormHelperText error={true} children={props.form.errors[name]} />
      )}
    </React.Fragment>
  );
}
// TODO Kate to fill in for notebook editor
export function DateTimeNowComponentSettings(props: componenentSettingprops) {
  const {handlerchangewithview, ...others} = props;
  const handlerchanges = (event: FAIMSEVENTTYPE) => {
    console.log(event);
  };
  const handlerchangewithviewSpec = (event: FAIMSEVENTTYPE, view: string) => {
    //any actions that could in this form
    const name = event.target.name.replace(props.fieldName, '');
    if (name === 'is_auto_pick') {
      const newvalues = props.uiSpec;
      newvalues['fields'][props.fieldName]['component-parameters'][
        'is_auto_pick'
      ] = event.target.checked;
      props.setuiSpec({...newvalues});
    } else handlerchangewithview(event, view);
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
    is_auto_pick: false,
  },
  validationSchema: [['yup.string']],
  initialValue: '',
};

const UISetting = () => {
  const newuiSetting: ProjectUIModel = getDefaultuiSetting();
  newuiSetting['fields']['is_auto_pick'] = {
    'component-namespace': 'faims-custom', // this says what web component to use to render/acquire value from
    'component-name': 'Checkbox',
    'type-returned': 'faims-core::Bool', // matches a type in the Project Model
    'component-parameters': {
      name: 'multiple',
      id: 'multiple',
      required: false,
      type: 'checkbox',
      FormControlLabelProps: {
        label: 'Time pre-populated',
      },
      FormHelperTextProps: {
        children:
          'When the record is first created, populate this field with the current datetime',
      },
    },
    validationSchema: [['yup.bool']],
    initialValue: false,
  };

  newuiSetting['views']['FormParamater']['fields'] = [
    'helperText',
    'is_auto_pick',
  ];

  newuiSetting['viewsets'] = {
    settings: {
      views: ['InputLabelProps', 'FormParamater'],
      label: 'settings',
    },
  };

  return newuiSetting;
};

export function getDateTimeNowBuilderIcon() {
  return <BookmarksIcon />;
}
export const DateTimeNowSetting = [UISetting(), uiSpec];
