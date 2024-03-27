import { CourtOrderIF, NameTranslationIF, ShareStructureIF } from '@/interfaces/'
import { CoopTypes } from '@/enums'
import { ContactPointIF } from '@bcrs-shared-components/interfaces/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

//
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/alteration.json
//

export interface CoopAlterationIF {
  cooperativeAssociationType?: CoopTypes
  memorandumInResolution?: boolean
  memorandumFileKey?: string
  memorandumFileName?: string
  memorandumloadedOn?: string
  rulesFileKey?: string
  rulesFileName?: string
  rulesInResolution?: boolean
  rulesUploadedOn?: string
}

export interface AlterationIF extends CoopAlterationIF {
  provisionsRemoved?: boolean
  business: {
    identifier: string
    legalType: CorpTypeCd
  }
  nameRequest?: {
    legalType: CorpTypeCd
    nrNumber?: string // only set when there is an NR
    legalName?: string // only set when there is an NR
  }
  nameTranslations?: NameTranslationIF[]
  shareStructure?: ShareStructureIF
  contactPoint: ContactPointIF
  courtOrder?: CourtOrderIF
}
