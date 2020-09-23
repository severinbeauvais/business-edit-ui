// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Components
import { mount } from '@vue/test-utils'
import { BusinessContactInfo, FolioNumber, OfficeAddresses, YourCompany } from '@/components/YourCompany'
import { CorrectNameOptions } from '@/components/YourCompany/CompanyName'

Vue.use(Vuetify)

const vuetify = new Vuetify({})

describe('YourCompany', () => {
  let wrapper: any
  let store: any = getVuexStore()

  beforeEach(() => {
    wrapper = mount(YourCompany, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the YourCompany Component and default subcomponents', async () => {
    expect(wrapper.find(YourCompany).exists()).toBe(true)
    expect(wrapper.find(BusinessContactInfo).exists()).toBe(true)
    expect(wrapper.find(OfficeAddresses).exists()).toBe(true)

    // Not a premium account
    expect(wrapper.find(FolioNumber).exists()).toBe(false)

    // Not currently editing Company Name
    expect(wrapper.find(CorrectNameOptions).exists()).toBe(false)
  })

  it('renders the FolioNumber Component and account is premium', async () => {
    store.state.stateModel.accountInformation.accountType = 'PREMIUM'
    await Vue.nextTick()

    expect(wrapper.find(FolioNumber).exists()).toBe(true)
  })

  it('renders the CorrectNameOptions when correcting Company Name', async () => {
    // Click the `Correct` btn
    wrapper.find('#btn-correct-company-name').trigger('click')
    await Vue.nextTick()

    expect(wrapper.find(CorrectNameOptions).exists()).toBe(true)
  })
})
