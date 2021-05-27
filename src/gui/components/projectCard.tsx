import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Card,
  Chip,
  CardActions,
  CardContent,
  CardHeader,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Link,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
// import {EmailShareButton} from 'react-share';
// import MailOutlineIcon from '@material-ui/icons/MailOutline';
// import {Plugins} from '@capacitor/core';
// const {Share} = Plugins;
import {Link as RouterLink} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {makeStyles} from '@material-ui/core/styles';
import {ProjectObject} from '../../datamodel';
import ObservationsTable from './observationsTable';
import MetadataRenderer from './metadataRenderer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TimelapseIcon from '@material-ui/icons/Timelapse';

type ProjectCardProps = {
  project: ProjectObject;
  listing_id_project_id: string;
  showObservations: boolean;
  listView: boolean;
  dashboard: boolean;
};

const useStyles = makeStyles(theme => ({
  gridRoot: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cardHeader: {
    alignItems: 'flex-start',
  },
  avatar: {
    borderRadius: 8,
    // backgroundColor: red[500],
    backgroundColor: theme.palette.primary.light,
  },
  overline: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
  },
  status: {
    display: 'inline',
    // fontSize: '0.8rem',
  },
}));

export default function ProjectCard(props: ProjectCardProps) {
  const {
    project,
    listing_id_project_id,
    showObservations,
    listView,
    dashboard,
  } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  // const webShare = 'share' in navigator; // Detect whether webshare api is available in browser
  const project_url = ROUTES.PROJECT + (listing_id_project_id || 'dummy');

  // const getShare = async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const shareRet = await Share.share({
  //     title: 'FAIMS Project: ' + project.name,
  //     text: 'Really awesome project you need to see right now',
  //     url: project_url,
  //     dialogTitle: 'Share ' + project.name,
  //   });
  // };

  useEffect(() => {
    if (typeof project !== 'undefined' && Object.keys(project).length > 0) {
      setLoading(false);
    }
  }, [project]);

  return (
    <React.Fragment>
      {loading ? (
        <CircularProgress size={12} thickness={4} />
      ) : dashboard ? (
        <List style={{padding: 0}}>
          <ListItem
            button
            alignItems="flex-start"
            component={RouterLink}
            to={project_url}
          >
            <ListItemAvatar>
              <Avatar aria-label={project.name} className={classes.avatar}>
                {project.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={project.name}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.status}
                    color="textSecondary"
                  >
                    Last updated {project.last_updated}
                  </Typography>
                  <br />
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.status}
                    color="textPrimary"
                  >
                    {project.description}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      ) : (
        <Card>
          <CardHeader
            className={classes.cardHeader}
            avatar={
              <Avatar aria-label={project.name} className={classes.avatar}>
                {project.name.charAt(0)}
              </Avatar>
            }
            action={
              <Box p={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  component={RouterLink}
                  to={project_url + ROUTES.OBSERVATION_CREATE}
                >
                  New Observation
                </Button>
              </Box>
            }
            title={
              <React.Fragment>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <b>{project.name}</b>&nbsp;
                  {!listView ? (
                    <React.Fragment>
                      <Typography
                        variant={'caption'}
                        style={{cursor: 'not-allowed'}}
                        color={'textSecondary'}
                      >
                        <i>edit title&nbsp;&nbsp;</i>
                      </Typography>
                      <TimelapseIcon
                        color={'secondary'}
                        style={{fontSize: '13px'}}
                      />
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </div>
              </React.Fragment>
            }
            subheader={
              'Created' +
              project.created +
              ', last observation updated ' +
              project.last_updated
            }
          />
          <CardContent style={{paddingTop: 0}}>
            <Box mb={2}>
              <Chip
                size={'small'}
                label={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>Active team members: 10</span>&nbsp;{' '}
                    <TimelapseIcon
                      color={'secondary'}
                      style={{fontSize: '13px'}}
                    />
                  </div>
                }
                style={{marginRight: '5px'}}
              />
              <Chip
                size={'small'}
                label={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>Status: active</span>&nbsp;{' '}
                    <TimelapseIcon
                      color={'secondary'}
                      style={{fontSize: '13px'}}
                    />
                  </div>
                }
                style={{marginRight: '5px'}}
              />
              <MetadataRenderer
                project_id={project._id}
                metadata_key={'project_lead'}
                metadata_label={'Project Lead'}
              />{' '}
              <MetadataRenderer
                project_id={project._id}
                metadata_key={'lead_institution'}
                metadata_label={'Lead Institution'}
              />
            </Box>

            <Typography variant="body2" color="textPrimary" component="p">
              {project.description}&nbsp;
              <br />
              {listView ? (
                ''
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography
                    variant={'caption'}
                    style={{cursor: 'not-allowed'}}
                    color={'textSecondary'}
                  >
                    <i>edit description&nbsp;&nbsp;</i>
                  </Typography>
                  <TimelapseIcon
                    color={'secondary'}
                    style={{fontSize: '14px'}}
                  />
                </div>
              )}
            </Typography>

            {showObservations ? (
              <Box mt={1}>
                <ObservationsTable
                  listing_id_project_id={listing_id_project_id}
                  restrictRows={10}
                  compact={listView}
                />
              </Box>
            ) : (
              ''
            )}
          </CardContent>
          {listView ? (
            <CardActions>
              <Box pl={1}>
                <Link
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                  component={RouterLink}
                  to={project_url}
                >
                  View Project
                  <ChevronRightIcon />
                </Link>
              </Box>
            </CardActions>
          ) : (
            ''
          )}
          {/*{listView ? (*/}
          {/*  ''*/}
          {/*) : (*/}
          {/*  <CardActions>*/}
          {/*    {webShare ? (*/}
          {/*      <Button size="small" color="primary" onClick={getShare}>*/}
          {/*        Share*/}
          {/*      </Button>*/}
          {/*    ) : (*/}
          {/*      <EmailShareButton*/}
          {/*        url={project_url}*/}
          {/*        subject={'FAIMS Project: ' + project.name}*/}
          {/*        body={"I'd like to share this FAIMS project with you "}*/}
          {/*        resetButtonStyle={false}*/}
          {/*        className={*/}
          {/*          'MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall'*/}
          {/*        }*/}
          {/*      >*/}
          {/*        <span className="MuiButton-label">*/}
          {/*          <span className="MuiButton-startIcon MuiButton-iconSizeSmall">*/}
          {/*            <MailOutlineIcon*/}
          {/*              className="MuiSvgIcon-root"*/}
          {/*              viewBox={'0 0 24 24'}*/}
          {/*            />*/}
          {/*          </span>*/}
          {/*          Share*/}
          {/*        </span>*/}
          {/*        <span className="MuiTouchRipple-root" />*/}
          {/*      </EmailShareButton>*/}
          {/*    )}*/}
          {/*  </CardActions>*/}
          {/*)}*/}
        </Card>
      )}
    </React.Fragment>
  );
}
ProjectCard.defaultProps = {
  showObservations: false,
  listView: false,
  dashboard: false,
};
