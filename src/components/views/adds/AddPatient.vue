<template>
  <h1 class="add-patient-title text-center mb-5">Añadir Nuevo Paciente</h1>

  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-xl-10">
        <div class="card shadow-sm">
          <div class="card-body">
            <form @submit.prevent="submitForm" class="needs-validation" novalidate>
              <div class="section-title d-flex align-items-center mb-4">
                <i class="fas fa-user text-primary mr-2"></i>
                <h6 class="mb-0">Información Personal</h6>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="fullName">Nombre completo *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="fullName"
                    v-model="form.fullName"
                    :class="{ 'is-invalid': validationErrors.fullName }"
                  >
                  <div class="invalid-feedback">{{ validationErrors.fullName }}</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="birthDate">Fecha de nacimiento *</label>
                  <input
                    type="date"
                    class="form-control"
                    id="birthDate"
                    v-model="form.birthDate"
                    :class="{ 'is-invalid': validationErrors.birthDate }"
                  >
                  <div class="invalid-feedback">{{ validationErrors.birthDate }}</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="dni">DNI *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="dni"
                    v-model="form.dni"
                    :class="{ 'is-invalid': validationErrors.dni }"
                  >
                  <div class="invalid-feedback">{{ validationErrors.dni }}</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="healthCardNumber">Nº Tarjeta Sanitaria *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="healthCardNumber"
                    v-model="form.healthCardNumber"
                    :class="{ 'is-invalid': validationErrors.healthCardNumber }"
                  >
                  <div class="invalid-feedback">{{ validationErrors.healthCardNumber }}</div>
                </div>
              </div>

              <div class="section-title d-flex align-items-center mb-4 mt-4">
                <i class="fas fa-address-book text-primary mr-2"></i>
                <h6 class="mb-0">Información de Contacto</h6>
              </div>

              <div class="row">
                <div class="col-md-12 mb-3">
                  <label for="fullAddress">Dirección completa *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="fullAddress"
                    v-model="form.fullAddress"
                    :class="{ 'is-invalid': validationErrors.fullAddress }"
                  >
                  <div class="invalid-feedback">{{ validationErrors.fullAddress }}</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="phone">Teléfono *</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="phone"
                    v-model="form.phone"
                    :class="{ 'is-invalid': validationErrors.phone }"
                  >
                  <div class="invalid-feedback">{{ validationErrors.phone }}</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="email">Email *</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="form.email"
                    :class="{ 'is-invalid': validationErrors.email }"
                  >
                  <div class="invalid-feedback">{{ validationErrors.email }}</div>
                </div>
              </div>

              <div>
                <label for="languages">Idiomas</label>
                <LanguagesSelect
                  v-model="form.languages"
                  placeholder="Seleccionar idiomas"
                  :invalid="!!validationErrors.languages"
                  :multiple="true"
                />
                <div class="invalid-feedback">{{ validationErrors.languages }}</div>
              </div>
              <div class="section-title d-flex align-items-center mb-4 mt-4">
                <i class="fas fa-info-circle text-primary mr-2"></i>
                <h6 class="mb-0">Información Adicional</h6>
              </div>
              <div class="d-flex">
                <div class="col-md-6 mb-3">
                  <label for="zoneId">Zona</label>
                  <SearchableSelect
                    v-model="form.zoneId"
                    :options="zones"
                    placeholder="Seleccionar zona"
                    :invalid="!!validationErrors.zoneId"
                  />
                  <div class="invalid-feedback">{{ validationErrors.zoneId }}</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="operatorId">Operador</label>
                  <SearchableSelect
                    v-model="form.operatorId"
                    :options="operators"
                    placeholder="Seleccionar operador"
                    :invalid="!!validationErrors.operatorId"
                  />
                  <div class="invalid-feedback">{{ validationErrors.operatorId }}</div>
                </div>
              </div>

              <div class="row" style="z-index: 0">
                <div class="col-md-12 mb-3">
                  <label for="personalFamilySituation">Situación personal/familiar</label>
                  <textarea
                    class="form-control"
                    id="personalFamilySituation"
                    v-model="form.personalFamilySituation"
                    rows="3"
                    :class="{ 'is-invalid': validationErrors.personalFamilySituation }"
                  ></textarea>
                  <small class="form-text text-muted">Describe si vive solo/a o acompañado/a, con quién, cuánto tiempo pasa solo/a, etc.</small>
                  <div class="invalid-feedback">{{ validationErrors.personalFamilySituation }}</div>
                </div>

                <div class="col-md-12 mb-3">
                  <label for="healthSituation">Situación sanitaria</label>
                  <textarea
                    class="form-control"
                    id="healthSituation"
                    v-model="form.healthSituation"
                    rows="3"
                    :class="{ 'is-invalid': validationErrors.healthSituation }"
                  ></textarea>
                  <small class="form-text text-muted">Describe enfermedades actuales, medicación, riesgos potenciales, etc.</small>
                  <div class="invalid-feedback">{{ validationErrors.healthSituation }}</div>
                </div>

                <div class="col-md-12 mb-3">
                  <label for="housingSituation">Situación de la vivienda</label>
                  <textarea
                    class="form-control"
                    id="housingSituation"
                    v-model="form.housingSituation"
                    rows="3"
                    :class="{ 'is-invalid': validationErrors.housingSituation }"
                  ></textarea>
                  <small class="form-text text-muted">Describe barreras arquitectónicas, estado de conservación, tipo de vivienda, ubicación, etc.</small>
                  <div class="invalid-feedback">{{ validationErrors.housingSituation }}</div>
                </div>

                <div class="col-md-12 mb-3">
                  <label for="personalAutonomy">Autonomía personal</label>
                  <textarea
                    class="form-control"
                    id="personalAutonomy"
                    v-model="form.personalAutonomy"
                    rows="3"
                    :class="{ 'is-invalid': validationErrors.personalAutonomy }"
                  ></textarea>
                  <small class="form-text text-muted">Describe si puede realizar las actividades básicas de la vida diaria y hasta qué punto.</small>
                  <div class="invalid-feedback">{{ validationErrors.personalAutonomy }}</div>
                </div>

                <div class="col-md-12 mb-3">
                  <label for="economicSituation">Situación económica</label>
                  <textarea
                    class="form-control"
                    id="economicSituation"
                    v-model="form.economicSituation"
                    rows="3"
                    :class="{ 'is-invalid': validationErrors.economicSituation }"
                  ></textarea>
                  <small class="form-text text-muted">Describe si tiene copago, qué bienes patrimoniales posee, etc.</small>
                  <div class="invalid-feedback">{{ validationErrors.economicSituation }}</div>
                </div>
              </div>

              <div class="section-title d-flex align-items-center mb-4 mt-4">
                <i class="fas fa-phone-alt text-primary mr-2"></i>
                <h6 class="mb-0">Contactos de Emergencia</h6>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-content-end mb-3">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    @click="addContact"
                  >
                    <i class="fas fa-plus mr-1"></i>
                    Añadir Contacto
                  </button>
                </div>

                <div v-for="(contact, index) in form.contactPersons" :key="index" class="card mb-3 contact-card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label :for="'firstName' + index">Nombre *</label>
                        <input
                          type="text"
                          class="form-control"
                          :id="'firstName' + index"
                          v-model="contact.firstName"
                          :class="{ 'is-invalid': getContactError(index, 'firstName') }"
                        >
                        <div class="invalid-feedback">{{ getContactError(index, 'firstName') }}</div>
                      </div>

                      <div class="col-md-6 mb-3">
                        <label :for="'lastName' + index">Apellidos *</label>
                        <input
                          type="text"
                          class="form-control"
                          :id="'lastName' + index"
                          v-model="contact.lastName"
                          :class="{ 'is-invalid': getContactError(index, 'lastName') }"
                        >
                        <div class="invalid-feedback">{{ getContactError(index, 'lastName') }}</div>
                      </div>

                      <div class="col-md-6 mb-3">
                        <label :for="'phone' + index">Teléfono *</label>
                        <input
                          type="tel"
                          class="form-control"
                          :id="'phone' + index"
                          v-model="contact.phone"
                          :class="{ 'is-invalid': getContactError(index, 'phone') }"
                        >
                        <div class="invalid-feedback">{{ getContactError(index, 'phone') }}</div>
                      </div>

                      <div class="col-md-6 mb-3">
                        <label :for="'relationship' + index">Relación *</label>
                        <input
                          type="text"
                          class="form-control"
                          :id="'relationship' + index"
                          v-model="contact.relationship"
                          :class="{ 'is-invalid': getContactError(index, 'relationship') }"
                        >
                        <div class="invalid-feedback">{{ getContactError(index, 'relationship') }}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      class="btn btn-link text-danger remove-contact"
                      @click="removeContact(index)"
                    >
                      <i class="fas fa-trash-alt"></i>
                      Eliminar contacto
                    </button>
                  </div>
                </div>

                <div v-if="form.contactPersons.length === 0" class="text-center p-4 border rounded">
                  <i class="fas fa-users text-muted mb-2" style="font-size: 2rem;"></i>
                  <p class="text-muted mb-0">No hay contactos de emergencia añadidos</p>
                </div>
              </div>

              <div class="d-flex justify-content-end mt-4">
                <button
                  type="button"
                  class="btn btn-secondary mr-2"
                  @click="$router.push('/patients')"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSubmitting"
                >
                  <span
                    v-if="isSubmitting"
                    class="spinner-border spinner-border-sm mr-2"
                  ></span>
                  {{ isSubmitting ? 'Guardando...' : 'Guardar Paciente' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from 'yup'
import PatientsRepository from '@/repositories/patients.repository.js'
import { mapActions, mapState } from 'pinia'
import { useCounterStore } from '@/stores/index.js'
import SearchableSelect from '@/components/utils/SearchableSelect.vue'
import LanguagesSelect from '@/components/utils/LanguagesSelect.vue'
import { useMessagesStore } from '@/stores/messages'

export default {
  props: ['id'],
  computed: {
    ...mapState(useCounterStore, ['operators', 'zones', 'languages']),
    isEditing() {
      return !!this.id;
    }
  },
  components: {
    SearchableSelect,
    LanguagesSelect
  },
  data() {
    return {
      form: {
        fullName: '',
        birthDate: '',
        fullAddress: '',
        dni: '',
        healthCardNumber: '',
        phone: '',
        email: '',
        zoneId: null,
        personalFamilySituation: '',
        healthSituation: '',
        housingSituation: '',
        personalAutonomy: '',
        economicSituation: '',
        operatorId: null,
        languages: [],
        contactPersons: []
      },
      validationErrors: {},
      isSubmitting: false,
      schema: null,
    }
  },

  async mounted() {

    this.initializeValidationSchema()
    await this.loadOperators()
    await this.loadZones()
    await this.loadLanguages()
    if (this.isEditing) {
      await this.loadPatientData();

    }


  },

  methods: {
    ...mapActions(useCounterStore, ['loadOperators', 'loadZones', 'loadLanguages']),

    async loadPatientData() {
      try {
        const patientRepository = new PatientsRepository()
        const response = await patientRepository.getPatientById(this.id)
        if (response.data) {
          this.form = { ...this.form, ...response.data };
          // Ensure languages are in the correct format for the select component

        } else {
          this.$router.push('/patients')
        }
      } catch (error) {
        // console.error('Error loading patient data:', error)
        useMessagesStore().pushMessageAction({ message: 'Error al cargar los datos del paciente', type: 'error' })
        this.$router.push('/patients')
      }
    },
    addContact() {
      this.form.contactPersons.push({
        firstName: '',
        lastName: '',
        phone: '',
        relationship: ''
      })
    },
    removeContact(index) {
      this.form.contactPersons.splice(index, 1)
    },
    getContactError(index, field) {
      return this.validationErrors[`contactPeople.${index}.${field}`]
    },
    initializeValidationSchema() {
      const contactPersonSchema = yup.object().shape({
        firstName: yup
          .string()
          .required('El nombre es obligatorio')
          .min(2, 'El nombre debe tener al menos 2 caracteres'),
        lastName: yup
          .string()
          .required('Los apellidos son obligatorios')
          .min(2, 'Los apellidos deben tener al menos 2 caracteres'),
        phone: yup
          .string()
          .required('El teléfono es obligatorio')
          .matches(/^\+?[0-9\s-]{9,}$/, 'El teléfono no es válido'),
        relationship: yup
          .string()
          .required('La relación es obligatoria')
          .min(2, 'La relación debe tener al menos 2 caracteres')
      });

      this.schema = yup.object().shape({
        fullName: yup
          .string()
          .required('El nombre completo es obligatorio')
          .min(3, 'El nombre debe tener al menos 3 caracteres')
          .max(100, 'El nombre no puede exceder los 100 caracteres'),
        birthDate: yup
          .date()
          .required('La fecha de nacimiento es obligatoria')
          .max(new Date(), 'La fecha no puede ser futura'),
        fullAddress: yup
          .string()
          .required('La dirección es obligatoria')
          .min(5, 'La dirección debe tener al menos 5 caracteres'),
        dni: yup
          .string()
          .required('El DNI es obligatorio')
          .matches(/^[0-9]{8}[A-Z]$/, 'El DNI debe tener 8 números y una letra mayúscula'),
        healthCardNumber: yup
          .string()
          .required('El número de tarjeta sanitaria es obligatorio')
          .min(8, 'El número de tarjeta sanitaria no es válido'),
        phone: yup
          .string()
          .required('El teléfono es obligatorio')
          .matches(/^[0-9]{9}$/, 'El teléfono debe tener 9 números'),
        email: yup
          .string()
          .required('El email es obligatorio')
          .email('El email no es válido'),
        zoneId: yup
          .number()
          .nullable()
          .transform((value) => (isNaN(value) ? null : value)),
        operatorId: yup
          .number()
          .nullable()
          .transform((value) => (isNaN(value) ? null : value)),
        personalFamilySituation: yup
          .string()
          .nullable(),
        healthSituation: yup
          .string()
          .nullable(),
        housingSituation: yup
          .string()
          .nullable(),
        personalAutonomy: yup
          .string()
          .nullable(),
        economicSituation: yup
          .string()
          .nullable(),
        contactPeople: yup.array().of(contactPersonSchema)
      })
    },

    async validateForm() {
      try {
        this.validationErrors = {}
        await this.schema.validate(this.form, { abortEarly: false })
        return true
      } catch (error) {
        if (error.inner) {
          error.inner.forEach(err => {
            this.validationErrors[err.path] = err.message
          })
        }
        return false
      }
    },

    async submitForm() {
      if (await this.validateForm()) {
        this.isSubmitting = true
        const formData = { ...this.form }

        if (formData.languages && Array.isArray(formData.languages)) {
          formData.languages = formData.languages.map(lang =>
            typeof lang === 'object' ? lang.name : lang
          );
        }

        try {
          const patientsRepository = new PatientsRepository()
          let response;
          if (this.isEditing) {
            response = await patientsRepository.changePatient(this.id, formData)
          } else {
            response = await patientsRepository.addPatient(formData)
          }

          if (response.success) {
            useMessagesStore().pushMessageAction({ message: 'Paciente guardado correctamente', type: 'success' })
            this.$router.push('/patients')
          } else {
            useMessagesStore().pushMessageAction({ message: response.message || 'Error al guardar el paciente', type: 'error' })
            throw new Error(response.message || 'Error al guardar el paciente')
          }
        } catch (error) {
          // console.error('Error al guardar el paciente:', error)
          useMessagesStore().pushMessageAction({ message: 'Error al guardar el paciente', type: 'error' })
          this.handleServerErrors(error.response?.data?.errors || { general: [error.message] })
        } finally {
          this.isSubmitting = false
        }
      }
    },

    handleServerErrors(errors) {
      this.validationErrors = {}
      Object.keys(errors).forEach(key => {
        this.validationErrors[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key]
      })
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
}

.form-control {
  height: calc(1.5em + 0.75rem + 2px);
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

textarea.form-control {
  height: auto;
  min-height: 100px;
}

.invalid-feedback {
  display: block;
}

.btn {
  font-weight: 400;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.section-title {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.form-text {
  color: #6c757d;
  font-size: 80%;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .btn {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .d-flex.justify-content-end {
    flex-direction: column-reverse;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.row > div {
  animation: fadeIn 0.3s ease-out forwards;
}

.add-patient-title {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}
</style>
