<script setup lang="ts">
import { onMounted, computed, Transition } from 'vue'
import { useFormStore } from '@/stores/formStore'
import html2pdf from 'html2pdf.js'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { Input } from '@/components/ui/input'
import { CheckIcon, CircleIcon, DotIcon  } from '@radix-icons/vue'


const store = useFormStore()

// Define validation schema
const schema = yup.object({
  propertyAddress: yup.string().required('Property address is required'),
  municipality: yup.string().required('Municipality is required'),
  county: yup.string().required('County is required'),
  state: yup.string().required('State is required'),
  assessorParcelNumber: yup.string().required('Assessor parcel number is required'),
  yearBuilt: yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive('Year must be positive')
    .integer('Year must be an integer'),
  existingLandUse: yup.string().required('Existing land use is required'),

  zoningJurisdiction: yup.string().required('Zoning jurisdiction is required'),
  zoningDistrict: yup.string().required('Zoning district is required'),
  overlayDistrict: yup.string(),
  overlayZone: yup.string(),
  adoptedDate: yup.number()
    .required('Adopted date is required')
    .positive('Year must be positive')
    .integer('Year must be an integer'),
  amendedDate: yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .positive('Year must be positive')
    .integer('Year must be an integer'),
  isPermittedUse: yup.boolean().required('Please specify if the current use is permitted'),
  whyPermitted: yup.string(),
  isConformingUse: yup.boolean().required('Please specify if the current use is conforming'),

  // Step 3
  northZoning: yup.string().required('North zoning is required'),
  northZoningDistrict: yup.string().required('North zoning district is required'),
  southZoning: yup.string().required('South zoning is required'),
  southZoningDistrict: yup.string().required('South zoning district is required'),
  eastZoning: yup.string().required('East zoning is required'),
  eastZoningDistrict: yup.string().required('East zoning district is required'),
  westZoning: yup.string().required('West zoning is required'),
  westZoningDistrict: yup.string().required('West zoning district is required'),
  squareFeet: yup.number()
    .required('Square feet is required')
    .positive('Square feet must be positive')
    .integer('Square feet must be an integer'),
  acres: yup.number()
    .required('Acres is required')
    .positive('Acres must be positive'),

  // Step 4 - Building Setbacks
  buildingSetbackPer: yup.string(),
  requiredFrontFeet: yup.string(),
  requiredFrontOr: yup.string(),
  existingFrontFeet: yup.string(),
  existingFrontOr: yup.string(),
  
  requiredCornerSideFeet: yup.string(),
  requiredCornerSideOr: yup.string(),
  existingCornerSideFeet: yup.string(),
  existingCornerSideOr: yup.string(),
  
  requiredInteriorSideFeet: yup.string(),
  requiredInteriorSideOr: yup.string(),
  existingInteriorSideFeet: yup.string(),
  existingInteriorSideOr: yup.string(),
  
  requiredRearFeet: yup.string(),
  requiredRearOr: yup.string(),
  existingRearFeet: yup.string(),
  existingRearOr: yup.string(),

  buildingSetbackCompliant: yup.boolean().required('Please specify if building setback is compliant'),
  buildingSetbackWhy: yup.string(),

  // Step 5 - Height Restrictions
  requiredMaxFeet: yup.string(),
  requiredMaxFeetOr: yup.string(),
  existingMaxFeet: yup.string(),
  existingMaxFeetOr: yup.string(),
  requiredMaxStories: yup.string(),
  requiredMaxStoriesOr: yup.string(),
  existingMaxStories: yup.string(),
  existingMaxStoriesOr: yup.string(),
  heightRestrictionCompliant: yup.boolean().required('Please specify if height restrictions are compliant'),
  heightRestrictionWhy: yup.string()
})

// Initialize form with Vee-Validate
const { handleSubmit, errors, values } = useForm({
  validationSchema: schema,
  initialValues: store.formData
})

// Define fields with validation
const { value: propertyAddress } = useField('propertyAddress')
const { value: municipality } = useField('municipality')
const { value: county } = useField('county')
const { value: state } = useField('state')
const { value: assessorParcelNumber } = useField('assessorParcelNumber')
const { value: yearBuilt } = useField('yearBuilt')
const { value: existingLandUse } = useField('existingLandUse')

