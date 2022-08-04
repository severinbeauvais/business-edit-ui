<template>
  <div id="association-type">
    <v-row no-gutters>
      <!-- Row Title -->
      <v-col cols="3">
        <label :class="{'error-text': invalidSection}">
          <strong>Cooperative Association Type</strong>
        </label>
        <v-flex md1>
          <v-chip v-if="hasAssociationTypeChanged" x-small label color="primary" text-color="white">
            {{ editedLabel }}
          </v-chip>
        </v-flex>
      </v-col>

      <!-- Display Mode -->
      <v-col cols="7" v-if="!isEditingAssociationType">
        <span class="info-text">
          {{ associationTypeToDescription(getAssociationType) }}
        </span>
      </v-col>

      <!-- Actions -->
      <v-col cols="2" class="mt-n2" v-if="!isEditingAssociationType">
        <div class="actions mr-4">
          <v-btn
            v-if="hasAssociationTypeChanged"
            text color="primary"
            id="btn-undo-association-type"
            class="undo-action"
            @click="resetAssociationType()"
          >
            <v-icon small>mdi-undo</v-icon>
            <span>Undo</span>
          </v-btn>
          <v-tooltip
              v-else top
              content-class="top-tooltip"
              transition="fade-transition"
              nudge-right="3"
            >
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                text color="primary"
                class="edit-button"
                @click="isEditingAssociationType = true"
              >
                <v-icon small>mdi-pencil</v-icon>
                <span>{{editLabel}}</span>
              </v-btn>
              </template>
              <span>
                We recommend you seek legal advice before changing your cooperative association type.
                Refer to section 68 "Amendment of memorandum and rules" in the Cooperative Associations Act.
              </span>
            </v-tooltip>

            <!-- Drop Down Actions -->
            <span class="more-actions" v-if="hasAssociationTypeChanged">
              <v-menu
                offset-y left nudge-bottom="4"
                v-model="dropdown"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    text small color="primary"
                    id="btn-more-actions"
                    v-on="on"
                  >
                    <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    id="btn-more-actions-edit"
                    class="v-list-item"
                    @click="isEditingAssociationType = true; dropdown = false"
                  >
                    <v-list-item-subtitle>
                      <v-icon small color="primary">mdi-pencil</v-icon>
                      <span class="drop-down-action ml-1">Change</span>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-menu>
            </span>
        </div>
      </v-col>

      <!-- Editing Mode -->
      <v-col cols="9" v-if="isEditingAssociationType">
        <v-select
          filled
          id="association-type-input"
          :items="associationTypeOptions"
          v-model="selectedAssociationType"
          :rules="AssociationTypeRules"
        >
        </v-select>

        <!-- Done Actions -->
        <div class="action-btns">
          <v-btn
            id="done-btn"
            large color="primary"
            @click="submitAssociationTypeChange()"
          >
            <span>Done</span>
          </v-btn>
          <v-btn
            id="cancel-btn"
            large outlined color="primary"
            @click="isEditingAssociationType = false"
          >
            <span>Cancel</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { AssociationTypes } from '@/enums'
import { CommonMixin, EnumMixin } from '@/mixins'
import { ActionBindingIF, BusinessInformationIF, EntitySnapshotIF } from '@/interfaces'

@Component({})
export default class AssociationType extends Mixins(CommonMixin, EnumMixin) {
  @Prop({ default: false })
  readonly invalidSection: boolean
  /** Global getters */
  @Getter getAssociationType!: AssociationTypes
  @Getter getBusinessInformation!: BusinessInformationIF
  @Getter getEntitySnapshot!: EntitySnapshotIF
  @Getter hasAssociationTypeChanged!: boolean

  /** Global actions */
  @Action setBusinessInformation!: ActionBindingIF

  /** Select options */
  readonly associationTypeOptions: Array<any> = [
    {
      value: AssociationTypes.COMMUNITY_SERVICE_COOPERATIVE,
      text: this.associationTypeToDescription(AssociationTypes.COMMUNITY_SERVICE_COOPERATIVE)
    },
    {
      value: AssociationTypes.ORDINARY_COOPERATIVE,
      text: this.associationTypeToDescription(AssociationTypes.ORDINARY_COOPERATIVE)
    },
    {
      value: AssociationTypes.HOUSING_COOPERATIVE,
      text: this.associationTypeToDescription(AssociationTypes.HOUSING_COOPERATIVE)
    }
  ]

  protected selectedAssociationType = null as AssociationTypes
  protected isEditingAssociationType = false

  /** V-model for dropdown menu. */
  protected dropdown: boolean = null

  /** Validation rules. */
  readonly AssociationTypeRules: Array<Function> = [
    v => !!v || 'This field is required' // is not empty
  ]

  protected mounted (): void {
    this.initializeAssociationType()
  }

  /** Define the association type locally once the value has been populated in the store */
  @Watch('getAssociationType')
  private initializeAssociationType () {
    this.selectedAssociationType = this.getAssociationType
  }

  /** Reset association type value to original */
  private resetAssociationType () {
    this.setBusinessInformation(this.getEntitySnapshot.businessInfo)
    this.isEditingAssociationType = false
  }

  /** Submit association type value */
  private submitAssociationTypeChange () {
    this.setBusinessInformation({ ...this.getBusinessInformation, associationType: this.selectedAssociationType })
    this.isEditingAssociationType = false
  }

  @Emit('isEditingAssociationType')
  @Watch('isEditingAssociationType', { immediate: true })
  private isEditingAssociationTypeChange (isEditing: boolean): void {
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.actions {
  position: absolute;
  right: 0;

  .undo-action{
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}

.action-btns {
  margin: 15px 0;
  display: flex;
  justify-content: flex-end;

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .v-btn {
    min-width: 6.5rem;
  }

  #done-btn[disabled] {
    color: white !important;
    background-color: $app-blue !important;
    opacity: 0.2;
  }
}

/** Below brought over from business-create-ui.
    remove extra space taken by error message */
::v-deep .v-text-field__details {
  margin-bottom: -8px !important;
}

// Vuetify Overrides
::v-deep .v-list-item .v-list-item__title, .v-list-item .v-list-item__subtitle {
  color: $gray7;
}

::v-deep .v-list-item--link:hover:not(.v-list-item--active) {
  background-color: $gray1;
  color: $app-blue !important;
}

::v-deep .v-list-item:hover {
  .v-list-item__title {
    color: $app-blue !important;
  }
}

::v-deep .v-list-item--active .v-list-item__title, .v-list-item .v-list-item__subtitle {
  color: $app-blue !important;
}
</style>