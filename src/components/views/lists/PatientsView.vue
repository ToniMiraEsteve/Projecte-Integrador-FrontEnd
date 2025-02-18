<template>
  <div class="container-fluid py-4">
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
      <p>Cargando pacientes...</p>
    </div>

    <div v-else class="row justify-content-center mb-5">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card-body">
          <div class="input-group input-group-lg">
            <div class="input-group-prepend">
                <span class="input-group-text bg-white border-right-0">
                  <i class="fas fa-search text-primary"></i>
                </span>
            </div>
            <input
              v-model="searchTerm"
              type="text"
              class="form-control border-left-0 pl-0"
              placeholder="Buscar pacientes por nombre, email o teléfono"
              style="border-left: none; box-shadow: none;"
            >
            <button
              @click="$router.push('/patients/add')"
              class="btn btn-light ml-3 add-patient-btn"
              title="Añadir Paciente"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
      <h2 class="text-center mb-4">
        {{title }}
      </h2>
    </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="patient in paginatedPatients" :key="patient.id">
        <div
          class="card h-100 shadow-sm cursor-pointer patient-card"
          @click="$router.push('/patient/' + patient.id)"
        >
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div
                class="rounded-circle d-flex align-items-center justify-content-center mr-3 bg-primary"
                style="width: 50px; height: 50px;"
              >
                <span class="text-white font-weight-bold">{{ patient.fullName.charAt(0) }}</span>
              </div>
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">{{ patient.fullName }}</h5>
                <p class="card-text text-muted small mb-0">{{ calculateAge(patient.birthDate) }} años</p>
              </div>
            </div>

            <div class="border-top pt-3">
              <p class="card-text mb-2 d-flex align-items-center">
                <i class="fas fa-phone-alt text-primary mr-2"></i>
                <span class="text-muted">{{ patient.phone }}</span>
              </p>
              <p class="card-text d-flex align-items-center mb-0">
                <i class="fas fa-envelope text-primary mr-2"></i>
                <span class="text-muted">{{ patient.email }}</span>
              </p>
            </div>

            <div class="position-absolute" style="right: 10px; bottom: 10px">
              <button
                @click.stop="$router.push('/calls/patient/' + patient.id)"
                class="btn btn-light btn-sm"
                title="Lista de llamadas"
              >
                <i class="fas fa-phone text-primary"></i>
              </button>
              <button
                @click.stop="$router.push('/alerts/patient/' + patient.id)"
                class="btn btn-light btn-sm"
                title="Lista de alertes"
              >
                <i class="fas fa-exclamation-triangle text-primary"></i>
              </button>
              <button
                @click.stop="$router.push('/patients/edit/' + patient.id)"
                class="btn btn-light btn-sm mr-2"
                title="Editar"
              >
                <i class="fas fa-edit text-primary"></i>
              </button>
              <button
                @click.stop="deletePatient(patient)"
                class="btn btn-light btn-sm"
                title="Eliminar"
              >
                <i class="fas fa-trash-alt text-danger"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isLoading" class="pagination-container mt-4">
      <nav class="pagination" role="navigation" aria-label="pagination">
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          aria-label="Previous page"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <button
          v-for="pageNumber in getDisplayedPageNumbers()"
          :key="pageNumber"
          @click="changePage(pageNumber)"
          :class="['pagination-button', { 'is-current': pageNumber === currentPage }]"
          :aria-label="`Page ${pageNumber}`"
          :aria-current="pageNumber === currentPage ? 'page' : undefined"
        >
          {{ pageNumber }}
        </button>

        <button
          v-if="showEllipsisEnd()"
          class="pagination-ellipsis"
          disabled
        >
          <span>&hellip;</span>
        </button>

        <button
          class="pagination-button"
          :disabled="currentPage === getTotalPages()"
          @click="changePage(currentPage + 1)"
          aria-label="Next page"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </nav>
    </div>

    <div v-if="!isLoading && filteredPatients.length === 0" class="text-center mt-5">
      <div class="text-muted">
        <i class="fas fa-search fa-3x mb-3"></i>
        <h4>No se encontraron pacientes</h4>
        <p>Intenta con otros términos de búsqueda</p>
      </div>
    </div>

    <ConfirmDialog
      :show="showDeleteDialog"
      title="Eliminar Paciente"
      :message="deleteMessage"
      type="danger"
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCounterStore } from '@/stores/index.js'
import PatientsRepository from '@/repositories/patients.repository.js'
import ConfirmDialog from "/src/components/utils/ConfirmDialog.vue";
import { useMessagesStore } from '@/stores/messages';

