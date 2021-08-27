import { Injectable } from '@angular/core';
import { DataLoading, DataLoadingState, Invite, Organization } from '@compito/api-interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import produce from 'immer';
import { tap } from 'rxjs/operators';
import { OrgService } from '../orgs.service';
import { OrgsAction } from './orgs.actions';

export class OrgsStateModel {
  public orgs: Organization[] = [];
  public orgsFetched = false;
  public orgsLoading: DataLoading = { type: DataLoadingState.init };
  public invites: Invite[] = [];
  public invitesFetched = false;
  public invitesLoading: DataLoading = { type: DataLoadingState.init };
  public orgDetail: Organization | null = null;
  public orgDetailFetched = false;
  public orgDetailLoading: DataLoading = { type: DataLoadingState.init };
}

const defaults: OrgsStateModel = {
  orgs: [],
  orgsLoading: { type: DataLoadingState.init },
  orgsFetched: false,
  invites: [],
  invitesLoading: { type: DataLoadingState.init },
  invitesFetched: false,
  orgDetail: null,
  orgDetailLoading: { type: DataLoadingState.init },
  orgDetailFetched: false,
};

@State<OrgsStateModel>({
  name: 'orgs',
  defaults,
})
@Injectable()
export class OrgsState {
  @Selector()
  static getAllOrgs(state: OrgsStateModel) {
    return state.orgs;
  }
  @Selector()
  static getAllInvites(state: OrgsStateModel) {
    return state.invites;
  }
  @Selector()
  static orgsLoading(state: OrgsStateModel) {
    if (state.orgsFetched && state.orgsLoading.type !== DataLoadingState.error) {
      return { type: DataLoadingState.success };
    }
    return state.orgsLoading;
  }
  @Selector()
  static orgsFetched(state: OrgsStateModel) {
    return state.orgsFetched;
  }
  @Selector()
  static orgDetailLoading(state: OrgsStateModel) {
    return state.orgDetailLoading;
  }
  @Selector()
  static getOrgDetail(state: OrgsStateModel) {
    return state.orgDetail;
  }

  @Selector()
  static invitesLoading(state: OrgsStateModel) {
    if (state.invitesFetched && state.invitesLoading.type !== DataLoadingState.error) {
      return { type: DataLoadingState.success };
    }
    return state.invitesLoading;
  }
  constructor(private orgService: OrgService) {}

  @Action(OrgsAction.Add)
  add({ setState }: StateContext<OrgsStateModel>, { payload }: OrgsAction.Add) {
    return this.orgService.create(payload).pipe(
      tap((result) => {
        setState(
          patch({
            orgs: append([result]),
          }),
        );
      }),
    );
  }

  @Action(OrgsAction.Delete)
  delete({ setState }: StateContext<OrgsStateModel>, { id }: OrgsAction.Delete) {
    return this.orgService.delete(id).pipe(
      tap(() => {
        setState(
          patch({
            orgs: removeItem<Organization>((org) => org?.id === id),
          }),
        );
      }),
    );
  }

  @Action(OrgsAction.Update)
  update({ setState }: StateContext<OrgsStateModel>, { payload, id }: OrgsAction.Update) {
    return this.orgService.update(id, payload).pipe(
      tap((project) => {
        setState(patch({ orgs: updateItem<Organization>((item) => item?.id === id, project) }));
      }),
    );
  }

  @Action(OrgsAction.AcceptInvite)
  acceptInvite({ setState, dispatch }: StateContext<OrgsStateModel>, { id }: OrgsAction.AcceptInvite) {
    return this.orgService.acceptInvite(id).pipe(
      tap(() => {
        dispatch(new OrgsAction.GetAll());
        setState(
          patch({
            invites: removeItem<Invite>((invite) => invite?.id === id),
          }),
        );
      }),
    );
  }

  @Action(OrgsAction.RejectInvite)
  rejectInvite({ setState }: StateContext<OrgsStateModel>, { id }: OrgsAction.RejectInvite) {
    return this.orgService.rejectInvite(id).pipe(
      tap(() => {
        setState(
          patch({
            invites: removeItem<Invite>((invite) => invite?.id === id),
          }),
        );
      }),
    );
  }

  @Action(OrgsAction.GetAll)
  getAll({ patchState }: StateContext<OrgsStateModel>) {
    patchState({
      orgsLoading: { type: DataLoadingState.loading },
    });
    return this.orgService.getAll().pipe(
      tap(
        (result) => {
          patchState({
            orgs: result.payload,
            orgsLoading: { type: DataLoadingState.success },
            orgsFetched: true,
          });
        },
        () => {
          patchState({
            orgsLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }

  @Action(OrgsAction.GetInvites)
  getInvites({ patchState }: StateContext<OrgsStateModel>) {
    patchState({
      invitesLoading: { type: DataLoadingState.loading },
    });
    return this.orgService.getAllInvites().pipe(
      tap(
        (result) => {
          patchState({
            invites: result,
            invitesLoading: { type: DataLoadingState.success },
            invitesFetched: true,
          });
        },
        () => {
          patchState({
            invitesLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }

  @Action(OrgsAction.Get)
  get({ patchState }: StateContext<OrgsStateModel>, { id }: OrgsAction.Get) {
    patchState({
      orgDetailLoading: { type: DataLoadingState.loading },
    });
    return this.orgService.getSingle(id).pipe(
      tap(
        (data) => {
          patchState({
            orgDetail: data,
            orgDetailLoading: { type: DataLoadingState.success },
            orgDetailFetched: true,
          });
        },
        () => {
          patchState({
            orgDetailLoading: { type: DataLoadingState.error },
          });
        },
      ),
    );
  }

  @Action(OrgsAction.UpdateMembers)
  updateMembers({ patchState }: StateContext<OrgsStateModel>, { id, payload }: OrgsAction.UpdateMembers) {
    return this.orgService.updateMembers(id, payload).pipe(
      tap((data) => {
        patchState({ orgDetail: data });
      }),
    );
  }

  @Action(OrgsAction.AddProject)
  addProjectToOrg({ patchState, getState }: StateContext<OrgsStateModel>, { payload, orgId }: OrgsAction.AddProject) {
    const orgDetail = getState().orgDetail;
    if (orgDetail?.id === orgId) {
      const orgDetailUpdated = produce(orgDetail, (draft) => {
        draft?.projects.push(payload);
      });
      patchState({ orgDetail: orgDetailUpdated });
    }
  }

  @Action(OrgsAction.DeleteProject)
  deleteProjectFromOrg(
    { patchState, getState }: StateContext<OrgsStateModel>,
    { projectId, orgId }: OrgsAction.DeleteProject,
  ) {
    const orgDetail = getState().orgDetail;
    if (orgDetail?.id === orgId) {
      const orgDetailUpdated = produce(orgDetail, (draft) => {
        const projectIndex = draft?.projects.findIndex(({ id }) => id === projectId);
        if (projectIndex >= 0) {
          draft?.projects.splice(projectIndex, 1);
        }
      });
      patchState({ orgDetail: orgDetailUpdated });
    }
  }
}
