import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {NavLink} from 'react-router-dom';
import {Container, Breadcrumbs, Typography, Box, Grid} from '@material-ui/core';
import ProjectCard from '../components/projectCard';
import * as ROUTES from '../../constants/routes';
// import {store} from '../../store';
import {getProjectList} from '../../databaseAccess';
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
  avatar: {
    borderRadius: 8,
    // backgroundColor: red[500],
    backgroundColor: theme.palette.secondary.light,
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
}));

export default function ProjectList() {
  const classes = useStyles();
  // const globalState = useContext(store);
  const pouchProjectList = getProjectList();

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="row-reverse" p={1} m={1}>
        <Breadcrumbs aria-label="breadcrumb">
          <NavLink to={ROUTES.INDEX}>Index</NavLink>
          <Typography color="textPrimary">Projects</Typography>
        </Breadcrumbs>
      </Box>

      <div className={classes.gridRoot}>
        <Grid container spacing={1}>
          {Object.keys(pouchProjectList).length === 0 ? (
            <span>No projects found</span>
          ) : (
            pouchProjectList.map(project_info => {
              return (
                <Grid
                  item
                  xs={12}
                  key={'project-list-grid' + project_info.project_id}
                >
                  <ProjectCard
                    project={project_info}
                    listView={true}
                    showObservations={true}
                    dashboard={false}
                  />
                </Grid>
              );
            })
          )}
        </Grid>
      </div>
    </Container>
  );
}