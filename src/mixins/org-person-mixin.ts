import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { OrgPersonIF } from '@/interfaces'
import { ActionTypes, PartyTypes, RoleTypes } from '@/enums/'

/**
 * Mixin that provides common OrgPerson methods.
 */
@Component({})
export default class OrgPersonMixin extends Vue {
  @Getter isAlterationFiling!: boolean
  @Getter isBenCorrectionFiling!: boolean
  @Getter isEntityTypeSP!: boolean
  @Getter isFirmChangeFiling!: boolean
  @Getter isFirmConversionFiling!: boolean
  @Getter isFirmCorrectionFiling!: boolean
  @Getter isRoleStaff!: boolean
  @Getter isSbcStaff!: boolean

  protected isAllowReplace: boolean = false

  set allowReplace (val: boolean) {
    this.isAllowReplace = val
  }

  get allowReplace (): boolean {
    return this.isAllowReplace
  }

  /** Returns True if the specified org-person can be removed. */
  protected showRemoveBtn (orgPerson: OrgPersonIF): boolean {
    if (this.isAlterationFiling) {
      // alterations don't use this component
      return false
    }
    if (this.isBenCorrectionFiling) {
      return true
    }
    if (this.isFirmChangeFiling) {
      // can remove partner
      // see method for other conditions
      return (
        this.hasRolePartner(orgPerson) ||
        this.allowReplaceDbaCorp
      )
    }
    if (this.isFirmConversionFiling) {
      return true
    }
    if (this.isFirmCorrectionFiling) {
      // see getter for conditions
      return this.allowReplaceDbaCorp
    }
    return false // should never happen
  }

  /**
   * True if replacement of DBA corporation is allowed.
   * Staff only.
   * Change or correction filings only.
   */
  private get allowReplaceDbaCorp (): boolean {
    return (
      this.isEntityTypeSP &&
      // *** TODO: ensure current proprietor is a corp
      (this.isRoleStaff || this.isSbcStaff) &&
      (this.isFirmChangeFiling || this.isFirmCorrectionFiling)
    )
  }

  //
  // Role Type helpers
  //

  private hasRoleByType (orgPerson: OrgPersonIF, type: RoleTypes): boolean {
    return (orgPerson?.roles.some(role => role.roleType === type) || false)
  }

  /** Returns True if the specified orgPerson has the completing party role. */
  hasRoleCompletingParty (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.COMPLETING_PARTY)
  }

  /** Returns True if the specified orgPerson has the director role. */
  hasRoleDirector (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.DIRECTOR)
  }

  /** Returns True if the specified orgPerson has the incorporator role. */
  hasRoleIncorporator (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.INCORPORATOR)
  }

  /** Returns True if the specified orgPerson has the partner role. */
  hasRolePartner (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.PARTNER)
  }

  /** Returns True if the specified orgPerson has the proprietor role. */
  hasRoleProprietor (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.PROPRIETOR)
  }

  /** Returns True if the specified orgPerson has the subscriber role. */
  hasRoleSubscriber (orgPerson: OrgPersonIF): boolean {
    return this.hasRoleByType(orgPerson, RoleTypes.SUBSCRIBER)
  }

  //
  // Party Type helpers
  //

  /** True if the specified orgPerson is a person. */
  isPartyTypePerson (orgPerson: OrgPersonIF): boolean {
    return (orgPerson?.officer.partyType === PartyTypes.PERSON)
  }

  /** True if the specified orgPerson is an organization (corporations/firms only). */
  isPartyTypeOrg (orgPerson: OrgPersonIF): boolean {
    return (orgPerson?.officer.partyType === PartyTypes.ORGANIZATION)
  }

  //
  // Action Type helpers
  //

  /** Returns True if the specified orgPerson was added. */
  wasAdded (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.ADDED))
  }

  /** Returns True if the specified orgPerson was corrected. */
  wasCorrected (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.CORRECTED))
  }

  /** Returns True if the specified orgPerson was edited. */
  wasEdited (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.EDITED))
  }

  /** Returns True if the specified orgPerson was removed. */
  wasRemoved (person: OrgPersonIF): boolean {
    return (person.actions?.includes(ActionTypes.REMOVED))
  }

  /** Returns True if the specified orgPerson was changed. */
  wasChanged (person: OrgPersonIF): boolean {
    return (
      person.actions?.includes(ActionTypes.ADDRESS_CHANGED) ||
      person.actions?.includes(ActionTypes.EMAIL_CHANGED) ||
      person.actions?.includes(ActionTypes.NAME_CHANGED)
    )
  }
}
