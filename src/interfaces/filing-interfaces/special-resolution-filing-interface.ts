import { FilingHeaderIF, AlterationIF, BusinessInformationIF } from '@/interfaces/'
import { SpecialResolutionIF } from '@bcrs-shared-components/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Override what's in BCRS Shared Components, needs to be refactored in the future. */
export interface ChangeOfNameIF {
  nameRequest: {
    legalType: CorpTypeCd
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  legalName: string
}

/** Interface for data object UI sends to API. */
export interface SpecialResolutionFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  changeOfName?: ChangeOfNameIF
  alteration?: AlterationIF
  specialResolution?: SpecialResolutionIF
}
