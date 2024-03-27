import { AddressesIF, BusinessInformationIF, FilingHeaderIF, OrgPersonIF } from '@/interfaces/'
import { NaicsIF } from '@bcrs-shared-components/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/conversion.json
//
interface ConversionIF {
  business: {
    identifier: string
    naics?: NaicsIF
  }
  courtOrder?: string
  nameRequest?: {
    legalType: CorpTypeCd
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  offices: AddressesIF
  parties: Array<OrgPersonIF>
  startDate?: string // YYYY-MM-DD
}

/** Interface for data object UI sends to API. */
export interface ConversionFilingIF {
  header: FilingHeaderIF
  business: BusinessInformationIF
  conversion: ConversionIF
}
