//@flow
import { keyBy, values, range, forEach, findIndex, some, map, chain } from 'lodash'
import { toastr } from 'react-redux-toastr'
import { push, replace } from 'redux-little-router'
import { backend } from '../api'
import { selectedDashboardSelector, deletingDashboardSelector } from './selectors'
import type { Plugin, Prop } from '../plugins'
import type {
  SelectPluginAction,
  PluginInstance,
  AddPluginThunkAction,
  DeletePluginAction,
  SaveLayoutAction,
  UpdateConfigAction,
  Layout,
  Dashboard,
  ChangePropAction,
  DashboardThunk,
  SelectDashboardAction,
  UnselectDashboardAction,
  AddDashboardThunkAction,
  DeleteDashboardAction,
  RequireDashboardDeletionAction,
  DashboardDeletionThunk,
  DashboardDeletedAction,
  CancelDashboardDeletionAction,
  AddSubPluginAction,
  SelectPluginParentAction,
  ReorderSubPluginAction,
  ActivateDashboardThunk,
  DeactivateDashboardThunk,
} from './type'

export const actions = {
  SELECT_PLUGIN: 'DASHBOARD/SELECT_PLUGIN',
  SELECT_DASHBOARD: 'DASHBOARD/SELECT_DASHBOARD',
  UNSELECT_DASHBOARD: 'DASHBOARD/UNSELECT_DASHBOARD',
  REQUIRE_DASHBOARD_DELETION: 'DASHBOARD/REQUIRE_DASHBOARD_DELETION',
  DASHBOARD_DELETED: 'DASHBOARD/DASHBOARD_DELETED',
  CANCEL_DASHBOARD_DELETION: 'DASHBOARD/CANCEL_DASHBOARD_DELETION',
  DELETE_DASHBOARD: 'DASHBOARD/DELETE_DASHBOARD',
  ADD_DASHBOARD: 'DASHBOARD/ADD_DASHBOARD',
  ADD_PLUGIN: 'DASHBOARD/ADD_PLUGIN',
  ADD_SUB_PLUGIN: 'DASHBOARD/ADD_SUB_PLUGIN',
  DELETE_PLUGIN: 'DASHBOARD/DELETE_PLUGIN',
  CHANGE_PROP: 'DASHBOARD/CHANGE_PROP',
  SAVE_LAYOUT: 'DASHBOARD/SAVE_LAYOUT',
  UPLOAD_STARTED: 'DASHBOARD/UPLOAD_STARTED',
  UPLOAD_SUCCESSED: 'DASHBOARD/UPLOAD_SUCCESSED',
  UPLOAD_FAILED: 'DASHBOARD/UPLOAD_FAILED',
  UPDATE_CONFIG: 'DASHBOARD/UPDATE_CONFIG',
  SELECT_PLUGIN_PARENT: 'DASHBOARD/SELECT_PLUGIN_PARENT',
  REORDER_SUB_PLUGINS: 'DASHBOARD/REORDER_SUB_PLUGINS',
  ACTIVATE_DASHBOARD: 'DASHBOARD/ACTIVATE_DASHBOARD',
  DEACTIVATE_DASHBOARD: 'DASHBOARD/DEACTIVATE_DASHBOARD',
}

export const selectPlugin = (plugin: PluginInstance): SelectPluginAction => ({
  type: actions.SELECT_PLUGIN,
  payload: { instanceId: plugin.instanceId },
})

export const selectDashboard = (dashboard: Dashboard): SelectDashboardAction => ({
  type: actions.SELECT_DASHBOARD,
  payload: { dashboardId: dashboard.id },
})

export const unselectDashboard = (): UnselectDashboardAction => ({
  type: actions.UNSELECT_DASHBOARD,
})

export const requireDashboardDeletion = (dashboard: Dashboard): RequireDashboardDeletionAction => ({
  type: actions.REQUIRE_DASHBOARD_DELETION,
  payload: { dashboardId: dashboard.id },
})

export const confirmDashboardDeletion: DashboardDeletionThunk = () => (dispatch, getState) => {
  const deleting = deletingDashboardSelector(getState())
  if (!deleting) throw new Error('There is no deleting media')

  backend
    .deleteDashboard(deleting)
    .then(() => {
      dispatch(dashboardDeleted())
      toastr.success('Le média à été supprimé')
      dispatch(replace('/medias'))
    })
    .catch(error => {
      dispatch(cancelDashboardDeletion())
      toastr.error('Erreur lors de la suppression du media', error)
    })
}

export const dashboardDeleted = (): DashboardDeletedAction => ({
  type: actions.DASHBOARD_DELETED,
})

export const cancelDashboardDeletion = (): CancelDashboardDeletionAction => ({
  type: actions.CANCEL_DASHBOARD_DELETION,
})

