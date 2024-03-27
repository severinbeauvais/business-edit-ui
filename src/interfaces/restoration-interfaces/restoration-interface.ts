import { ApprovalTypes, RestorationTypes, RelationshipTypes } from '@/enums'
import { AddressesIF, CourtOrderIF, NameTranslationIF, OrgPersonIF } from '@/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/restoration.json
//
export interface RestorationIF {
  applicationDate?: string // YYYY-MM-DD
  approvalType: ApprovalTypes
  business: {
    identifier: string
    legalType: CorpTypeCd
  }
  contactPoint: ContactPointIF
  courtOrder?: CourtOrderIF
  expiry?: string // YYYY-MM-DD
  nameRequest?: {
    legalType: CorpTypeCd
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  nameTranslations?: NameTranslationIF[]
  noticeDate?: string // YYYY-MM-DD
  offices: AddressesIF
  parties: OrgPersonIF[]
  relationships?: RelationshipTypes[]
  type: RestorationTypes
}
