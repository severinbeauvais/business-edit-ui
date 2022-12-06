import { CorrectionTypes, FilingCodes, NameRequestTypes } from '@/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'

export const UlcCorrectionResource: ResourceIF = {
  entityReference: 'Company',
  contactLabel: 'Registered Office',
  displayName: null, // not used
  entityType: CorpTypeCd.BC_ULC_COMPANY,
  addressLabel: 'Registered Office',
  title: 'Benefit Company Statement',
  description: 'This company is a benefit company and, as such, has purposes that include conducting its business in' +
               ' a responsible and sustainable manner and promoting one or more public benefits.',
  filingData: {
    filingTypeCode: FilingCodes.CORRECTION,
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    priority: false
  },
  changeData: {
    nameChangeOptions: [
      CorrectionTypes.CORRECT_NEW_NR,
      CorrectionTypes.CORRECT_NAME_TO_NUMBER,
      CorrectionTypes.CORRECT_NAME
    ],
    orgPersonInfo: {
      orgPersonLabel: 'Directors',
      subtitle: null // not used
    },
    nameRequestTypes: [
      NameRequestTypes.CHANGE_OF_NAME,
      NameRequestTypes.CONVERSION
    ]
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 427 of the Business Corporations Act.'
}