// Step 2 fields
const { value: zoningJurisdiction } = useField('zoningJurisdiction')
const { value: zoningDistrict } = useField('zoningDistrict')
const { value: overlayDistrict } = useField('overlayDistrict')
const { value: overlayZone } = useField('overlayZone')
const { value: adoptedDate } = useField('adoptedDate')
const { value: amendedDate } = useField('amendedDate')
const { value: isPermittedUse } = useField('isPermittedUse')
const { value: whyPermitted } = useField('whyPermitted')
const { value: isConformingUse } = useField('isConformingUse')

// Step 3 fields
const { value: northZoning } = useField('northZoning')
const { value: northZoningDistrict } = useField('northZoningDistrict')
const { value: southZoning } = useField('southZoning')
const { value: southZoningDistrict } = useField('southZoningDistrict')
const { value: eastZoning } = useField('eastZoning')
const { value: eastZoningDistrict } = useField('eastZoningDistrict')
const { value: westZoning } = useField('westZoning')
const { value: westZoningDistrict } = useField('westZoningDistrict')
const { value: squareFeet } = useField('squareFeet')
const { value: acres } = useField('acres')

// Step 4 fields
const { value: buildingSetbackPer } = useField('buildingSetbackPer')
const { value: requiredFrontFeet } = useField('requiredFrontFeet')
const { value: requiredFrontOr } = useField('requiredFrontOr')
const { value: existingFrontFeet } = useField('existingFrontFeet')
const { value: existingFrontOr } = useField('existingFrontOr')

const { value: requiredCornerSideFeet } = useField('requiredCornerSideFeet')
const { value: requiredCornerSideOr } = useField('requiredCornerSideOr')
const { value: existingCornerSideFeet } = useField('existingCornerSideFeet')
const { value: existingCornerSideOr } = useField('existingCornerSideOr')

const { value: requiredInteriorSideFeet } = useField('requiredInteriorSideFeet')
const { value: requiredInteriorSideOr } = useField('requiredInteriorSideOr')
const { value: existingInteriorSideFeet } = useField('existingInteriorSideFeet')
const { value: existingInteriorSideOr } = useField('existingInteriorSideOr')

const { value: requiredRearFeet } = useField('requiredRearFeet')
const { value: requiredRearOr } = useField('requiredRearOr')
const { value: existingRearFeet } = useField('existingRearFeet')
const { value: existingRearOr } = useField('existingRearOr')

const { value: buildingSetbackCompliant } = useField('buildingSetbackCompliant')
const { value: buildingSetbackWhy } = useField('buildingSetbackWhy')

// Step 5 fields
const { value: requiredMaxFeet } = useField('requiredMaxFeet')
const { value: requiredMaxFeetOr } = useField('requiredMaxFeetOr')
const { value: existingMaxFeet } = useField('existingMaxFeet')
const { value: existingMaxFeetOr } = useField('existingMaxFeetOr')
const { value: requiredMaxStories } = useField('requiredMaxStories')
const { value: requiredMaxStoriesOr } = useField('requiredMaxStoriesOr')
const { value: existingMaxStories } = useField('existingMaxStories')
const { value: existingMaxStoriesOr } = useField('existingMaxStoriesOr')
const { value: heightRestrictionCompliant } = useField('heightRestrictionCompliant')
const { value: heightRestrictionWhy } = useField('heightRestrictionWhy')

const canProceed = computed(() => {
  switch (store.currentStep) {
    case 0:
      return !errors.propertyAddress && !errors.municipality && !errors.county && !errors.state &&
             !errors.assessorParcelNumber && !errors.yearBuilt && !errors.existingLandUse &&
             values.propertyAddress && values.municipality && values.county && values.state &&
             values.assessorParcelNumber && values.yearBuilt && values.existingLandUse
    case 1:
      return !errors.zoningJurisdiction && !errors.zoningDistrict && 
             !errors.adoptedDate && !errors.isPermittedUse && 
             !errors.isConformingUse &&
             values.zoningJurisdiction && values.zoningDistrict && 
             values.adoptedDate && values.isPermittedUse !== undefined && 
             values.isConformingUse !== undefined
    case 2:
      return !errors.northZoning && !errors.northZoningDistrict &&
             !errors.southZoning && !errors.southZoningDistrict &&
             !errors.eastZoning && !errors.eastZoningDistrict &&
             !errors.westZoning && !errors.westZoningDistrict &&
             !errors.squareFeet && !errors.acres &&
             values.northZoning && values.northZoningDistrict &&
             values.southZoning && values.southZoningDistrict &&
             values.eastZoning && values.eastZoningDistrict &&
             values.westZoning && values.westZoningDistrict &&
             values.squareFeet && values.acres
    case 3:
      return !errors.buildingSetbackCompliant && 
             values.buildingSetbackCompliant !== undefined
    case 4:
      return !errors.heightRestrictionCompliant && 
             values.heightRestrictionCompliant !== undefined
    default:
      return false
  }
})