export const deleteDashboard = (dashboard: Dashboard): DeleteDashboardAction => ({
  type: actions.DELETE_DASHBOARD,
  payload: { dashboardId: dashboard.id },
})

export const addDashboard = (): AddDashboardThunkAction => dispatch => {
  backend
    .createDashboard()
    .then(dashboard => {
      dashboard.stylesvar = {
        'background-color': '#ffffff',
        'primary-color': '#000000',
        'secondary-color': '#000000',
      }
      return backend.saveDashboard(dashboard).then(() => dashboard)
    })
    .then(dashboard => {
      dispatch({
        type: actions.ADD_DASHBOARD,
        payload: { dashboard },
      })
      dispatch(push(`/medias/${dashboard.id}`))
    })
    .catch(error => {
      toastr.error('Erreur lors de la création du dashboard')
      console.error(error)
    })
}

export const addSubPlugin = (propName: string, plugin: Plugin): AddSubPluginAction => ({
  type: actions.ADD_SUB_PLUGIN,
  payload: { propName, plugin },
})

export const addPlugin = (plugin: Plugin): AddPluginThunkAction => (dispatch, getState) => {
  const dashboard: ?Dashboard = selectedDashboardSelector(getState())
  if (!dashboard)
    return toastr.error(
      "Erreur: Impossible d'ajouter un plugin",
      'Un dashboard doit être sélectionné',
    )

  const { rows, cols, plugins: pluginsMap } = dashboard
  const plugins: PluginInstance[] = values(pluginsMap)

  const freeSpaceMatrix = range(cols).map(() => range(rows).map(() => true))

  forEach(plugins, plugin =>
    range(plugin.x, plugin.x + plugin.cols).forEach(x =>
      range(plugin.y, plugin.y + plugin.rows).forEach(y => {
        freeSpaceMatrix[x][y] = false
      }),
    ),
  )

  const freeSpaceX = findIndex(freeSpaceMatrix, some)
  if (freeSpaceX === -1) return toastr.error('Erreur !', "Il n'y a plus de place pour ce plugin")
  const freeSpaceY = findIndex(freeSpaceMatrix[freeSpaceX])

  dispatch({
    type: actions.ADD_PLUGIN,
    payload: { plugin, x: freeSpaceX, y: freeSpaceY },
  })
}

export const deletePlugin = (plugin: Plugin): DeletePluginAction => ({
  type: actions.DELETE_PLUGIN,
  payload: { plugin },
})

export const reorderSubPlugins = (plugins: PluginInstance[]): ReorderSubPluginAction => ({
  type: actions.REORDER_SUB_PLUGINS,
  payload: {
    instanceIds: map(plugins, 'instanceId'),
    parent: chain(plugins)
      .head()
      .get('parent')
      .value(),
  },
})

export const changeProp = (plugin: PluginInstance, prop: Prop, value: mixed): ChangePropAction => ({
  type: actions.CHANGE_PROP,
  payload: {
    instanceId: plugin.instanceId,
    prop,
    value,
  },
})

export const saveLayout = (layout: Layout): SaveLayoutAction => ({
  type: actions.SAVE_LAYOUT,
  payload: { layout: keyBy(layout, 'i') },
})

export const uploadLayout = (): DashboardThunk => (dispatch, getState) => {
  const state = getState()
  const dashboard = selectedDashboardSelector(state)
  if (!dashboard) throw new Error('A dashboard should be selected')

  dispatch({ type: actions.UPLOAD_STARTED })

  backend
    .saveDashboard(dashboard)
    .then(() => {
      dispatch({ type: actions.UPLOAD_SUCCESSED })
      toastr.success('Enregistré', 'Le dashboard à bien été enregistré')
    })
    .catch(error => {
      dispatch({ type: actions.UPLOAD_FAILED, payload: { error } })
      toastr.error("Erreur lors de l'enregistrement")
      console.error(error)
    })
}

export const updateConfig = (property: string) => (value: string | number): UpdateConfigAction => {
  return {
    type: actions.UPDATE_CONFIG,
    payload: { property, value },
  }
}

export const selectPluginParent = (): SelectPluginParentAction => ({
  type: actions.SELECT_PLUGIN_PARENT,
})

export const activateDashboard = (dashboardId: string): ActivateDashboardThunk => dispatch => {
  backend
    .activateDashboard(dashboardId)
    .then(() =>
      dispatch({
        type: actions.ACTIVATE_DASHBOARD,
        payload: { dashboardId },
      }),
    )
    .catch(() => toastr.error("Erreur lors de l'activation de ce media"))
}

export const deactivateDashboard = (dashboardId: string): DeactivateDashboardThunk => dispatch => {
  backend
    .deactivateDashboard(dashboardId)
    .then(() =>
      dispatch({
        type: actions.DEACTIVATE_DASHBOARD,
        payload: { dashboardId },
      }),
    )
    .catch(() => toastr.error('Erreur lors de la désactivation de ce media'))
}
