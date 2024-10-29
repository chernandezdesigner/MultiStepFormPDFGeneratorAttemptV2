import { defineStore } from 'pinia'

interface FormData {
  // Subject Property fields
  propertyAddress: string
  municipality: string
  county: string
  state: string
  assessorParcelNumber: string
  yearBuilt: number | string
  existingLandUse: string

  // Zoning District fields
  zoningJurisdiction: string
  zoningDistrict: string
  overlayDistrict: string
  overlayZone: string
  adoptedDate: string
  amendedDate: string
  isPermittedUse: boolean | undefined
  whyPermitted: string
  isConformingUse: boolean | undefined

  // Adjacent Zoning fields
  northZoning: string
  northZoningDistrict: string
  southZoning: string
  southZoningDistrict: string
  eastZoning: string
  eastZoningDistrict: string
  westZoning: string
  westZoningDistrict: string
  squareFeet: number | string
  acres: number | string

  // Building Setback Requirements
  buildingSetbackPer: string
  requiredFrontFeet: string
  requiredFrontOr: string
  existingFrontFeet: string
  existingFrontOr: string
  
  requiredCornerSideFeet: string
  requiredCornerSideOr: string
  existingCornerSideFeet: string
  existingCornerSideOr: string
  
  requiredInteriorSideFeet: string
  requiredInteriorSideOr: string
  existingInteriorSideFeet: string
  existingInteriorSideOr: string
  
  requiredRearFeet: string
  requiredRearOr: string
  existingRearFeet: string
  existingRearOr: string

  buildingSetbackCompliant: boolean | undefined
  buildingSetbackWhy: string

  // Height Restrictions
  requiredMaxFeet: string
  requiredMaxFeetOr: string
  existingMaxFeet: string
  existingMaxFeetOr: string
  requiredMaxStories: string
  requiredMaxStoriesOr: string
  existingMaxStories: string
  existingMaxStoriesOr: string
  heightRestrictionCompliant: boolean | undefined
  heightRestrictionWhy: string
}

interface StepValidation {
  isComplete: boolean
  isValid: boolean
}

export const useFormStore = defineStore('form', {
  state: () => ({
    currentStep: 0,
    maxSteps: 5,
    stepValidations: [] as StepValidation[],
    formData: {
      // Subject Property initial values
      propertyAddress: '',
      municipality: '',
      county: '',
      state: '',
      assessorParcelNumber: '',
      yearBuilt: '',
      existingLandUse: '',

      // Zoning District initial values
      zoningJurisdiction: '',
      zoningDistrict: '',
      overlayDistrict: '',
      overlayZone: '',
      adoptedDate: '',
      amendedDate: '',
      isPermittedUse: undefined,
      whyPermitted: '',
      isConformingUse: undefined,

      // Adjacent Zoning initial values
      northZoning: '',
      northZoningDistrict: '',
      southZoning: '',
      southZoningDistrict: '',
      eastZoning: '',
      eastZoningDistrict: '',
      westZoning: '',
      westZoningDistrict: '',
      squareFeet: '',
      acres: '',

      // Building Setback Requirements initial values
      buildingSetbackPer: '',
      requiredFrontFeet: '',
      requiredFrontOr: '',
      existingFrontFeet: '',
      existingFrontOr: '',
      
      requiredCornerSideFeet: '',
      requiredCornerSideOr: '',
      existingCornerSideFeet: '',
      existingCornerSideOr: '',
      
      requiredInteriorSideFeet: '',
      requiredInteriorSideOr: '',
      existingInteriorSideFeet: '',
      existingInteriorSideOr: '',
      
      requiredRearFeet: '',
      requiredRearOr: '',
      existingRearFeet: '',
      existingRearOr: '',

      buildingSetbackCompliant: undefined,
      buildingSetbackWhy: '',

      // Height Restrictions initial values
      requiredMaxFeet: '',
      requiredMaxFeetOr: '',
      existingMaxFeet: '',
      existingMaxFeetOr: '',
      requiredMaxStories: '',
      requiredMaxStoriesOr: '',
      existingMaxStories: '',
      existingMaxStoriesOr: '',
      heightRestrictionCompliant: undefined,
      heightRestrictionWhy: ''
    } as FormData
  }),

  actions: {
    setCurrentStep(step: number) {
      if (step >= 0 && step < this.maxSteps && this.canNavigateToStep(step)) {
        this.currentStep = step
      }
    },

    canNavigateToStep(step: number): boolean {
      // Can always go back
      if (step < this.currentStep) return true
      
      // Can only go forward if all previous steps are complete and valid
      for (let i = 0; i < step; i++) {
        if (!this.stepValidations[i]?.isComplete || !this.stepValidations[i]?.isValid) {
          return false
        }
      }
      return true
    },

    updateStepValidation(step: number, isComplete: boolean, isValid: boolean) {
      this.stepValidations[step] = { isComplete, isValid }
    },

    updateField(field: keyof FormData, value: string | number | boolean | undefined) {
      this.formData[field] = value
    },

    updateFormData(data: FormData) {
      this.formData = data
    },

    nextStep() {
      if (this.currentStep < this.maxSteps - 1) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    resetForm() {
      this.currentStep = 0
      this.stepValidations = []
      this.formData = {
        // Subject Property reset values
        propertyAddress: '',
        municipality: '',
        county: '',
        state: '',
        assessorParcelNumber: '',
        yearBuilt: '',
        existingLandUse: '',

        // Zoning District reset values
        zoningJurisdiction: '',
        zoningDistrict: '',
        overlayDistrict: '',
        overlayZone: '',
        adoptedDate: '',
        amendedDate: '',
        isPermittedUse: undefined,
        whyPermitted: '',
        isConformingUse: undefined,

        // Adjacent Zoning reset values
        northZoning: '',
        northZoningDistrict: '',
        southZoning: '',
        southZoningDistrict: '',
        eastZoning: '',
        eastZoningDistrict: '',
        westZoning: '',
        westZoningDistrict: '',
        squareFeet: '',
        acres: '',

        // Building Setback Requirements reset values
        buildingSetbackPer: '',
        requiredFrontFeet: '',
        requiredFrontOr: '',
        existingFrontFeet: '',
        existingFrontOr: '',
        
        requiredCornerSideFeet: '',
        requiredCornerSideOr: '',
        existingCornerSideFeet: '',
        existingCornerSideOr: '',
        
        requiredInteriorSideFeet: '',
        requiredInteriorSideOr: '',
        existingInteriorSideFeet: '',
        existingInteriorSideOr: '',
        
        requiredRearFeet: '',
        requiredRearOr: '',
        existingRearFeet: '',
        existingRearOr: '',

        buildingSetbackCompliant: undefined,
        buildingSetbackWhy: '',

        // Height Restrictions reset values
        requiredMaxFeet: '',
        requiredMaxFeetOr: '',
        existingMaxFeet: '',
        existingMaxFeetOr: '',
        requiredMaxStories: '',
        requiredMaxStoriesOr: '',
        existingMaxStories: '',
        existingMaxStoriesOr: '',
        heightRestrictionCompliant: undefined,
        heightRestrictionWhy: ''
      }
    }
  },

  persist: {
    storage: sessionStorage,
  }
})