// Form submission handler
const onSubmit = handleSubmit((values) => {
  store.updateFormData(values)
  generatePDF()
})

// Navigation methods
const nextStep = () => {
  if (canProceed.value) {
    store.nextStep()
  }
}

const prevStep = () => {
  store.prevStep()
}

const steps = [
  { 
    id: 0, 
    title: 'Subject Property',
    description: 'Basic property information'
  },
  { 
    id: 1, 
    title: 'Zoning District',
    description: 'Zoning and use information'
  },
  { 
    id: 2, 
    title: 'Adjacent Zoning',
    description: 'Surrounding zoning details'
  },
  { 
    id: 3, 
    title: 'Building Setbacks',
    description: 'Setback requirements'
  },
  { 
    id: 4, 
    title: 'Height Restrictions',
    description: 'Building height compliance'
  },
  {
    id: 5,
    title: 'Review & Submit',
    description: 'Review and generate report'
  }
]

// Add computed property for step status
const getStepStatus = (stepId: number) => {
  if (stepId === store.currentStep) return 'current'
  if (stepId < store.currentStep) return 'complete'
  return 'upcoming'
}

// PDF generation
const generatePDF = () => {
  const createField = (label: string, value: string | number | boolean | undefined) => {
    if (value === undefined || value === '') return ''
    return `
      <div style="margin-bottom: 10px;">
        <div style="font-weight: bold;">${label}:</div>
        <div>${value}</div>
      </div>
    `
  }

  const createBooleanField = (label: string, value: boolean | undefined) => {
    if (value === undefined) return ''
    return createField(label, value ? 'Yes' : 'No')
  }

  const content = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #2563eb;">Zoning Report</h2>
      
      <h3 style="color: #374151; margin-top: 20px;">Subject Property</h3>
      ${createField('Property Address', store.formData.propertyAddress)}
      ${createField('Municipality', store.formData.municipality)}
      ${createField('County', store.formData.county)}
      ${createField('State', store.formData.state)}
      ${createField('Assessor Parcel Number', store.formData.assessorParcelNumber)}
      ${createField('Year Built', store.formData.yearBuilt)}
      ${createField('Existing Land Use', store.formData.existingLandUse)}
      
      <h3 style="color: #374151; margin-top: 20px;">Zoning District</h3>
      ${createField('Zoning Jurisdiction', store.formData.zoningJurisdiction)}
      ${createField('Zoning District', store.formData.zoningDistrict)}
      ${createField('Overlay District', store.formData.overlayDistrict)}
      ${createField('Overlay Zone', store.formData.overlayZone)}
      ${createField('Adopted Date', store.formData.adoptedDate)}
      ${createField('Amended Date', store.formData.amendedDate)}
      ${createBooleanField('Is Permitted Use', store.formData.isPermittedUse)}
      ${createField('Why Permitted', store.formData.whyPermitted)}
      ${createBooleanField('Is Conforming Use', store.formData.isConformingUse)}
      
      <h3 style="color: #374151; margin-top: 20px;">Adjacent Zoning</h3>
      ${createField('North Zoning', store.formData.northZoning)}
      ${createField('North Zoning District', store.formData.northZoningDistrict)}
      ${createField('South Zoning', store.formData.southZoning)}
      ${createField('South Zoning District', store.formData.southZoningDistrict)}
      ${createField('East Zoning', store.formData.eastZoning)}
      ${createField('East Zoning District', store.formData.eastZoningDistrict)}
      ${createField('West Zoning', store.formData.westZoning)}
      ${createField('West Zoning District', store.formData.westZoningDistrict)}
      ${createField('Square Feet', store.formData.squareFeet)}
      ${createField('Acres', store.formData.acres)}

      <h3 style="color: #374151; margin-top: 20px;">Building Setback Requirements</h3>
      ${createField('Building Setback Per', store.formData.buildingSetbackPer)}
      ${createField('Required Front Feet', store.formData.requiredFrontFeet)}
      ${createField('Required Front Or', store.formData.requiredFrontOr)}
      ${createField('Existing Front Feet', store.formData.existingFrontFeet)}
      ${createField('Existing Front Or', store.formData.existingFrontOr)}
      ${createBooleanField('Building Setback Compliant', store.formData.buildingSetbackCompliant)}
      ${createField('Building Setback Why', store.formData.buildingSetbackWhy)}

      <h3 style="color: #374151; margin-top: 20px;">Height Restrictions</h3>
      ${createField('Required Maximum Feet', store.formData.requiredMaxFeet)}
      ${createField('Existing Maximum Feet', store.formData.existingMaxFeet)}
      ${createField('Required Maximum Stories', store.formData.requiredMaxStories)}
      ${createField('Existing Maximum Stories', store.formData.existingMaxStories)}
      ${createBooleanField('Height Restriction Compliant', store.formData.heightRestrictionCompliant)}
      ${createField('Height Restriction Why', store.formData.heightRestrictionWhy)}
    </div>
  `

  const opt = {
    margin: 1,
    filename: 'zoning-report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(content).save()
}
</script>


<template>
  <div class="min-h-screen bg-gray-300/80 p-8">
    <div class="max-w-7xl mx-auto flex gap-8">
      <!-- Vertical Stepper -->
      <div class="w-80 bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
        <div class="space-y-4">
          <div 
            v-for="step in steps" 
            :key="step.id"
            class="flex group"
            :class="{ 'cursor-pointer': getStepStatus(step.id) === 'complete' }"
            @click="getStepStatus(step.id) === 'complete' ? store.setCurrentStep(step.id) : null"
          >
            <div class="flex flex-col items-center">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                :class="{
                  'border-blue-600 bg-blue-600 text-white': getStepStatus(step.id) === 'current',
                  'border-green-500 bg-green-500 text-white': getStepStatus(step.id) === 'complete',
                  'border-gray-300 bg-white text-gray-500': getStepStatus(step.id) === 'upcoming'
                }"
              >
                <CheckIcon v-if="getStepStatus(step.id) === 'complete'" class="w-4 h-4" />
                <CircleIcon v-else-if="getStepStatus(step.id) === 'current'" class="w-4 h-4" />
                <DotIcon v-else class="w-4 h-4" />
              </div>
              <div 
                v-if="step.id !== steps.length - 1"
                class="w-0.5 h-full mt-2 transition-all duration-300"
                :class="{
                  'bg-green-500': getStepStatus(step.id) === 'complete',
                  'bg-blue-600': getStepStatus(step.id) === 'current',
                  'bg-gray-300': getStepStatus(step.id) === 'upcoming'
                }"
              ></div>
            </div>

            <div class="ml-4 pb-8">
              <p 
                class="font-medium transition-colors duration-300"
                :class="{
                  'text-blue-600': getStepStatus(step.id) === 'current',
                  'text-green-500': getStepStatus(step.id) === 'complete',
                  'text-gray-500': getStepStatus(step.id) === 'upcoming'
                }"
              >
                {{ step.title }}
              </p>
              <p class="text-sm text-gray-500">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form Content -->
      <div class="flex-1 max-w-2xl bg-white rounded-lg shadow-md">
        <!-- Step Title -->
        <div class="border-b border-gray-200">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold mb-0">
            {{ store.currentStep === 0 ? 'Subject Property' : 
               store.currentStep === 1 ? 'Zoning District' : 
               store.currentStep === 2 ? 'Adjacent Zoning' : 
               store.currentStep === 3 ? 'Building Setback Requirements' :
               'Height Restrictions' }}
              </h2>
            </div>
          </div>
        </div>

        <div class="p-6">
          <Transition name="fade" mode="out-in">
            <div :key="store.currentStep">
              <form @submit.prevent="onSubmit" class="space-y-4">
                <!-- Step 1: Subject Property -->
                <div v-if="store.currentStep === 0">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                    <input 
                      v-model="propertyAddress"
                      class="form-input"
                      placeholder="Enter property address"
                    />
                    <p v-if="errors.propertyAddress" class="error-message">{{ errors.propertyAddress }}</p>
                  </div>

                  <div class="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                      <input 
                        v-model="municipality"
                        class="form-input"
                        placeholder="Enter municipality"
                      />
                      <p v-if="errors.municipality" class="error-message">{{ errors.municipality }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">County</label>
                      <input 
                        v-model="county"
                        class="form-input"
                        placeholder="Enter county"
                      />
                      <p v-if="errors.county" class="error-message">{{ errors.county }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input 
                        v-model="state"
                        class="form-input"
                        placeholder="Enter state"
                      />
                      <p v-if="errors.state" class="error-message">{{ errors.state }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Assessor Parcel Number</label>
                      <input 
                        v-model="assessorParcelNumber"
                        class="form-input"
                        placeholder="Enter APN"
                      />
                      <p v-if="errors.assessorParcelNumber" class="error-message">{{ errors.assessorParcelNumber }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                      <input 
                        v-model="yearBuilt"
                        type="number"
                        class="form-input"
                        placeholder="Enter year built"
                      />
                      <p v-if="errors.yearBuilt" class="error-message">{{ errors.yearBuilt }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Existing Land Use</label>
                      <input 
                        v-model="existingLandUse"
                        class="form-input"
                        placeholder="Enter existing land use"
                      />
                      <p v-if="errors.existingLandUse" class="error-message">{{ errors.existingLandUse }}</p>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Zoning District -->
                <div v-else-if="store.currentStep === 1">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Zoning Jurisdiction</label>
                      <input 
                        v-model="zoningJurisdiction"
                        class="form-input"
                        placeholder="Enter zoning jurisdiction"
                      />
                      <p v-if="errors.zoningJurisdiction" class="error-message">{{ errors.zoningJurisdiction }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Zoning District</label>
                      <input 
                        v-model="zoningDistrict"
                        class="form-input"
                        placeholder="Enter zoning district"
                      />
                      <p v-if="errors.zoningDistrict" class="error-message">{{ errors.zoningDistrict }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Overlay District</label>
                      <input 
                        v-model="overlayDistrict"
                        class="form-input"
                        placeholder="Enter overlay district"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Overlay Zone</label>
                      <input 
                        v-model="overlayZone"
                        class="form-input"
                        placeholder="Enter overlay zone"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Adopted Date</label>
                      <input 
                        v-model="adoptedDate"
                        type="number"
                        class="form-input"
                        placeholder="Enter adopted date"
                      />
                      <p v-if="errors.adoptedDate" class="error-message">{{ errors.adoptedDate }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Amended Date</label>
                      <input 
                        v-model="amendedDate"
                        type="number"
                        class="form-input"
                        placeholder="Enter amended date"
                      />
                      <p v-if="errors.amendedDate" class="error-message">{{ errors.amendedDate }}</p>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Is this a permitted use?</label>
                    <div class="grid grid-cols-2 gap-2 mt-1">
                      <label 
                        class="toggle-btn"
                        :class="{ 'toggle-btn-active': isPermittedUse === true }"
                      >
                        <input
                          type="radio"
                          v-model="isPermittedUse"
                          :value="true"
                          class="sr-only"
                        />
                        <span>Yes</span>
                      </label>
                      <label 
                        class="toggle-btn"
                        :class="{ 'toggle-btn-active': isPermittedUse === false }"
                      >
                        <input
                          type="radio"
                          v-model="isPermittedUse"
                          :value="false"
                          class="sr-only"
                        />
                        <span>No</span>
                      </label>
                    </div>
                    <p v-if="errors.isPermittedUse" class="error-message">{{ errors.isPermittedUse }}</p>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Why?</label>
                    <textarea 
                      v-model="whyPermitted"
                      class="form-input"
                      rows="2"
                      placeholder="Explain why this is or is not a permitted use"
                    ></textarea>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Is this a conforming use?</label>
                    <div class="grid grid-cols-2 gap-2 mt-1">
                      <label 
                        class="toggle-btn"
                        :class="{ 'toggle-btn-active': isConformingUse === true }"
                      >
                        <input
                          type="radio"
                          v-model="isConformingUse"
                          :value="true"
                          class="sr-only"
                        />
                        <span>Yes</span>
                      </label>
                      <label 
                        class="toggle-btn"
                        :class="{ 'toggle-btn-active': isConformingUse === false }"
                      >
                        <input
                          type="radio"
                          v-model="isConformingUse"
                          :value="false"
                          class="sr-only"
                        />
                        <span>No</span>
                      </label>
                    </div>
                    <p v-if="errors.isConformingUse" class="error-message">{{ errors.isConformingUse }}</p>
                  </div>
                </div>
                <!-- Step 3: Adjacent Zoning -->
                <div v-else-if="store.currentStep === 2">
                  <!-- North -->
                  <h3 class="text-lg font-medium text-gray-900">North</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">North Zoning</label>
                      <input 
                        v-model="northZoning"
                        class="form-input"
                        placeholder="Enter north zoning"
                      />
                      <p v-if="errors.northZoning" class="error-message">{{ errors.northZoning }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">North Zoning District</label>
                      <input 
                        v-model="northZoningDistrict"
                        class="form-input"
                        placeholder="Enter north zoning district"
                      />
                      <p v-if="errors.northZoningDistrict" class="error-message">{{ errors.northZoningDistrict }}</p>
                    </div>
                  </div>

                  <!-- South -->
                  <h3 class="text-lg font-medium text-gray-900">South</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">South Zoning</label>
                      <input 
                        v-model="southZoning"
                        class="form-input"
                        placeholder="Enter south zoning"
                      />
                      <p v-if="errors.southZoning" class="error-message">{{ errors.southZoning }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">South Zoning District</label>
                      <input 
                        v-model="southZoningDistrict"
                        class="form-input"
                        placeholder="Enter south zoning district"
                      />
                      <p v-if="errors.southZoningDistrict" class="error-message">{{ errors.southZoningDistrict }}</p>
                    </div>
                  </div>

                  <!-- East -->
                  <h3 class="text-lg font-medium text-gray-900">East</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">East Zoning</label>
                      <input 
                        v-model="eastZoning"
                        class="form-input"
                        placeholder="Enter east zoning"
                      />
                      <p v-if="errors.eastZoning" class="error-message">{{ errors.eastZoning }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">East Zoning District</label>
                      <input 
                        v-model="eastZoningDistrict"
                        class="form-input"
                        placeholder="Enter east zoning district"
                      />
                      <p v-if="errors.eastZoningDistrict" class="error-message">{{ errors.eastZoningDistrict }}</p>
                    </div>
                  </div>

                  <!-- West -->
                  <h3 class="text-lg font-medium text-gray-900">West</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">West Zoning</label>
                      <input 
                        v-model="westZoning"
                        class="form-input"
                        placeholder="Enter west zoning"
                      />
                      <p v-if="errors.westZoning" class="error-message">{{ errors.westZoning }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">West Zoning District</label>
                      <input 
                        v-model="westZoningDistrict"
                        class="form-input"
                        placeholder="Enter west zoning district"
                      />
                      <p v-if="errors.westZoningDistrict" class="error-message">{{ errors.westZoningDistrict }}</p>
                    </div>
                  </div>

                  <!-- Parcel Area -->
                  <h3 class="text-lg font-medium text-gray-900">Parcel Area</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                      <input 
                        v-model="squareFeet"
                        type="number"
                        class="form-input"
                        placeholder="Enter square feet"
                      />
                      <p v-if="errors.squareFeet" class="error-message">{{ errors.squareFeet }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Acres</label>
                      <input 
                        v-model="acres"
                        type="number"
                        class="form-input"
                        placeholder="Enter acres"
                      />
                      <p v-if="errors.acres" class="error-message">{{ errors.acres }}</p>
                    </div>
                  </div>
                </div>

                <!-- Step 4: Building Setbacks -->
                <div v-else-if="store.currentStep === 3">
                  <h3 class="text-lg font-medium text-gray-900">Building Setback</h3>
                  <hr class="mb-4">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Building Setback Per</label>
                    <input 
                      v-model="buildingSetbackPer"
                      class="form-input"
                      placeholder="Enter building setback per"
                    />
                  </div>

                  <h3 class="text-lg font-medium text-gray-900">Front</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-6 mb-6">
                    <!-- Required -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Required</label>
                      <input 
                        v-model="requiredFrontFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="requiredFrontOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                    
                    <!-- Existing -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Existing</label>
                      <input 
                        v-model="existingFrontFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="existingFrontOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                  </div>

                  <h3 class="text-lg font-medium text-gray-900">Corner Side</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-6 mb-6">
                    <!-- Required -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Required</label>
                      <input 
                        v-model="requiredCornerSideFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="requiredCornerSideOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                    
                    <!-- Existing -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Existing</label>
                      <input 
                        v-model="existingCornerSideFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="existingCornerSideOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                  </div>

                  <h3 class="text-lg font-medium text-gray-900">Interior Side</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-6 mb-6">
                    <!-- Required -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Required</label>
                      <input 
                        v-model="requiredInteriorSideFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="requiredInteriorSideOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                    
                    <!-- Existing -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Existing</label>
                      <input 
                        v-model="existingInteriorSideFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="existingInteriorSideOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                  </div>

                  <h3 class="text-lg font-medium text-gray-900">Rear</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-6 mb-6">
                    <!-- Required -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Required</label>
                      <input 
                        v-model="requiredRearFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="requiredRearOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                    
                    <!-- Existing -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Existing</label>
                      <input 
                        v-model="existingRearFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="existingRearOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Does the building conform to setback requirements?</label>
                    <div class="grid grid-cols-2 gap-2 mt-1">
                      <label 
                        class="toggle-btn"
                        :class="{ 'toggle-btn-active': buildingSetbackCompliant === true }"
                      >
                        <input
                          type="radio"
                          v-model="buildingSetbackCompliant"
                          :value="true"
                          class="sr-only"
                        />
                        <span>Yes</span>
                      </label>
                      <label 
                        class="toggle-btn"
                        :class="{ 'toggle-btn-active': buildingSetbackCompliant === false }"
                      >
                        <input
                          type="radio"
                          v-model="buildingSetbackCompliant"
                          :value="false"
                          class="sr-only"
                        />
                        <span>No</span>
                      </label>
                    </div>
                    <p v-if="errors.buildingSetbackCompliant" class="error-message">{{ errors.buildingSetbackCompliant }}</p>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Why?</label>
                    <textarea 
                      v-model="buildingSetbackWhy"
                      class="form-input"
                      rows="2"
                      placeholder="Explain why the building conforms or does not conform to setback requirements"
                    ></textarea>
                  </div>
                </div>

                <!-- Step 5: Height Restrictions -->
                <div v-else-if="store.currentStep === 4">
                  <h3 class="text-lg font-medium text-gray-900">Maximum Feet</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-6 mb-6">
                    <!-- Required -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Required</label>
                      <input 
                        v-model="requiredMaxFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="requiredMaxFeetOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                    
                    <!-- Existing -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Existing</label>
                      <input 
                        v-model="existingMaxFeet"
                        class="form-input"
                        placeholder="Feet"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="existingMaxFeetOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                  </div>

                  <h3 class="text-lg font-medium text-gray-900">Maximum Stories</h3>
                  <hr class="mb-4">
                  <div class="grid grid-cols-2 gap-6 mb-6">
                    <!-- Required -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Required</label>
                      <input 
                        v-model="requiredMaxStories"
                        class="form-input"
                        placeholder="Stories"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="requiredMaxStoriesOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>

                    <!-- Existing -->
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Existing</label>
                      <input 
                        v-model="existingMaxStories"
                        class="form-input"
                        placeholder="Stories"
                      />
                      <div class="text-center text-sm text-gray-500">Or</div>
                      <input 
                        v-model="existingMaxStoriesOr"
                        class="form-input"
                        placeholder="Type Here"
                      />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Does the building conform to height restrictions?</label>
                    <div class="grid grid-cols-2 gap-2 mt-1">
                      <label 
                        class="toggle-btn"
                        :class="{ 'toggle-btn-active': heightRestrictionCompliant === true }"
                      >
                        <input
                          type="radio"
                          v-model="heightRestrictionCompliant"
                          :value="true"
                          class="sr-only"
                        />
                        <span>Yes</span>
                      </label>
                      <label 
                        class="toggle-btn"
                        :class="{ 'toggle-btn-active': heightRestrictionCompliant === false }"
                      >
                        <input
                          type="radio"
                          v-model="heightRestrictionCompliant"
                          :value="false"
                          class="sr-only"
                        />
                        <span>No</span>
                      </label>
                    </div>
                    <p v-if="errors.heightRestrictionCompliant" class="error-message">{{ errors.heightRestrictionCompliant }}</p>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Why?</label>
                    <textarea 
                      v-model="heightRestrictionWhy"
                      class="form-input"
                      rows="2"
                      placeholder="Explain why the building conforms or does not conform to height restrictions"
                    ></textarea>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="flex justify-between mt-6">
                  <button 
                    v-if="store.currentStep > 0"
                    type="button"
                    @click="prevStep"
                    class="btn btn-secondary"
                  >
                    Previous
                  </button>
                  <div v-else class="w-20"></div>

                  <button 
                    v-if="store.currentStep < 4"
                    type="button"
                    @click="nextStep"
                    :disabled="!canProceed"
                    class="btn btn-primary"
                    :class="{ 'opacity-50 cursor-not-allowed': !canProceed }"
                  >
                    Next
                  </button>
                  <button 
                    v-else
                    type="submit"
                    :disabled="!canProceed"
                    class="btn btn-success"
                    :class="{ 'opacity-50 cursor-not-allowed': !canProceed }"
                  >
                    Generate Report
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

                      
            



<style scoped>
/* Apply Poppins globally */
:root {
  font-family: "Poppins", sans-serif !important;
}

* {
  font-family: "Poppins", sans-serif !important;
}

.form-input {
  @apply w-full px-3 py-2 text-sm
         bg-white border border-gray-300 rounded-md
         shadow-sm
         transition-all duration-300 ease-out
         placeholder:text-gray-600
         focus-visible:outline-none 
         focus-visible:border-blue-500
         focus-visible:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]
         focus-visible:scale-[1.02]
         focus-visible:translate-y-[-2px]
         disabled:cursor-not-allowed disabled:opacity-50
         hover:border-gray-500;
  font-family: "Poppins", sans-serif !important;
}

.btn {
  @apply inline-flex items-center justify-center px-4 py-2
         text-sm font-medium rounded-md
         transition-all duration-300 ease-in-out
         shadow-sm
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
         disabled:pointer-events-none disabled:opacity-50
         hover:scale-[1.02] hover:translate-y-[-1px]
         active:scale-[0.98] active:translate-y-[1px];
  font-family: "Poppins", sans-serif !important;
}

.btn-primary {
  @apply bg-blue-600 text-white
         shadow-[0_2px_4px_rgba(0,0,0,0.1),0_0_0_0_rgba(59,130,246,0.3)]
         hover:bg-blue-600/95 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),0_0_0_4px_rgba(59,130,246,0.2)]
         active:bg-blue-700 active:shadow-[0_1px_2px_rgba(0,0,0,0.1)]
         focus-visible:ring-blue-500;
}

.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300
         shadow-[0_2px_4px_rgba(0,0,0,0.05),0_0_0_0_rgba(209,213,219,0.3)]
         hover:bg-gray-50/90 hover:border-gray-500 
         hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_0_0_4px_rgba(209,213,219,0.2)]
         active:bg-gray-100 active:shadow-[0_1px_2px_rgba(0,0,0,0.05)]
         focus-visible:ring-gray-500;
}

.btn-success {
  @apply bg-green-600/90 text-white
         shadow-[0_2px_4px_rgba(0,0,0,0.1),0_0_0_0_rgba(22,163,74,0.3)]
         hover:bg-green-600/95 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),0_0_0_4px_rgba(22,163,74,0.2)]
         active:bg-green-700 active:shadow-[0_1px_2px_rgba(0,0,0,0.1)]
         focus-visible:ring-green-500;
}

.error-message {
  @apply mt-1.5 text-sm text-red-500
         transition-all duration-200 ease-in;
}

.toggle-btn {
  @apply inline-flex items-center justify-center px-4 py-2
         text-sm font-medium rounded-md
         bg-white border border-gray-300
         shadow-[0_2px_4px_rgba(0,0,0,0.05)]
         transition-all duration-300 ease-in-out
         hover:bg-gray-50/90 hover:border-gray-500
         hover:shadow-[0_3px_8px_rgba(0,0,0,0.06),0_0_0_2px_rgba(209,213,219,0.15)]
         hover:scale-[1.02] hover:-translate-y-[1px]
         active:scale-[0.98] active:translate-y-[1px]
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40
         focus-visible:scale-[1.02] focus-visible:-translate-y-[2px]
         cursor-pointer;
}

.toggle-btn-active {
  @apply bg-blue-600 text-white border-transparent
         shadow-[0_2px_8px_rgba(37,99,235,0.25)]
         transition-all duration-300 ease-in-out
         hover:bg-blue-600/95 
         hover:shadow-[0_4px_12px_rgba(37,99,235,0.2),0_0_0_2px_rgba(37,99,235,0.15)]
         hover:scale-[1.02] hover:-translate-y-[1px]
         active:scale-[0.98] active:translate-y-[1px] active:bg-blue-700
         active:shadow-[0_1px_2px_rgba(37,99,235,0.2)]
         focus-visible:ring-blue-500/40;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(-8px);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover .text-gray-500 {
  @apply text-gray-700;
}
</style>