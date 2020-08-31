<template>
  <div>
    <section>
      <header class="mt-4">
        <h1>Correction - Incorporation Application</h1>
      </header>

      <div class="original-filing-date mt-6" v-if="isTypeBcomp">
        <p>
          <span class="original-filing-date-label">Original Filing Date:</span>
          {{ filingDateLocal }}
        </p>
      </div>

      <div class="benefit-company-statement mt-6" v-if="isTypeBcomp">
        <p>
          <span class="benefit-company-statement-label">{{ BenefitCompanyStatementResource.title }}:</span>
          {{ BenefitCompanyStatementResource.description }}
        </p>
      </div>

      <SummaryDefineCompany :isSummary="true" />
      <!-- TODO: recognition date and time (as part of SummaryDefineCompany) -->
      <!-- TODO: folio number (as part of SummaryDefineCompany) -->
      <ListPeopleAndRoles :personList="getOrgPeople" :isSummary="true" />
      <ListShareClass :shareClasses="getShareClasses" :isSummary="true" />
      <AgreementType :isSummary="true" />
      <!-- TODO: original completing party -->
      <!-- TODO: 1. detail -->
      <!-- TODO: 2. certify -->
      <!-- TODO: 3. staff payment -->
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { featureFlags } from '@/utils'

// Components
import { SummaryDefineCompany } from '@/components/DefineCompany'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { AgreementType } from '@/components/IncorporationAgreement'

// Mixins, Interfaces and Enums
import { DateMixin, FilingTemplateMixin, LegalApiMixin } from '@/mixins'
import { ActionBindingIF, FilingDataIF, GetterIF, OrgPersonIF, ShareClassIF } from '@/interfaces'
import { EntityTypes, FilingCodes } from '@/enums'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

// Resources
import { BenefitCompanyStatementResource } from '@/resources'

@Component({
  components: {
    ListShareClass,
    ListPeopleAndRoles,
    SummaryDefineCompany,
    AgreementType
  }
})
export default class Correction extends Mixins(DateMixin, FilingTemplateMixin, LegalApiMixin) {
  // Resources for template
  readonly BenefitCompanyStatementResource = BenefitCompanyStatementResource

  // Global getters
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter getFilingDate!: string
  @Getter getOrgPeople!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getBusinessId!: string

  // Global setters
  @Action setIgnoreChanges!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF

  /** The IA filing to correct. */
  private correctedFiling: any = null

  /** The id of the IA filing being corrected. */
  private get correctedId (): number {
    return +this.$route.query['corrected-id']
  }

  /** The id of the correction being edited. */
  private get correctionId (): number {
    return +this.$route.query['correction-id']
  }

  /** The filing date, in local timezone. */
  private get filingDateLocal (): string {
    return this.convertUtcTimeToLocalTime(this.getFilingDate)?.slice(0, 10)
  }

  /** Whether the user is authenticated. */
  private get isAuthenticated (): boolean {
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** Called when this component is mounted. */
  private async mounted (): Promise<void> {
    // do not proceed if we are not anthenticated
    // (this component will be re-mounted after authentication)
    if (!this.isAuthenticated) return

    // do not proceed if FF is disabled
    if (!featureFlags.getFlag('correction-ui-enabled')) {
      alert('Corrections are under contruction. Please check again later.')
      this.redirectEntityDashboard()
      return
    }

    // do not proceed if user is not staff
    const isStaffOnly = this.$route.matched.some(r => r.meta?.isStaffOnly)
    if (isStaffOnly && !this.isRoleStaff) {
      alert('Only staff can correct an Incorporation Application.')
      this.redirectEntityDashboard()
      return
    }

    // do not proceed if we don't have the necessary query params
    if (isNaN(this.correctedId) && isNaN(this.correctionId)) {
      const err = 'Invalid corrected or correction filing ID'
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
      return
    }

    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    // try to fetch data
    try {
      if (this.correctionId) {
        // fetch draft correction to resume
        const correctionFiling = await this.fetchFilingById(this.correctionId)

        // fetch original IA to correct
        this.correctedFiling = await this.fetchFilingById(correctionFiling.correctedFilingId)

        // parse IA filing into store
        // this is the initial state of the correction filing
        this.parseIncorpApp(this.correctedFiling)

        // parse correction filing into store
        // this applies the diffs (corrections)
        this.parseCorrection(correctionFiling)
      }

      if (this.correctedId) {
        // fetch original IA to correct
        this.correctedFiling = await this.fetchFilingById(this.correctedId)

        // parse IA filing into store
        // this is the initial state of the correction filing
        this.parseIncorpApp(this.correctedFiling)
      }

      // set current entity type
      this.setEntityType(EntityTypes.BCOMP)

      // initialize Fee Summary data
      this.emitFilingData([{
        filingTypeCode: FilingCodes.CORRECTION,
        entityType: EntityTypes.BCOMP
      }])
    } catch (err) {
      console.log(err) // eslint-disable-line no-console
      this.emitFetchError(err)
    }

    // resume tracking data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  /** Redirects browser to Entity Dashboard. */
  private redirectEntityDashboard (): void {
    const dashboardUrl = sessionStorage.getItem('DASHBOARD_URL')
    window.location.assign(dashboardUrl + this.getBusinessId)
  }

  /** Emits Fetch Error event for App to handle. */
  @Emit('fetchError')
  private emitFetchError (message: string = ''): void {}

  /** Emits new Filing Data to parent. */
  @Emit('filingData')
  private emitFilingData (filingData: FilingDataIF[]): void {}
}
</script>

<style lang="scss" scoped>
.original-filing-date-label,
.benefit-company-statement-label {
  letter-spacing: -0.04rem;
  font-weight: 700;
}
</style>