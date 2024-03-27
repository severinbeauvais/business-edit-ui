import { AddressesIF, CourtOrderIF, BusinessInformationIF, FilingHeaderIF, OrgPersonIF } from '@/interfaces/'
import { ContactPointIF, NaicsIF } from '@bcrs-shared-components/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/change_of_registration.json
//
export interface ChgRegistrationIF {
  business: {
    identifier: string
    naics?: NaicsIF
  }
  courtOrder?: CourtOrderIF
  contactPoint: ContactPointIF
  nameRequest?: {
    legalType: CorpTypeCd
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  offices?: AddressesIF
  parties: Array<OrgPersonIF>
  startDate?: string // YYYY-MM-DD
}

/** Interface for data object UI sends to API. */
export interface ChgRegistrationFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  changeOfRegistration: ChgRegistrationIF
}