export default {
  components: {
    ConfirmDialog
  },
  data() {
    return {
      searchTerm: '',
      showDeleteDialog: false,
      patientToDelete: null,
      isLoading: true,
      currentPage: 1,
      itemsPerPage: 12,
      title: ''
    }
  },
  props: {
    zoneId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapState(useCounterStore, ['patients', 'getZoneName']),
    filteredPatients() {
      const searchTermLower = this.searchTerm.toLowerCase().trim()
      return this.patients.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTermLower) ||
        patient.email.toLowerCase().includes(searchTermLower) ||
        patient.phone.includes(searchTermLower)
      )
    },
    paginatedPatients() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPatients.slice(start, end);
    },
    deleteMessage() {
      if (!this.patientToDelete) return ''
      return `¿Está seguro que desea eliminar al paciente ${this.patientToDelete.fullName}?`
    }
  },
  async mounted() {
      const filter = this.zoneId ? '?zoneId=' + this.zoneId : ''
      await this.loadPatients(filter)
      await this.loadZones()
      this.title = this.zoneId ? `Pacientes de ${this.getZoneName(this.zoneId)}` : 'Todos los pacientes'
      this.isLoading = false;
      if(!this.patients || this.patients.length === 0) {
        useMessagesStore().pushMessageAction({type: 'warning', message: 'No se han encontrado pacientes registrados'});
      }
  },
  methods: {
    ...mapActions(useCounterStore, ['loadPatients', 'loadZones']),

    deletePatient(patient) {
      this.patientToDelete = patient
      this.showDeleteDialog = true
    },

    async confirmDelete() {
      try {
        this.isLoading = true
        const repositoryPatients = new PatientsRepository()
        await repositoryPatients.removePatient(this.patientToDelete.id)
        await this.loadPatients()
        this.$emit('patient-deleted', this.patientToDelete.id)
        useMessagesStore().pushMessageAction({type: 'info', message: 'Paciente eliminado correctamente'})
      } catch (error) {
        console.error('Error al eliminar el paciente:', error)
        useMessagesStore().pushMessageAction({type: 'error', message: 'Error al eliminar el paciente'})
      } finally {
        this.isLoading = false
        this.showDeleteDialog = false
        this.patientToDelete = null
      }
    },

    cancelDelete() {
      this.showDeleteDialog = false
      this.patientToDelete = null
    },

    calculateAge(birthDate) {
      const today = new Date()
      const birthDateObj = new Date(birthDate)
      let age = today.getFullYear() - birthDateObj.getFullYear()
      const monthDiff = today.getMonth() - birthDateObj.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--
      }

      return age
    },
    getTotalPages() {
      return Math.ceil(this.filteredPatients.length / this.itemsPerPage);
    },
    changePage(page) {
      if (page >= 1 && page <= this.getTotalPages()) {
        this.currentPage = page
      }
    },
    getDisplayedPageNumbers() {
      const displayed = []
      const totalDisplayed = 5
      const totalPages = this.getTotalPages()

      if (totalPages <= totalDisplayed) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }

      displayed.push(1)

      let start = Math.max(2, this.currentPage - Math.floor(totalDisplayed / 2))
      let end = Math.min(totalPages - 1, start + totalDisplayed - 3)

      if (end === totalPages - 1) {
        start = Math.max(2, end - totalDisplayed + 3)
      }

      if (start > 2) {
        displayed.push('...')
      }

      for (let i = start; i <= end; i++) {
        displayed.push(i)
      }

      if (end < totalPages - 1) {
        displayed.push('...')
      }

      displayed.push(totalPages)

      return displayed
    },
    showEllipsisEnd() {
      return this.getTotalPages() > 5 && !this.getDisplayedPageNumbers().includes(this.getTotalPages() - 1)
    }
  }
}
</script>

<style scoped>
.patient-card {
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.patient-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.patient-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #007bff, #6610f2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.patient-card:hover::after {
  transform: scaleX(1);
}

.input-group-text {
  border-radius: 10px 0 0 10px !important;
  border: 1px solid #ced4da;
}

.input-group .form-control {
  border-radius: 0 10px 10px 0 !important;
  border: 1px solid #ced4da;
  font-size: 1rem;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #80bdff;
}

.input-group-text .fas {
  font-size: 1.2rem;
}

.btn-light {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  backdrop-filter: blur(5px);
}

.btn-light:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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

@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }
}

.patient-card.loading {
  pointer-events: none;
  opacity: 0.7;
}

.text-muted i {
  opacity: 0.5;
}

.add-patient-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: #fff;
  border: 1px solid #dee2e6;
}

.add-patient-btn:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

.input-group {
  flex: 1;
  margin-right: 10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.pagination {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 0.5rem;
}

.pagination-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4b5563;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover {
  background-color: #f3f4f6;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.is-current {
  background-color: #3b82f6;
  color: #ffffff;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.25rem;
  font-weight: 500;
  color: #4b5563;
}
</style>
